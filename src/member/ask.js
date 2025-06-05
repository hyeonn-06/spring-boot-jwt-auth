import axios from "axios";
import { useState } from "react";
import { getTokenFromCookie } from "../utils/cookieUtils";

const Ask = () => {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const accessToken = getTokenFromCookie("accessToken");
    const refreshToken = getTokenFromCookie("refreshToken");

    const handleQuestionChange = (e) => {
        setQuestion(e.target.value);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const requestUrl = `http://localhost/member/chatbot/ask.do`;
        try {
            const response = await axios.post(requestUrl, {question}, {
                headers: {Authorization: `Bearer ${accessToken}`, 'X-Refresh-Token': refreshToken, 'Content-Type': 'application/json'}
            });
            setAnswer(response.data);
        } catch (error) {
            alert("알 수 없는 오류 발생" + error);
        }
    }
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input onChange={handleQuestionChange}></input>
                <button>질문</button>
                <hr/>
                <div className="preserve-whitespace">
                    {answer}
                </div>
            </form>
        </div>
    )
}
export default Ask;