import { Avatar, Modal, Descriptions, Badge } from 'antd';
import styled from 'styled-components';

const ProfilePictureWrapper = styled.div`
width: 100%;
display: flex;
align-items: center;
justify-content: center;
`;

const decrypt = encrypted => {
  let org = '';
  for (let i = 0; i < encrypted.length; ++i)
    org += String.fromCharCode(encrypted.charCodeAt(i) - 3);
  return org;
}

const ProfileModal = ({ open, onCancel, me, signOut }) => {
  return (
    <Modal
      open={open}
      title='My Profile'
      cancelText='Close'
      okText='Log out'
      onCancel={onCancel}
      onOk={signOut}
      okButtonProps={{danger: true}}
    >
      <ProfilePictureWrapper>
        <Avatar size={64} style={{backgroundColor: '#00a2ae'}}>
          {me.name}
        </Avatar>
      </ProfilePictureWrapper>
      <Descriptions title="User Info" layout="vertical" bordered>
        <Descriptions.Item label="Username">{me.name}</Descriptions.Item>
        <Descriptions.Item label='password'>{decrypt(me.password)}</Descriptions.Item>
        <Descriptions.Item label="Status" span={3}>
          <Badge status="success" text="online" />
        </Descriptions.Item>
        <Descriptions.Item label="Friends">
          {
            me.friends.map(
              friend => (
                <>
                  {friend}
                  <br />
                </>
              )
            )
          }
        </Descriptions.Item>
        <Descriptions.Item label="Groups">
          {
            me.groups.map(
              ({ name, id }) => (
                <>
                  {name}
                  <br />
                </>
              )
            )
          }
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default ProfileModal;