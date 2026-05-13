import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './../css/kdh.css';

function Member() {
        const navigate = useNavigate();

        const [formData, setFormData] = useState({
                usertype: 'PERSONAL', // 기본값: 일반 회원
                userid: '',
                userpwd: '',
                pwdCheck: '',
                username: '',
                email: '',
                tel: '',
                zipcode: '',
                address: '',
                address_detail: '',
                businessName: '',
                businessNum: ''
        });

        const [messages, setMessages] = useState({
                idMsg: { text: '', isError: false },
                pwdMsg: { text: '', isError: false },
                pwdCheckMsg: { text: '', isError: false }
        });

        // ── 카카오 우편번호 API 실행 함수 ──
        const handleAddressSearch = () => {
                new window.daum.Postcode({
                        oncomplete: function (data) {
                                let fullAddr = data.address;
                                let extraAddr = '';

                                if (data.userSelectedType === 'R') {
                                        if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) extraAddr += data.bname;
                                        if (data.buildingName !== '' && data.apartment === 'Y') {
                                                extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                                        }
                                        fullAddr += (extraAddr !== '' ? ` (${extraAddr})` : '');
                                }

                                setFormData(prev => ({
                                        ...prev,
                                        zipcode: data.zonecode,
                                        address: fullAddr
                                }));

                                // 주소 입력 후 상세주소 칸으로 이동
                                document.getElementsByName('address_detail')[0].focus();
                        }
                }).open();
        };


        // 모든 입력창의 변화를 처리하는 통합 함수
        const handleChange = (e) => {
                const { name, value } = e.target;
                setFormData(prev => ({ ...prev, [name]: value }));

                // 유효성 검사
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
                if (messages.idMsg.isError || messages.pwdMsg.isError || formData.userpwd !== formData.pwdCheck) {
                        alert("입력 정보를 다시 확인해주세요.");
                        return;
                }

                //백엔드
                axios.post('http://localhost:9989/member/signup', {
                        userid: formData.userid,
                        userpwd: formData.userpwd,
                        username: formData.username,
                        tel: formData.tel,
                        email: formData.email,
                        zipcode: formData.zipcode,
                        address: formData.address,
                        address_detail: formData.address_detail,
                        businessName: formData.businessName,
                        businessNum: formData.businessNum,
                        usertype: formData.usertype
                })
                        .then(function (response) {
                                console.log(response.data);
                                if (response.data) { // 회원가입 성공
                                        alert("CANVAS의 가족이 되신 것을 환영합니다!");
                                        navigate("/login");
                                } else {
                                        alert('회원가입 실패하였습니다.')
                                }
                        })
                        .catch(function (error) {
                                console.error("Join Error:", error);
                                alert("회원가입 중 오류가 발생했습니다.");
                        })

        };

        return (
                <div className="login-wrapper">
                        <div className="login-container signup-container">
                                <div className="login-title">
                                        <p className="title-sub">CANVAS MEMBER</p>
                                        <h2 className="title-main">CREATE ACCOUNT</h2>
                                </div>

                                {/* 회원 유형 선택 */}
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

                                <form onSubmit={handleSignup} className="login-form">

                                        {/* 기업 회원 전용 필드 */}
                                        {formData.usertype === 'BUSINESS' && (
                                                <>
                                                        <div className="input-group">
                                                                <p>COMPANY NAME</p>
                                                                <input type="text" name="businessName" placeholder="상호명을 입력하세요" onChange={handleChange} />
                                                        </div>
                                                        <div className="input-group">
                                                                <p>BUSINESS NUMBER</p>
                                                                <input type="text" name="businessNum" placeholder="사업자 등록번호 (-제외)" onChange={handleChange} />
                                                        </div>
                                                </>
                                        )}

                                        {/* 공통 필드 */}
                                        <div className="input-group">
                                                <p>ID</p>
                                                <input type="text" name="userid" placeholder="5~10자 이내 입력" onChange={handleChange} />
                                                <div className="msg-container">
                                                        <span className={messages.idMsg.isError ? "error-msg" : "success-msg"}>{messages.idMsg.text}</span>
                                                </div>
                                        </div>

                                        <div className="input-group">
                                                <p>PASSWORD</p>
                                                <input type="password" name="userpwd" placeholder="8~12자 이내 영문/숫자/특수문자" onChange={handleChange} />
                                                <div className="msg-container">
                                                        <span className={messages.pwdMsg.isError ? "error-msg" : "success-msg"}>{messages.pwdMsg.text}</span>
                                                </div>
                                        </div>

                                        <div className="input-group">
                                                <p>CONFIRM PASSWORD</p>
                                                <input type="password" name="pwdCheck" placeholder="비밀번호 재입력" onChange={handleChange} />
                                                <div className="msg-container">
                                                        <span className={messages.pwdCheckMsg.isError ? "error-msg" : "success-msg"}>{messages.pwdCheckMsg.text}</span>
                                                </div>
                                        </div>

                                        <div className="input-group">
                                                <p>{formData.userType === 'BUSINESS' ? 'MANAGER NAME' : 'NAME'}</p>
                                                <input type="text" name="username" placeholder="이름을 입력하세요" onChange={handleChange} />
                                        </div>

                                        <div className="input-group">
                                                <p>Tel</p>
                                                <input type="text" name="tel" placeholder="010-0000-0000" onChange={handleChange} />
                                        </div>

                                        <div className="input-group">
                                                <p>E-MAIL</p>
                                                <input type="email" name="email" placeholder="example@canvas.com" onChange={handleChange} />
                                        </div>

                                        {/* 주소 필드 */}
                                        <div className="input-group">
                                                <p>ADDRESS</p>
                                                <div className="address-zip">
                                                        <input type="text" name="zipcode" placeholder="우편번호" value={formData.zipcode} readOnly  />
                                                        <button type="button" className="zip-btn" onClick={handleAddressSearch}>주소 검색</button>
                                                </div>
                                                <input type="text" name="address" placeholder="기본 주소" value={formData.address} readOnly className="address-main"  />
                                                <input type="text" name="address_detail" placeholder="상세 주소" value={formData.address_detail} onChange={handleChange} className="address-detail" />
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