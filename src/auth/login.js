import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [member_id, setMember_id] = useState('');
    const [pw, setPw] = useState('');
    // message 상태는 항상 문자열을 저장하도록 합니다.
    const [message, setMessage] = useState('');

    const navigate = useNavigate();

    const handleMemberIdChange = (e) => {
        setMember_id(e.target.value);
    };

    const handlePwChange = (e) => {
        setPw(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const requestUrl = "http://localhost/auth/login.do";

        console.log({ member_id, pw });

        try {
            const response = await axios.post(requestUrl, { member_id, pw }, {
                withCredentials: true // Http 통신시 쿠키나 HTTP 인증 헤더와 같은 인증 정보를 함께 전송하도록 설정
            });

            alert(response.data);

            console.log("로그인 성공! HttpOnly 쿠키가 브라우저에 설정되었습니다.");
            console.log("응답 메시지:", response.data);
            navigate("/");

        } catch (error) {
            console.error("로그인 실패:", error);

            let errorMessage = '로그인 중 알 수 없는 오류가 발생했습니다.';

            if (error.response) {
                // 서버로부터 에러 응답을 받은 경우 (예: HTTP 401 Unauthorized, 400 Bad Request 등)
                console.error('서버 응답 데이터:', error.response.data);
                console.error('서버 응답 상태:', error.response.status);
            } else if (error.request) {
                // 요청은 보내졌으나 응답을 받지 못한 경우 (네트워크 문제, 서버 다운 등)
                errorMessage = '서버로부터 응답을 받지 못했습니다. 서버가 실행 중인지 확인하세요.';
            } else {
                // 요청을 설정하는 과정에서 발생한 오류 (예: URL 오타, Axios 설정 오류)
                errorMessage = '요청 설정 중 오류 발생: ' + error.message;
            }

            alert(errorMessage); // 최종적으로 구성된 에러 메시지를 상태에 저장
        }
    };
    return (
        <div>
            <h1>Login Page</h1>
            <form onSubmit={handleSubmit}>
                <label>ID : </label>
                <input value={member_id} onChange={handleMemberIdChange}></input>
                <br /> {/* <br> 태그는 닫는 태그가 있어야 합니다. */}
                <label>PW : </label>
                <input type="password" value={pw} onChange={handlePwChange}></input>
                <button type="submit">로그인</button>
            </form>
            {/* message 상태는 이제 항상 문자열이므로 직접 렌더링 가능합니다. */}
            {message && <p style={{ color: 'red' }}>{message}</p>}
        </div>
    );
}

export default Login;