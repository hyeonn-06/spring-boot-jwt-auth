import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const My = () => {
    const [id, setId] = useState("로그인 필요");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserId = async () => {
            try{
                const res = await axios.get("http://localhost/member/getId.do", {
                withCredentials: true // 이 부분이 중요!
                });
                setId(res.data);
            } catch (err){
                console.error("사용자 ID를 가져오는데 실패했습니다 : " + err);
                setId("")
            }
        }
        fetchUserId();
    }, []);

    // id 값이 변경될 때마다 이 useEffect가 실행됩니다.
    // fetchUserId()가 끝나고 id 값이 설정된 후에 실행되어야 합니다.
    useEffect(() => {
        if (id === "") {
            // id가 "로그인 필요"일 경우 로그인 페이지로 리다이렉트
            alert("로그인 필요");
            navigate("/auth/login"); // 리다이렉트할 경로
        }
    }, [id, navigate]); // id와 navigate가 변경될 때마다 실행
    return (
        <div>
            <h1>My Page</h1>
            {id !== "" && (
                <h2>사용자 아이디 : {id}</h2>
            )}
        </div>
    );
}
export default My;