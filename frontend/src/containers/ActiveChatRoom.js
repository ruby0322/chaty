import { useState, useEffect, useRef } from 'react';
import { Input } from 'antd';
import { useChat } from './hooks/useChat';
import Message from '../components/Message';
import styled from 'styled-components';

const PaperStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  padding: '1rem',
};

const ChatBoxesWrapper = styled.div`
  width: 100%;
  height: 100%;
  background: #eeeeee;
  border-radius: 10px;
  margin: 20px;
  padding: 20px;
  overflow: auto;
`

const ActiveChatRoom = ({ friend }) => {
  const [body, setBody] = useState(''); 
  const bodyRef = useRef(null);
  const messageFooterRef = useRef(null);
  const { activeChatGroup, sendMessage, me, displayStatus, messages } = useChat();
  const [messageSent, setMessageSent] = useState(false);

  const handleSend = (msg) => {
    if (!msg) {
      displayStatus({
        type: 'error',
        msg: 'Please enter message body.'
      });
      return; 
    }
    sendMessage(msg);
    setBody('');
    setMessageSent(true);
  };

  const scrollToBottom = () => {
    messageFooterRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    scrollToBottom();
    setMessageSent(false);
  }, [messageSent]);

  useEffect(() => {
    bodyRef.current.focus();
    scrollToBottom();
    console.log(me);
  }, [me]);

  // debug
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div style={PaperStyle}>
      <ChatBoxesWrapper>
        {
          messages.length === 0 ?
            <p style={{ color: '#ccc' }}>
              {`Start Chatting w/ ${friend}`}
            </p> :
            messages.map(({ sender, body, created_at }, index) => (
              <Message
                isMe={sender === me.name}
                color='blue'
                key={`message-${index}`}
                sender={sender}
                body={body}
                timestamp={created_at}
                displayAvatar={index === 0 || sender !== messages[index - 1].sender}
              />
            ))
        }
        <span id='message-footer' ref={messageFooterRef} />
      </ChatBoxesWrapper>
      <Input.Search
        ref={bodyRef}
        value={body}
        onChange={e => setBody(e.target.value)}
        onSearch={handleSend}
        enterButton='Send'
        placeholder='What is up?'
        disabled={!activeChatGroup}
      />
    </div> 
  )
}

export default ActiveChatRoom;