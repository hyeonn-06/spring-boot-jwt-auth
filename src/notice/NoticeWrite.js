// src/notice/NoticeWrite.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getTokenFromCookie } from "../utils/cookieUtils";

function NoticeWrite() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const accessToken = getTokenFromCookie("accessToken");
  const refreshToken = getTokenFromCookie("refreshToken");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage('');

    if (!title.trim() || !content.trim()) {
      setError('제목과 내용을 모두 입력해주세요.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:80/admin/notice/write.do',
        { title, content },
        {
            headers: {Authorization: `Bearer ${accessToken}`, 'X-Refresh-Token': refreshToken, 'Content-Type': 'application/json'}

        }
      );
      setMessage(response.data); 
      alert('공지사항이 성공적으로 등록되었습니다.');
      navigate('/user/notice/list');
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) {
          alert('인증되지 않은 사용자이거나 세션이 만료되었습니다. 로그인이 필요합니다.');
        } else if (err.response.status === 403) {
          alert('이 작업을 수행할 권한이 없습니다.');
        } else {
          const serverMessage = typeof err.response.data === 'string' ? err.response.data : '공지사항 등록에 실패했습니다.';
          alert(serverMessage);
          setError(`등록 실패: ${err.response.status}`);
        }
      } else if (err.request) {
        alert('서버에 연결할 수 없습니다. 네트워크 상태를 확인해주세요.');
        setError('네트워크 오류');
      } else {
        alert(`예상치 못한 오류가 발생했습니다: ${err.message}`);
        setError(`오류: ${err.message}`);
      }
    }
  };

  return (
    <div>
      <h1>공지사항 등록</h1>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">제목:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: '100%', marginBottom: '10px' }}
          />
        </div>
        <div>
          <label htmlFor="content">내용:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="10"
            style={{ width: '100%', marginBottom: '10px' }}
          />
        </div>
        <button type="submit">등록</button>
        <button type="button" onClick={() => navigate('/user/notice/list')} style={{ marginLeft: '10px' }}>
          목록으로
        </button>
      </form>
    </div>
  );
}

export default NoticeWrite;