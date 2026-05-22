import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './../css/kdh.css';

function FindInfo() {

        const navigate = useNavigate();

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

                const endpoint = findMode === 'ID'
                        ? 'http://localhost:9990/member/find-id'
                        : 'http://localhost:9990/member/find-pwd';

                try {
                        // 비밀번호 찾기의 경우 메일 전송 시간이 걸릴 수 있으므로 미리 안내
                        if (findMode === 'PWD') {
                                alert("임시 비밀번호 메일을 전송 중입니다. 잠시만 기다려주세요...");
                        }

                        const response = await axios.post(endpoint, formData);

                        // 백엔드의 리턴 상태값 "OK"에 맞춰 분기 처리
                        if (response.data.status === 'OK') {
                                if (findMode === 'ID') {
                                        alert(`조회하신 아이디는 [ ${response.data.userid} ] 입니다.`);
                                } else {
                                        alert(response.data.message); // 메일 전송 성공 안내 문구
                                }
                                navigate('/login'); // 성공 후 로그인 페이지로 이동
                        } else {
                                // 백엔드가 보낸 구체적인 실패 메시지 노출 ("일치하는 회원 정보가 없습니다." 등)
                                alert(response.data.message || "일치하는 회원 정보가 없습니다.");
                        }
                } catch (error) {
                        console.error("Find Error:", error);
                        alert("처리 중 서버 통신 오류가 발생했습니다.");
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

                                {/* ID 찾기,PWD 찾기 탭 */}
                                <div className="find-mode-tab" style={{ display: 'flex', marginBottom: '20px', borderBottom: '1px solid #ddd' }}>
                                        <button
                                                className={`mode-btn ${findMode === 'ID' ? 'active' : ''}`}
                                                onClick={() => {
                                                        setFindMode('ID');
                                                        setFormData(prev => ({ ...prev, userid: '' }))
                                                }}
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

                                <form onSubmit={handleFind} className="login-form">
                                        {/* PWD 찾기일 때만 아이디 입력창 추가 */}
                                        {findMode === 'PWD' && (
                                                <div className="input-group">
                                                        <p>ID</p>
                                                        <input type="text"
                                                                name="userid"
                                                                placeholder="가입하신 아이디를 입력하세요"
                                                                onChange={handleChange}
                                                                required />
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