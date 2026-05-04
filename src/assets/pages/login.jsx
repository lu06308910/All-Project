import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './../css/kdh.css';

function Login() {
        const navigate = useNavigate();

        // 상태 관리 통합
        const [formData, setFormData] = useState({ userid: '', userpwd: '' });
        const [messages, setMessages] = useState({
                idMsg: { text: '', isError: false },
                pwdMsg: { text: '', isError: false }
        });

        // 입력 핸들러 및 유효성 검사
        const loginFormRender = (e) => {
                const { name, value } = e.target;
                setFormData(prev => ({ ...prev, [name]: value }));

                // 유효성 검사 로직
                if (name === 'userid') {
                        const reg = /^[A-Za-z0-9]{5,10}$/;
                        setMessages(prev => ({
                                ...prev,
                                // 삼항연산자
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

        // **로그인 실행 (Spring Boot API 호출)
        const loginStart = async (e) => {
                e.preventDefault();

                if (!formData.userid || !formData.userpwd) {
                        alert("아이디와 비밀번호를 모두 입력해주세요.");
                        return;
                }

                try {
                        // Spring Boot 서버 주소로 변경하세요 (예: http://localhost:8080/api/login)
                        const response = await axios.post('/api/member/login', formData);

                        if (response.data.status === 'success') {
                                // Spring에서 보낸 유저 정보와 토큰 등을 저장
                                sessionStorage.setItem('user', JSON.stringify(response.data.user));
                                sessionStorage.setItem('isLoggedIn', 'true');

                                alert(`${response.data.user.username}님, 환영합니다!`);
                                navigate("/"); // 페이지 이동
                        } else {
                                alert(response.data.message || "로그인 정보를 확인해주세요.");
                        }
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

                                <form onSubmit={loginStart} className="login-form">
                                        <div className="input-group">
                                                <p>ID</p>
                                                <input
                                                        type="text"
                                                        name="userid"
                                                        placeholder="아이디를 입력하세요"
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
                                                <a href="#!">ID | PASSWORD 찾기</a>
                                                <Link to="/member/signup">회원가입</Link>
                                        </div>

                                        <div className="social-login">
                                                <p>OR CONNECT WITH</p>
                                                <button type="button" className="kakao-login-btn" onClick={() => alert('카카오 로그인 구현 예정')}>
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