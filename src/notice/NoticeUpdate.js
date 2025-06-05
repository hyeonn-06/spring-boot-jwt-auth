// src/notice/NoticeWrite.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { getTokenFromCookie } from "../utils/cookieUtils";

function NoticeUpdate() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const accessToken = getTokenFromCookie("accessToken");
  const refreshToken = getTokenFromCookie("refreshToken");

  const queryParams = new URLSearchParams(location.search);
  const notice_no = queryParams.get('notice_no');

  useEffect(() => {
    if (!notice_no) {
      setError("수정할 공지사항의 번호가 URL에 제공되지 않았습니다.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`http://localhost:80/user/notice/view.do?notice_no=${notice_no}`);
        if (response.data) {
          setTitle(response.data.title);
          setContent(response.data.content);
        } else {
          setError("공지사항 데이터를 불러오는 데 실패했습니다.");
          setTitle(''); // 데이터를 못불러오면 비움
          setContent('');
        }
      } catch (err) {
          if (err.response) {
            setError(`데이터 로딩 오류: ${err.response.status} - ${err.response.data || err.response.statusText}`);
          } else if (err.request) {
            setError('네트워크 오류: 서버에 연결할 수 없습니다.');
          } else {
            setError(`예상치 못한 오류가 발생했습니다: ${err.message}`);
          }
          setTitle('');
          setContent('');
        } finally {
          setLoading(false);
        }        
      };
    fetchData();
  }, [notice_no]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage('');

    if (!title.trim() || !content.trim()) {
      setError('제목과 내용을 모두 입력해주세요.');
      return;
    }

    if (!notice_no) {
        setError('수정할 공지사항의 정보가 없습니다.');
        return;
    }    

    try {
      const response = await axios.post(
        'http://localhost:80/admin/notice/update.do',
        { notice_no: notice_no ,title, content },
        {
            headers: {Authorization: `Bearer ${accessToken}`, 'X-Refresh-Token': refreshToken, 'Content-Type': 'application/json'}

        }
      );
      setMessage(response.data); 
      alert('공지사항이 성공적으로 수정되었습니다.');
      navigate(`/user/notice/view?notice_no=${notice_no}`);
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

if (loading) {
  return <p>공지사항 정보를 불러오는 중입니다...</p>;
}

if (!notice_no || (error && !title && !content && !loading) ) {
    return (
        <div>
            <h1>공지사항 수정</h1>
            <p style={{ color: 'red' }}>{error || "수정할 공지사항을 불러올 수 없습니다."}</p>
            <button type="button" onClick={() => navigate('/user/notice/list')}>
                목록으로
            </button>
        </div>
    );
}

return (
  <div>
    <h1>공지사항 수정</h1>
    {message && <p style={{ color: 'green' }}>{message}</p>}
    {error && !message && <p style={{ color: 'red' }}>{error}</p>}
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title">제목:</label>
        <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: '100%', marginBottom: '10px' }}/>
      </div>
      <div>
        <label htmlFor="content">내용:</label>
        <textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} rows="10" style={{ width: '100%', marginBottom: '10px' }}/>
      </div>
      <button type="submit">수정 완료</button>
      <button type="button" onClick={() => navigate(`/user/notice/view?notice_no=${notice_no}`)} style={{ marginLeft: '10px' }}>
        취소
      </button>
    </form>
  </div>
  );
}

export default NoticeUpdate;