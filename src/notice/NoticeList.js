// src/notice/NoticeList.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

function NoticeList() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  const [pageObject, setPageObject] = useState(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const currentPage = Number.parseInt(searchParams.get("page") || "1")
  
  useEffect(() => {
    const fetchData = async (page = 1) => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:80/user/notice/list.do?page=${page}&perPageNum=10`);
        if (response.data && response.data.list) {
          setList(response.data.list);
          setPageObject(response.data.pageObject);
        } else {
          setList([]);
        }
        setError(null);
      } catch (err) {
        if (err.response) {
          setError(`Error: ${err.response.status} - ${err.response.data.message || err.response.statusText}`);
        } else if (err.request) {
          setError('네트워크 오류: 서버에 연결할 수 없습니다.');
        } else {
          setError(`예상치 못한 오류가 발생했습니다: ${err.message}`);
        }
        setList([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData(currentPage);
  }, [currentPage]);
  
  if (loading) {
    return <p>공지사항을 불러오는 중입니다...</p>;
  }
  
  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }
  
  const submit = (notice_no) => {
    console.log("넘겨질 게시글 번호", notice_no)
    navigate(`/user/notice/view?notice_no=${notice_no}`)
  }
 
  // -----------------------

  const handlePageClick = (page) => {
    setSearchParams({ page: page.toString() })
  }

  const handlePrevGroup = () => {
    if (pageObject && pageObject.startPage > 1) {
      const prevPage = pageObject.startPage - 1
      setSearchParams({ page: prevPage.toString() })
    }
  }

  const handleNextGroup = () => {
    if (pageObject && pageObject.endPage < pageObject.totalPage) {
      const nextPage = pageObject.endPage + 1
      setSearchParams({ page: nextPage.toString() })
    }
  }

const renderPagination = () => {
    if (!pageObject) return null;

    const pages = [];
    const liStyle = { display: 'inline-block', margin: '0 5px' };

    if (pageObject.startPage > 1) {
      pages.push(
        <li key="prev-group" style={liStyle}>
          <button onClick={handlePrevGroup} aria-label="Previous group">
            «
          </button>
        </li>,
      );
    }

    if (pageObject.page > 1) {
      pages.push(
        <li key="prev" style={liStyle}>
          <button onClick={() => handlePageClick(pageObject.page - 1)} aria-label="Previous">
            ‹
          </button>
        </li>,
      );
    }

    for (let i = pageObject.startPage; i <= pageObject.endPage; i++) {
      pages.push(
        <li key={i} style={liStyle}>
          <button 
            onClick={() => handlePageClick(i)} 
            style={i === pageObject.page ? { fontWeight: 'bold', textDecoration: 'underline' } : {}}
          >
            {i}
          </button>
        </li>,
      );
    }

    if (pageObject.page < pageObject.totalPage) {
      pages.push(
        <li key="next" style={liStyle}>
          <button onClick={() => handlePageClick(pageObject.page + 1)} aria-label="Next">
            ›
          </button>
        </li>,
      );
    }

    if (pageObject.endPage < pageObject.totalPage) {
      pages.push(
        <li key="next-group" style={liStyle}>
          <button onClick={handleNextGroup} aria-label="Next group">
            »
          </button>
        </li>,
      );
    }

    return <ul style={{ listStyleType: 'none', padding: 0, textAlign: 'center', marginTop: '20px' }}>{pages}</ul>;
  };

  // -----------------------
  
  return (
    <div>
    <div className='container'>
      <h1>공지사항 목록</h1>
      <button onClick={() => navigate('/admin/notice/write')} style={{ marginBottom: '20px', padding: '10px' }}>
        공지사항 등록
      </button>
        <table>
          <thead>
            <tr>
              <th>글번호</th>
              <th>제목</th>
              <th>작성일</th>
            </tr>
          </thead>  
          {list.map(list => (
            <tr key={list.notice_no} onClick={() => submit(list.notice_no)} className="dataRow">
              <td>{list.notice_no}</td>
              <td>{list.title}</td>
              <td>{new Date(list.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </table>
    </div>
      {renderPagination()}
    </div>
  );
}

export default NoticeList;