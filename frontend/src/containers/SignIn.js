import Login from '../components/Login';
import { useChat } from './hooks/useChat';

const encrypt = org => {
  let encrypted = '';
  for (let i = 0; i < org.length; ++i)
    encrypted += String.fromCharCode(org.charCodeAt(i) + 3);
  return encrypted;
}

const SingIn = () => {
  const { me, signIn, displayStatus } = useChat();

  const handleLogin = async ({username, password}) => {
    if (!username) {
      displayStatus({
        type: 'error',
        msg: 'Missing Username',
      });
    } else {
      await signIn(username, encrypt(password));
    }
  }

  return (
    <>
      <h1>Chaty</h1>
      <Login name={me.name} onFinish={handleLogin} />
    </>
  )
}

export default SingIn;
