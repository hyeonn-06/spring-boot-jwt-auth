import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Main from './main';
import Login from './auth/login';
import Ask from './member/ask';
import My from './member/My';
import NoticeList from './notice/NoticeList';
import NoticeView from './notice/NoticeView';
import NoticeWrite from './notice/NoticeWrite';
import NoticeUpdate from './notice/NoticeUpdate';
import SignUp from './auth/signUp';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <Main/>
        }/>
        <Route path="/auth/signUp" element={
          <SignUp/>
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
        <Route path="/user/notice/list" element={
          <NoticeList/>
        }/>
        <Route path="/user/notice/view" element={
          <NoticeView/>
        }/>
        <Route path="/admin/notice/write" element={
          <NoticeWrite/>
        }/>
        <Route path="/admin/notice/write" element={
          <NoticeWrite/>
        }/>
        <Route path="/admin/notice/update" element={
          <NoticeUpdate/>
        }/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
