import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Main from './main';
import Login from './auth/login';
import Ask from './member/ask';
import My from './member/My';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <Main/>
        }/>
        <Route path="/auth/login" element={
          <Login/>
        }/>
        <Route path="/member/my" element={
          <My/>
        }/>
        <Route path="/member/chatbot/ask" element={
          <Ask/>
        }/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
