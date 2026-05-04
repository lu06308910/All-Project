import React, { useState } from "react";
import { Link } from "react-router-dom";
import './../css/seul.css';

function Qna() {

        const [openIndex, setOpenIndex] = useState(null);

        const faqList = [
                {
                        category: "회원/정보관리", title: "가입 후 정보 변경은 어떻게 해야 하나요?", views: 3052,
                        answer: `1) 가입된 계정의 정보를 변경하려면 설정 메뉴에서 수정 가능합니다.\n2) 일부 항목은 본인 인증이 필요합니다.\n3) 고객센터에서도 변경을 도와드립니다.`
                },
                {
                        category: "회원/정보관리", title: "휴면 계정 복구는 어떻게 하나요?", views: 229,
                        answer: "휴면 계정은 로그인 시 본인 인증 후 자동으로 복구됩니다."
                },
                {
                        category: "회원/정보관리", title: "Apple 단말기에서 앱 오류가 발생해 실행이 안돼요", views: 121,
                        answer: "기기 재부팅 또는 최신 버전 업데이트 후 다시 시도해주세요."
                },
                {
                        category: "회원/정보관리", title: "앱 기본 알림이 오지 않아요. 어떻게 해결하나요?", views: 216,
                        answer: "알림 설정에서 앱 알림 허용을 켜주세요."
                }
        ];

        return (
                <div style={{ marginTop: '150px', marginBottom: '100px', width: '90%', display: 'flex', gap: '60px' }}>

                        {/* ▷ 왼쪽 사이드 메뉴 */}
                        <div className="side-menu">

                                <div style={{
                                        width: '220px',
                                        borderBottom: '2px solid #000',
                                        paddingBottom: '10px',
                                        marginBottom: '20px'
                                }}>
                                        <h2 style={{ margin: 0 }}>서비스 지원</h2>
                                </div>

                                <div className="qna-menu"><Link to="/qna">자주하는 질문</Link></div>
                                <div className="qna-menu"><Link to="/qna/write">1:1 문의하기</Link></div>
                                <div className="qna-menu"><Link to="/qna/noticelist">공지사항</Link></div>
                        </div>


                        {/* ▷ 오른쪽 컨텐츠 */}
                        <div style={{ width: '100%' }}>

                                {/* 상단 제목 */}
                                <div style={{
                                        borderBottom: '2px solid #000',
                                        paddingBottom: '10px',
                                        marginBottom: '20px'
                                }}>
                                        <h2 style={{ margin: 0 }}>자주 묻는 질문</h2>
                                </div>

                                {/* 검색창 + 버튼 */}
                                <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        border: '1px solid #ddd',
                                        padding: '15px',
                                        marginBottom: '20px'
                                }}>
                                        <input type="text" placeholder="검색어를 입력해주세요"
                                                style={{ border: 'none', width: '90%', outline: 'none', fontSize: '16px' }} />
                                        <button className="search-icon"></button>
                                </div>

                                <button onClick={() => (window.location.href = '/qna/write')}
                                        style={{
                                        padding: '10px 20px', backgroundColor: '#000', color: '#fff', border: 'none',
                                        float: 'right', marginBottom: '30px', cursor: 'pointer'
                                }}>
                                        1:1 문의하기
                                </button>

                                {/* Q&A 리스트 표 */}
                                <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                                        <thead>
                                                <tr style={{ borderBottom: '1px solid #ddd' }}>
                                                        <th style={{ width: '15%', padding: '12px', textAlign: 'left' }}>구분</th>
                                                        <th style={{ width: '70%', padding: '12px', textAlign: 'left' }}>제목</th>
                                                        <th style={{ width: '15%', padding: '12px', textAlign: 'center' }}>조회수</th>
                                                </tr>
                                        </thead>

                                        <tbody>
                                                {faqList.map((item, index) => (
                                                        <React.Fragment key={index}>

                                                                {/* 질문 row */}
                                                                <tr style={{borderBottom: '1px solid #eee', cursor: 'pointer' }} onClick={() => setOpenIndex(openIndex === index ? null : index)}>
                                                                        <td style={{ width: '15%', padding: '12px', textAlign: 'left' }}>{item.category}</td>
                                                                        <td style={{ width: '70%', padding: '12px' }}>{item.title}</td>
                                                                        <td style={{ width: '15%', padding: '12px', textAlign: 'center' }}>{item.views}</td>
                                                                </tr>

                                                                {/* 답변 row */}
                                                                {openIndex === index && (
                                                                        <tr>
                                                                                <td colSpan="3" style={{ background: '#f8f8f8', padding: '15px', fontSize: '14px', lineHeight: '1.6' }}>
                                                                                        {item.answer.split('\n').map((line, i) => <div key={i}>{line}</div>)}
                                                                                </td>
                                                                        </tr>
                                                                )}
                                                        </React.Fragment>
                                                ))}
                                        </tbody>
                                </table>

                        </div>

                </div>
        );
}

export default Qna;