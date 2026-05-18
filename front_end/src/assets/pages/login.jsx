import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './../css/kdh.css';

function Login() {
        const navigate = useNavigate();

        const KAKAO_REST_API_KEY = "27f1748ee75c1f2b921f46b129f0b82f";
        const KAKAO_REDIRECT_URI = "http://localhost:3000/oauth/callback/kakao";
        const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_REST_API_KEY}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;

        // 상태 관리 통합
        const [formData, setFormData] = useState({
                usertype: 'PERSONAL', // 기본값: 일반 회원
                userid: '', //백엔드 콘트롤러 내용이랑 동일
                userpwd: ''
        });

        const [messages, setMessages] = useState({
                idMsg: { text: '', isError: false },
                pwdMsg: { text: '', isError: false }
        });

        // 유효성 검사
        const loginFormRender = (e) => {
                const { name, value } = e.target;
                setFormData(prev => ({ ...prev, [name]: value }));

                if (name === 'userid') {
                        const reg = /^[A-Za-z0-9]{5,10}$/;
                        setMessages(prev => ({
                                ...prev,
                                idMsg: reg.test(value)
                                        ? { text: '사용 가능한 아이디 형식입니다.', isError: false }
                                        : { text: '아이디는 5~10자의 영문/숫자만 가능합니다.', isError: true }
                        }));
                } else if (name === 'userpwd') {
                        const reg = /^[A-Za-z0-9!@#]{8,12}$/;
                        setMessages(prev => ({
                                ...prev,
                                pwdMsg: reg.test(value)
                                        ? { text: '사용 가능한 비밀번호 형식입니다.', isError: false }
                                        : { text: '8~12자의 영문/숫자/특수문자(!@#)만 가능합니다.', isError: true }
                        }));
                }
        };

        // 로그인 실행
        const loginStart = async (e) => {
                e.preventDefault();

                if (!formData.userid || !formData.userpwd) {
                        alert("아이디와 비밀번호를 모두 입력해주세요.");
                        return;
                }

                try {
                        // formData에 userType이 포함되어 서버로 전송됩니다.
                        const response = await axios.post('http://localhost:9991/member/login', formData);

                        if (response.data.status === "OK") {
                                // 로그인 성공: 객체가 존재하면 성공
                                sessionStorage.setItem('logStatus', 'Y');

                                sessionStorage.setItem("loginUserId", response.data.userid);
                                sessionStorage.setItem("mId", response.data.mId);

                                sessionStorage.setItem('logId', response.data.userid);
                                sessionStorage.setItem('logName', response.data.username);
                                sessionStorage.setItem('usertype', response.data.usertype);



                                alert(`${response.data.username}님, 환영합니다!`);
                                window.location.href = "/";
                        } else {
                                alert(response.data.message || "로그인 정보를 확인해주세요.");
                        }
                        console.log("LOGIN RESPONSE:", response.data);
                } catch (error) {
                        console.error("Login Error:", error);
                        alert("로그인에 실패하였습니다.");
                }
        };

        return (
                <div className="login-wrapper">
                        <div className="login-container">
                                <div className="login-title">
                                        <p className="title-sub">CANVAS FURNITURE</p>
                                        <h2 className="title-main">SIGN IN</h2>
                                </div>

                                <div className="user-type-tab">
                                        <button
                                                type="button"
                                                className={formData.usertype === 'PERSONAL' ? 'active' : ''}
                                                onClick={() => setFormData({ ...formData, usertype: 'PERSONAL' })}
                                        >
                                                일반 회원
                                        </button>
                                        <button
                                                type="button"
                                                className={formData.usertype === 'BUSINESS' ? 'active' : ''}
                                                onClick={() => setFormData({ ...formData, usertype: 'BUSINESS' })}
                                        >
                                                기업 회원
                                        </button>
                                </div>

                                <form onSubmit={loginStart} className="login-form">
                                        <div className="input-group">
                                                <p>ID</p>
                                                <input
                                                        type="text"
                                                        name="userid"
                                                        // 탭 선택에 따른 동적 placeholder
                                                        placeholder={formData.usertype === 'BUSINESS' ? "기업 아이디를 입력하세요" : "아이디를 입력하세요"}
                                                        value={formData.userid}
                                                        onChange={loginFormRender}
                                                />
                                                <div className="msg-container">
                                                        <span className={messages.idMsg.isError ? "error-msg" : "success-msg"}>
                                                                {messages.idMsg.text}
                                                        </span>
                                                </div>
                                        </div>

                                        <div className="input-group">
                                                <p>PASSWORD</p>
                                                <input
                                                        type="password"
                                                        name="userpwd"
                                                        placeholder="비밀번호를 입력하세요"
                                                        value={formData.userpwd}
                                                        onChange={loginFormRender}
                                                />
                                                <div className="msg-container">
                                                        <span className={messages.pwdMsg.isError ? "error-msg" : "success-msg"}>
                                                                {messages.pwdMsg.text}
                                                        </span>
                                                </div>
                                        </div>

                                        <button type="submit" className="login-submit-btn">Login</button>

                                        <div className="auth-helper">
                                                <a href="/member/findmember">ID | PASSWORD 찾기</a>
                                                <span className="divider"></span>
                                                <Link to="/member/signup">회원가입</Link>
                                        </div>

                                        <div className="social-login">
                                                <p>OR CONNECT WITH</p>
                                                <button type="button"
                                                className="kakao-login-btn"
                                                onClick={() => window.location.href = KAKAO_AUTH_URL}>
                                                        <span className="kakao-icon"></span>
                                                        카카오톡으로 시작하기
                                                </button>
                                        </div>
                                </form>
                        </div>
                </div>
        );
}

export default Login;