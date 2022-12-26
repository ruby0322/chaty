import { useState, useEffect, createContext, useContext } from "react";
import { Button, message, notification, Space } from 'antd';
import { MessageOutlined } from '@ant-design/icons';

const client = new WebSocket('ws://localhost:4000');
const LOCALSTORAGE_ME_KEY = 'save-me';
const savedMe = localStorage.getItem(LOCALSTORAGE_ME_KEY);

const ChatContext = createContext({
  me: {},
  status: {},
  signedIn: false,
  messages: [],
  at: '',
  signIn: () => { },
  signOut: () => { },
  sendData: () => {},
  clearMessages: () => {},
  displayStatus: () => { },
  switchTo: () => { },
  sendMessage: () => {}
});
 
const ChatProvider = (props) => {

  const [messages, setMessages] = useState([]);
  const [at, setAt] = useState('');
  const [status, setStatus] = useState({});
  const [noti, setNoti] = useState({});
  const [signedIn, setSignedIn] = useState(false);
  const [me, setMe] = useState({ name: savedMe } || {});
  const [activeChatGroup, setActiveChatGroup] = useState('');

  client.onopen = () => {
    console.log('Websocket connection opened.');
  };

  client.onclose = () => {
    console.log('Websocket connection closed.');
  };

  client.onmessage = (byteString) => {
    const { data } = byteString;
    console.log(data);
    const [task, payload] = JSON.parse(data);
    if (task === 'output') {
      if (payload.group === activeChatGroup) {
        console.log(payload);
        setMessages([...messages, payload]);
      }
      if (payload.sender !== me.name && payload.group !== activeChatGroup) {
        setNoti({
          message: payload.sender,
          description: payload.body,
          placement: 'topRight',
          duration: 4,
          icon: <MessageOutlined />,
          btn: <Space>
            <Button
              onClick={() => {
                notification.destroy();
              }}
            >
              Close
            </Button>
            <Button
              type='primary'
              onClick={
                () => {
                  if (payload.group !== activeChatGroup)
                    switchTo(payload.group, payload.at);
                }
              }
            >
              Reply
            </Button>
          </Space>,
        });
      }
    } else if (task === 'status') {
      setStatus(payload);
    } else if (task === 'notification') { 
      setNoti(payload);
    } else if (task === 'init') {
      setMessages(payload);
    } else if (task === 'cleared') {
      setMessages([]);
    } else if (task === 'signed in') {
      setMe(payload.user);
      setSignedIn(true);
    } else if (task === 'added friend') {
      let newMe = { ...me };
      newMe.friends = [...newMe.friends, payload.name];
      setMe(newMe);
    } else if (task === 'history') {
      setMessages(payload.messages);
    } else if (task === 'added to group') {
      let newMe = { ...me };
      newMe.groups = [...newMe.groups, payload];
      setMe(newMe);
    }
  };

  const displayStatus = (s) => {
    if (!s.msg) return;
    const { type, msg } = s;
    const content = {
      content: msg,
      duration: 2
    }
    message[type](content);
  }

  const sendData = async (data) => {
    await client.send(JSON.stringify(data));
  };

  const sendMessage = async (message) => {
    await sendData([
      'input',
      {
        group: activeChatGroup,
        body: message,
        sender: me.name
      }
    ]);
  };

  const signIn = async (username, password) => {
    sendData(['sign in', {username, password}]);
  };

  const signOut = () => {
    setSignedIn(false);
    setMe({name: localStorage.getItem(LOCALSTORAGE_ME_KEY)});
    sendData(['log out']);
  }

  const switchTo = (group, newAt) => {
    if (group !== activeChatGroup) {
      setActiveChatGroup(group);
      setMessages([]);
      sendData(['get history', { group }]);
      setAt(newAt);
    }
  };
  
  const clearMessages = () => {
    sendData(['clear']);
  };

  useEffect(() => {
    displayStatus(status);
  }, [status]);

  useEffect(() => {
    if (noti && noti.message) {
      notification.info(noti);
    }
  }, [noti]);

  useEffect(() => {
    if (signedIn) {
      localStorage.setItem(LOCALSTORAGE_ME_KEY, me.name);
    }
  }, [me, signedIn]);

  return (
    <ChatContext.Provider
      value={{
        status,
        messages,
        clearMessages,
        sendData,
        signedIn,
        displayStatus,
        me,
        at,
        signIn,
        signOut,
        switchTo,
        sendMessage,
        activeChatGroup
      }}
      {...props}
    />
  )
};

const useChat = () => useContext(ChatContext);

export { ChatProvider, useChat };
