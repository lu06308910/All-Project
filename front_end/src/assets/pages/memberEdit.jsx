import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './../css/kdh.css';

const memberEdit = () => {
        //  초기 데이터 상태 (회원가입 필드와 매칭)
        const [formData, setFormData] = useState({
                userType: sessionStorage.getItem('usertype') || 'PERSONAL', // 서버에서 받아올 정보
                userid: sessionStorage.getItem('logId') || '',
                oldPassword: '', // 기존 pwd와 대조할 현재 비밀번호
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
                pwdMsg: { text: '', isError: false },
                pwdCheckMsg: { text: '', isError: false }
        });

        //  초기 데이터 가져오기
        useEffect(() => {
                const logId = sessionStorage.getItem('logId');
                let usertype = sessionStorage.getItem('usertype');

                console.log("현재 로그인 세션 정보:", { logId, usertype });

                const fetchUserData = async () => {
                        try {
<<<<<<< HEAD
                                const response = await axios.get(`http://localhost:9991/member/edit?userid=${logId}&usertype=${usertype}`);
=======
                                const response = await axios.get(`http://localhost:9990/member/edit?userid=${logId}&usertype=${usertype}`);
>>>>>>> 5192059255d8d579f5f9c48ce7037ff75b7f764e
                                if (response.data) {
                                        setFormData(prev => ({
                                                ...prev,
                                                ...response.data,
                                                userpwd: '',
                                                pwdCheck: '',
                                                oldPassword: ''
                                        }));
                                }
                        } catch (error) {
                                console.error("불러오기 실패:", error);
                                alert("회원 정보를 불러올 수 없습니다.");
                        }
                };
                fetchUserData();
        }, []);

        // 카오 주소 API
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
                                setFormData(prev => ({ ...prev, zipcode: data.zonecode, address: fullAddr }));
                                document.getElementsByName('address_detail')[0].focus();
                        }
                }).open();
        };

        // 입력 변화 처리 및 유효성 검사
        const handleChange = (e) => {
                const { name, value } = e.target;
                setFormData(prev => ({ ...prev, [name]: value }));

                if (name === 'userpwd') {
                        const reg = /^[A-Za-z0-9!@#]{8,12}$/;
                        setMessages(prev => ({
                                ...prev,
                                pwdMsg: value === '' ? { text: '', isError: false } :
                                        reg.test(value) ? { text: '사용 가능한 비밀번호입니다.', isError: false }
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

        const handleUpdate = async (e) => {
                e.preventDefault();
                if (!formData.oldPassword) {
                        alert("본인 확인을 위해 현재 비밀번호를 입력해주세요.");
                        return;
                }

                // 새 비밀번호를 입력했을 경우에만 유효성 검사
                if (formData.userpwd && (messages.pwdMsg.isError || messages.pwdCheckMsg.isError)) {
                        alert("새 비밀번호 형식이 올바르지 않습니다.");
                        return;
                }

                try {
                        const url = formData.usertype === 'PERSONAL'
<<<<<<< HEAD
                                ? 'http://localhost:9991/member/edit'
                                : 'http://localhost:9991/member/business/Edit';
=======
                                ? 'http://localhost:9990/member/edit'
                                : 'http://localhost:9990/member/business/Edit';
>>>>>>> 5192059255d8d579f5f9c48ce7037ff75b7f764e
                        const submitData = {
                                ...formData,
                                userpwd: formData.oldPassword, // 서버가 DB와 비교할 비밀번호
                                newPassword: formData.userpwd  // 실제 바뀔 비밀번호
                        };

                        const response = await axios.post(url, submitData,{

                                withCredentials: true
                        });

                        if (response.status === 200) {
                                alert("정보가 성공적으로 수정되었습니다.");
                                window.location.href = "/mypage";
                        }
                } catch (error) {
                        if (error.response && error.response.status === 401) {
                                alert("현재 비밀번호가 일치하지 않습니다.");
                        } else {
                                alert("수정 중 오류가 발생했습니다.");
                        }
                }
        };
        return (
                <div className="login-wrapper">
                        <div className="login-container signup-container">
                                <div className="login-title">
                                        <p className="title-sub">CANVAS MEMBER</p>
                                        <h2 className="title-main">MEMBER EDIT</h2>
                                </div>


                                <form onSubmit={handleUpdate} className="login-form">

                                        {/* 아이디 */}
                                        <div className="input-group">
                                                <p>ID (변경 불가)</p>
                                                <input type="text" name="userid" value={formData.userid} readOnly className="address-main" style={{ background: '#f9f9f9' }} />
                                        </div>

                                        {/* 기업 회원의 경우 상호명/사업자번호 표시 */}
                                        {formData.userType === 'BUSINESS' && (
                                                <>
                                                        <div className="input-group">
                                                                <p>COMPANY NAME</p>
                                                                <input type="text" name="businessName" value={formData.businessName} onChange={handleChange} />
                                                        </div>
                                                        <div className="input-group">
                                                                <p>BUSINESS NUMBER</p>
                                                                <input type="text" name="businessNum" value={formData.businessNum} readOnly className="address-main" />
                                                        </div>
                                                </>
                                        )}
                                        <div className="input-group">
                                                <p>CURRENT PASSWORD (본인 확인용)</p>
                                                <input
                                                        type="password"
                                                        name="oldPassword"  // name을 반드시 oldPassword로!
                                                        value={formData.oldPassword}
                                                        placeholder="현재 비밀번호를 입력하세요"
                                                        onChange={handleChange}
                                                        required
                                                />
                                        </div>

                                        <div className="input-group">
                                                <p>NEW PASSWORD (변경 시에만 입력)</p>
                                                <input type="password" name="userpwd" value={formData.userpwd} placeholder="새 비밀번호" onChange={handleChange} />
                                                <div className="msg-container">
                                                        <span className={messages.pwdMsg.isError ? "error-msg" : "success-msg"}>{messages.pwdMsg.text}</span>
                                                </div>
                                        </div>

                                        <div className="input-group">
                                                <p>CONFIRM NEW PASSWORD</p>
                                                <input type="password" name="pwdCheck" value={formData.pwdCheck} placeholder="비밀번호 재입력" onChange={handleChange} />
                                                <div className="msg-container">
                                                        <span className={messages.pwdCheckMsg.isError ? "error-msg" : "success-msg"}>{messages.pwdCheckMsg.text}</span>
                                                </div>
                                        </div>

                                        <div className="input-group">
                                                <p>{formData.usertype === 'BUSINESS' ? 'MANAGER NAME' : 'NAME'}</p>
                                                <input type="text" name="username" value={formData.username} onChange={handleChange} />
                                        </div>

                                        <div className="input-group">
                                                <p>E-MAIL</p>
                                                <input type="email" name="email" value={formData.email} onChange={handleChange} />
                                        </div>

                                        <div className="input-group">
                                                <p>ADDRESS</p>
                                                <div className="address-zip">
                                                        <input type="text" name="zipcode" value={formData.zipcode} readOnly />
                                                        <button type="button" className="zip-btn" onClick={handleAddressSearch}>주소 변경</button>
                                                </div>
                                                <input type="text" name="address" value={formData.address} readOnly className="address-main" />
                                                <input type="text" name="address_detail" value={formData.address_detail} onChange={handleChange} className="address-detail" />
                                        </div>

                                        <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
                                                <button type="submit" className="login-submit-btn" style={{ margin: 0 }}>Save Changes</button>
                                                <button type="button" className="login-submit-btn" style={{ margin: 0, background: '#eee', color: '#333' }}>Cancel</button>
                                        </div>
                                </form>
                        </div>
                </div>
        );
};

export default memberEdit;