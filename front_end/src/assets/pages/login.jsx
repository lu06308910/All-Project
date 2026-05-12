import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './../css/kdh.css';

function Login() {
        const navigate = useNavigate();

        // 상태 관리 통합
        const [formData, setFormData] = useState({
                userType: 'PERSONAL', // 기본값: 일반 회원
                userId: '', //백엔드 콘트롤러 내용이랑 동일
                password: ''
        });

        const [messages, setMessages] = useState({
                idMsg: { text: '', isError: false },
                pwdMsg: { text: '', isError: false }
        });

        // 유효성 검사
        const loginFormRender = (e) => {
                const { name, value } = e.target;
                setFormData(prev => ({ ...prev, [name]: value }));

                if (name === 'userId') {
                        const reg = /^[A-Za-z0-9]{5,10}$/;
                        setMessages(prev => ({
                                ...prev,
                                idMsg: reg.test(value)
                                        ? { text: '사용 가능한 아이디 형식입니다.', isError: false }
                                        : { text: '아이디는 5~10자의 영문/숫자만 가능합니다.', isError: true }
                        }));
                } else if (name === 'password') {
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

                if (!formData.userId || !formData.password) {
                        alert("아이디와 비밀번호를 모두 입력해주세요.");
                        return;
                }

                try {
<<<<<<< HEAD
                        // formData에 userType이 포함되어 서버로 전송됩니다.
                        const response = await axios.post('http://localhost:9990/api/member/login', formData);

                        if (response.data) {
                                // 로그인 성공: 객체가 존재하면 성공
                                sessionStorage.setItem('user', JSON.stringify(response.data));
                                sessionStorage.setItem('isLoggedIn', 'true');

                                alert(`${response.data.username}님, 환영합니다!`);
=======
                        const response = await axios.post('http://localhost:9991/api/member/login', {
                                userId: formData.userId,
                                password: formData.password
                        });

                        console.log("서버가 준 데이터", response.data);

                        if (response.data && response.data.userId) { // userId가 있는지 확인
                                sessionStorage.setItem('user', JSON.stringify(response.data));
                                sessionStorage.setItem('isLoggedIn', 'true');

                                
                                alert(`${response.data.userName}님, 환영합니다!`);
>>>>>>> d56a7d6aff0524ea7a333cc50721b46488cd7de0
                                navigate("/");
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

                                <div className="user-type-tab">
                                        <button
                                                type="button"
                                                className={formData.userType === 'PERSONAL' ? 'active' : ''}
                                                onClick={() => setFormData({ ...formData, userType: 'PERSONAL' })}
                                        >
                                                일반 회원
                                        </button>
                                        <button
                                                type="button"
                                                className={formData.userType === 'BUSINESS' ? 'active' : ''}
                                                onClick={() => setFormData({ ...formData, userType: 'BUSINESS' })}
                                        >
                                                기업 회원
                                        </button>
                                </div>

                                <form onSubmit={loginStart} className="login-form">
                                        <div className="input-group">
                                                <p>ID</p>
                                                <input
                                                        type="text"
                                                        name="userId"
                                                        // 탭 선택에 따른 동적 placeholder
                                                        placeholder={formData.userType === 'BUSINESS' ? "기업 아이디를 입력하세요" : "아이디를 입력하세요"}
                                                        value={formData.userId}
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
                                                        name="password"
                                                        placeholder="비밀번호를 입력하세요"
                                                        value={formData.password}
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