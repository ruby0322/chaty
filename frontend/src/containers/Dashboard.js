import { useState } from 'react';
import {
  UsergroupAddOutlined,
  UserAddOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Layout, Menu } from 'antd';
import ActiveChatRoom from './ActiveChatRoom';
import GroupModal from '../components/GroupModal';
import FriendModal from '../components/FriendModal';
import { useChat } from './hooks/useChat';
import styled from 'styled-components';
import ProfileModal from '../components/ProfileModal';
const { Header, Content, Sider } = Layout;

const getPrivateGroupName = (name1, name2) => {
  return [name1, name2].sort().join('_');
}

const SiderTitle = styled.div`
height: 2rem;
color: white;
text-align: center;
display: flex;
align-items: center;
padding: 1rem .5rem;
gap: 1rem;
margin: 1rem;
overflow: hidden;
cursor: pointer;
`;

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [addFriendModalOpen, setAddFriendModalOpen] = useState(false);
  const [newGroupModalOpen, setNewGroupModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const { at, me, sendData, switchTo, signOut } = useChat();

  function getItem(label, key, icon, children, onClick) {
    return {
      key,
      icon,
      children,
      label,
      onClick: children ? () => { } : () => {
        if (onClick) onClick();
      },
    };
  }
  
  const items = [
    // getItem('My Profile', 'menu-my-profile', <MehOutlined />),
    getItem('Add Friend', 'menu-add-friend', <UserAddOutlined />, undefined, () => {
      setAddFriendModalOpen(true);
    }),
    getItem('New Group', 'menu-new-group', <UsergroupAddOutlined />, undefined, () => {
      setNewGroupModalOpen(true);
    }),
    getItem('Friends', 'menu-friends', <UserOutlined />, me.friends.map(
      friend => getItem(
        friend,
        `friend-${friend}`,
        undefined,
        undefined,
        () => {
          // set active chat group id
          switchTo(getPrivateGroupName(me.name, friend), friend);
        }
      )
    )),
    getItem('Groups', 'menu-groups', <TeamOutlined />, me.groups.map(
      ({ name, id }) => getItem(
        name,
        `group-${id}`,
        undefined,
        undefined,
        () => {
          switchTo(id, name);
        }
      )
    )),
  ];

  const onAddFriendModalCreate = ({ name }) => {
    sendData(['add friend', {
      username: name
    }]);
    setAddFriendModalOpen(false);
  };
  
  const onNewGroupModalCreate = (payload) => {
    console.log(payload);
    payload.members.push(me.name);
    sendData(['new group', payload]);
    setNewGroupModalOpen(false);
  };
  
  return (
    <Layout
      style={{
        minHeight: '100vh',
        minWidth: '100vw',
      }}
    >
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <SiderTitle onClick={() => setProfileModalOpen(true)}> 
            <Avatar style={{backgroundColor: '#00a2ae'}}>
              {me.name}
            </Avatar>
            {
              !collapsed &&
              <h4>
                {me.name}
              </h4>
            }
          </SiderTitle>
        <Menu theme="dark" mode="inline" items={items} />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            textAlign: 'center',
            color: 'white',
          }}
          children={at}
        />
        <Content
          style={{
            margin: '0 16px',
          }}
        >
          <FriendModal
            open={addFriendModalOpen}
            onCreate={onAddFriendModalCreate}
            onCancel={() => setAddFriendModalOpen(false)}
          />   
          <GroupModal
            open={newGroupModalOpen}
            onCreate={onNewGroupModalCreate}
            onCancel={() => setNewGroupModalOpen(false)}
            friends={
              me.friends.filter(f => f !== me.name).map(friend => ({
                label: friend,
                value: friend
              }))
            }
          />   
          <ProfileModal
            open={profileModalOpen}
            onCancel={() => setProfileModalOpen(false)}
            me={me}
            signOut={signOut}
          />   
          <ActiveChatRoom friend={at} />
        </Content>
      </Layout>
    </Layout>
  );
};
export default Dashboard;