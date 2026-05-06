import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './../css/kdh.css';

function Member() {
        const navigate = useNavigate();

        // 회원가입 데이터 상태 관리
        const [formData, setFormData] = useState({
                userid: '',
                userpwd: '',
                pwdCheck: '',
                username: '',
                email: '',
                tel: '',
                zipcode: '',
                address: '',
                address_detail: ''
        });

        // 메시지 상태 관리
        const [messages, setMessages] = useState({
                idMsg: { text: '', isError: false },
                pwdMsg: { text: '', isError: false },
                pwdCheckMsg: { text: '', isError: false }
        });

        const handleChange = (e) => {
                const { name, value } = e.target;
                setFormData(prev => ({ ...prev, [name]: value }));

                // 유효성 검사 (로그인과 동일한 로직 + 추가)
                if (name === 'userid') {
                        const reg = /^[A-Za-z0-9]{5,10}$/;
                        setMessages(prev => ({
                                ...prev,
                                idMsg: reg.test(value)
                                        ? { text: '사용 가능한 아이디 형식입니다.', isError: false }
                                        : { text: '5~10자의 영문/숫자만 가능합니다.', isError: true }
                        }));
                } else if (name === 'userpwd') {
                        const reg = /^[A-Za-z0-9!@#]{8,12}$/;
                        setMessages(prev => ({
                                ...prev,
                                pwdMsg: reg.test(value)
                                        ? { text: '안전한 비밀번호입니다.', isError: false }
                                        : { text: '8~12자의 영문/숫자/!@#만 가능합니다.', isError: true }
                        }));
                } else if (name === 'pwdCheck') {
                        setMessages(prev => ({
                                ...prev,
                                pwdCheckMsg: value === formData.userpwd
                                        ? { text: '비밀번호가 일치합니다.', isError: false }
                                        : { text: '비밀번호가 일치하지 않습니다.', isError: true }
                        }));
                }
        };

        const handleSignup = async (e) => {
                e.preventDefault();

                // 필수 입력 및 유효성 체크
                if (messages.idMsg.isError || messages.pwdMsg.isError || formData.userpwd !== formData.pwdCheck) {
                        alert("입력 정보를 다시 확인해주세요.");
                        return;
                }

                try {
                        // Spring Boot API 호출
                        const response = await axios.post('/api/member/join', formData);
                        if (response.data.status === 'success') {
                                alert("CANVAS의 가족이 되신 것을 환영합니다!");
                                navigate("/login");
                        }
                } catch (error) {
                        console.error("Join Error:", error);
                        alert("회원가입 중 오류가 발생했습니다.");
                }
        };

        const memberFormRender = (e) => {
                const { name, value } = e.target;
                setFormData(prev => ({
                        ...prev,
                        [name]: value
                }));
        };

        return (
                <div className="login-wrapper">
                        <div className="login-container">
                                <div className="login-title">
                                        <p className="title-sub">CANVAS MEMBER</p>
                                        <h2 className="title-main">CREATE ACCOUNT</h2>
                                </div>

                                <form onSubmit={handleSignup} className="login-form">
                                        <div className="input-group">
                                                <label>ID</label>
                                                <input type="text" name="userid" placeholder="5~10자 이내 입력" onChange={handleChange} />
                                                <div className="msg-container">
                                                        <span className={messages.idMsg.isError ? "error-msg" : "success-msg"}>{messages.idMsg.text}</span>
                                                </div>
                                        </div>

                                        <div className="input-group">
                                                <label>PASSWORD</label>
                                                <input type="password" name="userpwd" placeholder="8~12자 이내 영문/숫자/특수문자" onChange={handleChange} />
                                                <div className="msg-container">
                                                        <span className={messages.pwdMsg.isError ? "error-msg" : "success-msg"}>{messages.pwdMsg.text}</span>
                                                </div>
                                        </div>

                                        <div className="input-group">
                                                <label>CONFIRM PASSWORD</label>
                                                <input type="password" name="pwdCheck" placeholder="비밀번호 재입력" onChange={handleChange} />
                                                <div className="msg-container">
                                                        <span className={messages.pwdCheckMsg.isError ? "error-msg" : "success-msg"}>{messages.pwdCheckMsg.text}</span>
                                                </div>
                                        </div>

                                        <div className="input-group">
                                                <label>NAME</label>
                                                <input type="text" name="username" placeholder="이름을 입력하세요" onChange={handleChange} />
                                                <div className="msg-container" />
                                        </div>

                                        <div className="input-group">
                                                <label>E-MAIL</label>
                                                <input type="email" name="email" placeholder="example@canvas.com" onChange={handleChange} />
                                                <div className="msg-container" />
                                        </div>

                                        <div className="input-group">
                                                <p>ADDRESS</p>
                                                <div className="address-zip">
                                                        <input
                                                                type="text"
                                                                name="zipcode"
                                                                placeholder="우편번호"
                                                                value={formData.zipcode || ''}
                                                                readOnly
                                                        />
                                                        <button type="button" className="zip-btn" onClick={() => alert('카카오맵 API 연동예정')}>
                                                                주소 검색
                                                        </button>
                                                </div>
                                                <input
                                                        type="text"
                                                        name="address"
                                                        placeholder="기본 주소"
                                                        value={formData.address || ''}
                                                        readOnly
                                                        className="address-main"
                                                />
                                                <input
                                                        type="text"
                                                        name="address_detail"
                                                        placeholder="상세 주소(동, 호수 등)"
                                                        value={formData.address_detail || ''}
                                                        onChange={memberFormRender} // 상세주소는 직접 입력
                                                        className="address-detail"
                                                />
                                        </div>

                                        <button type="submit" className="login-submit-btn">Create Account</button>

                                        <div className="auth-helper" style={{ justifyContent: 'center' }}>
                                                <p style={{ fontSize: '12px', color: '#888' }}>
                                                        이미 계정이 있으신가요? <a href="/login" style={{ color: '#000', fontWeight: '700' }}>로그인하기</a>
                                                </p>
                                        </div>
                                </form>
                        </div>
                </div>
        );
}

export default Member;