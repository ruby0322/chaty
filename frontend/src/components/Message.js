import { Avatar, Tag, Typography } from 'antd';
import styled from 'styled-components';

const StyledMessage = styled.div`
 display: flex;
 align-items: center;
 flex-direction: ${({isMe}) => (isMe ? 'row-reverse' : 'row')};
 margin: 8px 5px;
 }
`;

const Body = styled.div`
padding: 4px 8px;
max-width: 80%;
overflow-wrap: break-word;
background-color: rgba(255,255,255,.7);
border-radius: 5px;
margin: 8px;
`;

const Message = ({isMe, sender, body, displayAvatar}) => {
  return (
    <StyledMessage isMe={isMe}>
      {
        displayAvatar && <Avatar style={{backgroundColor: (isMe ? '#00a2ae' : '#7265e6')}}>{ sender }</Avatar>
      }
      <Body>
        {body}
      </Body>
    </StyledMessage>
  )
}

export default Message;
