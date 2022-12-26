import './App.css';
import SignIn from './containers/SignIn';
import { useChat } from './containers/hooks/useChat'
import styled from 'styled-components';
import Dashboard from './containers/Dashboard';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: fit-content;
  width: fit-content;
  h1 {
    margin: 0;
    margin-right: 20px;
    font-size: 3em;
  }
`;

const App = () => {
  const { signedIn } = useChat();

  return (
    <div className="App">
      {
        signedIn ?
        <Dashboard /> :
        <SignIn />
      }
    </div>
  );
}

export default App
