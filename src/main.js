import axios from "axios";
import { useEffect, useState } from "react";

const Main = () => {
    const [member_id, setMember_id] = useState("");

    useEffect(() => {
        const fetchMemberId = async () => {
            try{
                    const res = await axios.get("http://localhost/auth/getId.do", {
                    withCredentials: true // 이 부분이 중요!
                    });
                    setMember_id(res.data);
            } catch (err){
                console.error("사용자 ID를 가져오는데 실패했습니다 : " + err);
                setMember_id("");
            }
        }
        fetchMemberId();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const requestUrl = "http://localhost/auth/logout.do";
        try {
            const response = await axios.post(requestUrl, {member_id});
            alert(response.data);
            setMember_id("");
        } catch (error) {
            alert("알 수 없는 오류 발생");
        }
    }

    return (
        <div>
            <h1>Main Page</h1>
            <a href="/auth/login">로그인</a>
            <br/>
            <button className="btn btn-primary" onClick={handleSubmit}>로그아웃</button>
            <br/>
            <a href="/member/my">마이페이지</a>
            <br/>
            <a href="/admin/my">관리자 페이지</a>
            <br/>
            <a href="/member/chatbot/ask">챗봇과 대화하기</a>
            <br/>
            <a href="/user/notice/list">공지사항</a>
        </div>
    )
}
export default Main;