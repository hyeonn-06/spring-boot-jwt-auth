import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
    const memberIdRegEx = /^[A-Za-z][A-Za-z0-9]{3,19}$/;
    const [member_id, setMember_id] = useState("");
    const [pw, setPw] = useState("");
    const [message, setMessage] = useState("");
    const [isMemberIdReadOnly, setIsMemberIdReadOnly] = useState(false);

    const navigate = useNavigate();

    const handleMemberIdChange = (e) => {
        setMember_id(e.target.value);

    };

    const handlePwChange = (e) => {
        setPw(e.target.value);
    };

    const MemberIdCheck = (member_id) => {
        return memberIdRegEx.test(member_id);
    };

    const handleMemberIdCheck = async (e) => {
        e.preventDefault();
        const requestUrl = "http://localhost/auth/validateMemberId.do";
        console.log("입력된 아이디 : ", member_id);
        console.log("아이디 형식 검사 : ",MemberIdCheck(member_id));
        if(!member_id){
            setMessage("아이디를 입력해주세요.");
        }
        else if(!MemberIdCheck(member_id)){
            setMessage("아이디 형식과 맞지 않습니다.");
        }
        else {
            try {
                const response = await axios.post(requestUrl, { member_id }, {
                    withCredentials: true // Http 통신시 쿠키나 HTTP 인증 헤더와 같은 인증 정보를 함께 전송하도록 설정
                });

                console.log("응답 메시지:", response.data);
                setMessage(response.data);
                setIsMemberIdReadOnly(true);

            } catch (error) {
                if(error.response.status === 400)
                    setMessage("이미 사용중인 아이디입니다.");
                setIsMemberIdReadOnly(false);
            }
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const requestUrl = "http://localhost/auth/signUp.do";

        console.log({ member_id, pw });

        try {
            const response = await axios.post(requestUrl, { member_id, pw }, {
                withCredentials: true // Http 통신시 쿠키나 HTTP 인증 헤더와 같은 인증 정보를 함께 전송하도록 설정
            });

            alert(response.data);

            console.log("응답 메시지:", response.data);
            navigate("/");

        } catch (error) {
            console.error("회원가입 실패:", error);

            let errorMessage = '회원 가입 중 알 수 없는 오류가 발생했습니다.';

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
            <h1>SignUp Page</h1>
            <form onSubmit={handleSubmit}>
                <label>ID : </label>
                <input value={member_id} onChange={handleMemberIdChange} readOnly={isMemberIdReadOnly}></input>
                <button type="button" onClick={handleMemberIdCheck} disabled={isMemberIdReadOnly}>중복 확인</button> {message}
                <br/>
                <label>PW : </label>
                <input type="password" value={pw} onChange={handlePwChange}></input>
                <button type="submit" disabled={!isMemberIdReadOnly}>가입</button>
            </form>
        </div>
    )
}
export default SignUp;