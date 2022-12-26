import Message from "./models/Message";
import User from "./models/User";
import Group from "./models/Group";

let connections = {};

const getPrivateGroupName = (name1, name2) => {
  return [name1, name2].sort().join("_");
};

const sendData = (data, webSocketConnection) => {
  webSocketConnection.send(JSON.stringify(data));
};

const sendStatus = (payload, webSocketConnection) => {
  sendData(["status", payload], webSocketConnection);
};

const sendNotification = (payload, webSocketConnection) => {
  sendData(["notification", payload], webSocketConnection);
};

const notify = (data, username) => {
  if (connections[username]) {
    sendData(data, connections[username]);
    console.log(`notified ${username}`);
  }
};

const broadcastMessage = (webSockectServer, data, status) => {
  webSockectServer.clients.forEach((client) => {
    sendData(data, client);
    sendStatus(status, client);
  });
};

export default {
  onClose: (webSocketConnection) => async () => {
    if (connections[webSocketConnection.username]) {
      connections[webSocketConnection.username] = undefined;
    }
    console.log("Client disconnected");
  },
  onMessage: (webSocketConnection, webSockectServer) => async (byteString) => {
    const [task, payload] = JSON.parse(byteString);
    console.log(
      `Client '${webSocketConnection.username}' sent: ${byteString}.`
    );
    if (task === "input") {
      const message = new Message(payload);
      await message.save();

      const group = await Group.findOne(
        payload.group.includes("_")
          ? { name: payload.group }
          : { _id: payload.group }
      );

      group.members.forEach((member) => {
        if (member !== payload.sender) {
          notify(
            [
              "output",
              {
                ...payload,
                at: payload.group.includes("_") ? payload.sender : group.name,
              },
            ],
            member
          );
        }
      });
      sendData(["output", payload], webSocketConnection);
    } else if (task === "clear") {
      Message.deleteMany({}, () => {
        broadcastMessage(webSockectServer, ["cleared"], {
          type: "info",
          msg: "Message cache cleared.",
        });
      });
    } else if (task === "sign in") {
      if (connections[payload.username]) {
        sendStatus(
          {
            type: "error",
            msg: `You've already signed in on another device!`,
          },
          webSocketConnection
        );
        return;
      }
      webSocketConnection.username = payload.username;
      connections[webSocketConnection.username] = webSocketConnection;
      const existing = await User.findOne({ name: payload.username });
      if (!existing) {
        const newUser = new User({
          name: payload.username,
          password: payload.password,
          friends: [payload.username],
          groups: [],
        });
        await newUser.save();
        const newPrivateGroup = new Group({
          name: getPrivateGroupName(newUser.name, newUser.name),
          members: [newUser.name],
        });
        await newPrivateGroup.save();
        sendData(["signed in", { user: newUser }], webSocketConnection);
        sendStatus(
          {
            type: "success",
            msg: `Signed up successfully!`,
          },
          webSocketConnection
        );
      } else {
        if (existing.password === payload.password) {
          sendData(["signed in", { user: existing }], webSocketConnection);
          sendStatus(
            {
              type: "success",
              msg: `Signed in successfully!`,
            },
            webSocketConnection
          );
        } else {
          sendStatus(
            {
              type: "error",
              msg: `Authentication Failed.`,
            },
            webSocketConnection
          );
        }
      }
    } else if (task === "log out") {
      connections[webSocketConnection.username] = undefined;
    } else if (task === "add friend") {
      const foundUser = await User.findOne(
        { name: payload.username },
        { name: 1, friends: 1 }
      );
      if (foundUser) {
        if (foundUser.friends.includes(webSocketConnection.username)) {
          sendStatus(
            {
              type: "error",
              msg: `User '${foundUser.name}' is already your friend.`,
            },
            webSocketConnection
          );
        } else {
          await User.updateOne(
            { name: webSocketConnection.username },
            {
              $push: {
                friends: foundUser.name,
              },
            }
          );
          await User.updateOne(
            { name: foundUser.name },
            {
              $push: {
                friends: webSocketConnection.username,
              },
            }
          );
          const newPrivateGroup = new Group({
            name: getPrivateGroupName(
              webSocketConnection.username,
              foundUser.name
            ),
            members: [webSocketConnection.username, foundUser.name],
          });
          await newPrivateGroup.save();
          sendStatus(
            {
              type: "success",
              msg: `Added '${foundUser.name}' to your friend list!`,
            },
            webSocketConnection
          );
          sendData(
            [
              "added friend",
              {
                name: foundUser.name,
              },
            ],
            webSocketConnection
          );
          notify(
            [
              "added friend",
              {
                name: webSocketConnection.username,
              },
            ],
            foundUser.name
          );
          notify(
            [
              "status",
              {
                type: "info",
                msg: `'${webSocketConnection.username}' added you as a friend!`,
              },
            ],
            foundUser.name
          );
        }
      } else {
        sendStatus(
          {
            type: "error",
            msg: "User not found, please try again.",
          },
          webSocketConnection
        );
      }
    } else if (task === "get history") {
      const messages = await Message.find(payload);
      sendData(["history", { messages }], webSocketConnection);
    } else if (task === "new group") {
      const newGroup = new Group(payload);
      await newGroup.save();
      newGroup.members.forEach(async (member) => {
        console.log(`Adding ${member} to group ${newGroup.name}`);
        await User.updateOne(
          { name: member },
          {
            $push: {
              groups: {
                name: newGroup.name,
                id: newGroup._id,
              },
            },
          }
        );
        console.log(`Added ${member} to group ${newGroup.name}`);
        notify(
          ["added to group", { name: newGroup.name, id: newGroup._id }],
          member
        );
        if (member === webSocketConnection.username) {
          notify(
            [
              "status",
              {
                type: "success",
                msg: `Group '${newGroup.name}' Created.`,
              },
            ],
            member
          );
        } else {
          notify(
            [
              "status",
              {
                type: "info",
                msg: `You are added to group '${newGroup.name}' by '${webSocketConnection.username}'.`,
              },
            ],
            member
          );
        }
      });
    }
  },
};
