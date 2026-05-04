import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './../css/kdh.css';

function FindInfo() {
        // 찾으려는 항목 (ID 또는 PWD)
        const [findMode, setFindMode] = useState('ID');

        // 입력 데이터 상태
        const [formData, setFormData] = useState({
                userType: 'PERSONAL',
                username: '',
                email: '',
                userid: ''
        });

        const handleChange = (e) => {
                const { name, value } = e.target;
                setFormData(prev => ({ ...prev, [name]: value }));
        };

        const handleFind = async (e) => {
                e.preventDefault();

                const endpoint = findMode === 'ID' ? '/api/member/find-id' : '/api/member/find-pwd';

                try {
                        const response = await axios.post(endpoint, formData);
                        if (response.data.status === 'success') {
                                // 예: "찾으시는 아이디는 [abc***] 입니다." 또는 "이메일로 임시 비밀번호를 발송했습니다."
                                alert(response.data.message);
                        } else {
                                alert("일치하는 회원 정보가 없습니다.");
                        }
                } catch (error) {
                        console.error("Find Error:", error);
                        alert("처리 중 오류가 발생했습니다.");
                }
        };
// ------------------------------------------------------------------------------------
        return (
                <div className="login-wrapper">
                        <div className="login-container">
                                <div className="login-title">
                                        <p className="title-sub">CANVAS SUPPORT</p>
                                        <h2 className="title-main">{findMode === 'ID' ? 'FIND ID' : 'FIND PASSWORD'}</h2>
                                </div>

                                {/* ID 찾기,PWD 찾기 탭 */}
                                <div className="find-mode-tab" style={{ display: 'flex', marginBottom: '20px', borderBottom: '1px solid #ddd' }}>
                                        <button
                                                className={`mode-btn ${findMode === 'ID' ? 'active' : ''}`}
                                                onClick={() => setFindMode('ID')}
                                                style={{ flex: 1, padding: '15px', border: 'none', background: 'none', cursor: 'pointer', fontWeight: findMode === 'ID' ? '700' : '400' }}
                                        >
                                                아이디 찾기
                                        </button>
                                        <button
                                                className={`mode-btn ${findMode === 'PWD' ? 'active' : ''}`}
                                                onClick={() => setFindMode('PWD')}
                                                style={{ flex: 1, padding: '15px', border: 'none', background: 'none', cursor: 'pointer', fontWeight: findMode === 'PWD' ? '700' : '400' }}
                                        >
                                                비밀번호 찾기
                                        </button>
                                </div>

                                {/* 회원 타입 탭 */}
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

                                <form onSubmit={handleFind} className="login-form">
                                        {/* PWD 찾기일 때만 아이디 입력창 추가 */}
                                        {findMode === 'PWD' && (
                                                <div className="input-group">
                                                        <p>ID</p>
                                                        <input type="text" name="userid" placeholder="가입하신 아이디를 입력하세요" onChange={handleChange} required />
                                                </div>
                                        )}

                                        <div className="input-group">
                                                <p>{formData.userType === 'BUSINESS' ? 'BUSINESS NAME' : 'NAME'}</p>
                                                <input
                                                        type="text"
                                                        name="username"
                                                        placeholder={formData.userType === 'BUSINESS' ? "상호명을 입력하세요" : "이름을 입력하세요"}
                                                        onChange={handleChange}
                                                        required
                                                />
                                        </div>

                                        <div className="input-group">
                                                <p>E-MAIL</p>
                                                <input type="email" name="email" placeholder="가입 시 등록한 이메일" onChange={handleChange} required />
                                        </div>

                                        <button type="submit" className="login-submit-btn">
                                                {findMode === 'ID' ? 'Find My ID' : 'Send Temporary Password'}
                                        </button>

                                        <div className="auth-helper" style={{ justifyContent: 'center', marginTop: '20px' }}>
                                                <Link to="/login" style={{ fontSize: '13px', color: '#666', textDecoration: 'underline' }}>로그인으로 돌아가기</Link>
                                        </div>
                                </form>
                        </div>
                </div>
        );
}

export default FindInfo;