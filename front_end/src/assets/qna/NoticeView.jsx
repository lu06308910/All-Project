import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import './../css/seul.css';

function NoticeView() {
    const { id } = useParams(); // URL 파라미터에서 공지사항 ID 추출
    const [notice, setNotice] = useState(null); // 데이터 상태 관리

    // 백엔드에서 상세 데이터 가져오기
    useEffect(() => {
        console.log("보내는 ID값:", id);
<<<<<<< HEAD
        axios.get(`http://localhost:9991/notice/view/${id}`)
=======
        axios.get(`http://localhost:9990/notice/view/${id}`)
>>>>>>> 5192059255d8d579f5f9c48ce7037ff75b7f764e
            .then(response => {
                console.log("상세 데이터 확인:", response.data);
                setNotice(response.data);
            })
            .catch(error => {
                console.error("데이터 로딩 중 오류 발생:", error);
                alert("존재하지 않는 게시글이거나 서버 오류입니다.");
            });
    }, [id]);

    // 데이터 로딩 전 처리
    if (!notice) return <div style={{ marginTop: '200px', textAlign: 'center' }}>데이터를 불러오는 중입니다...</div>;

    return (
        <div style={{
            marginTop: '150px',
            marginBottom: '100px',
            width: '90%',
            display: 'flex',
            gap: '60px'
        }}>

            {/* 왼쪽 사이드 메뉴 */}
            <div className="side-menu" style={{ width: '220px' }}>
                {/* 타이틀 */}
                <div style={{
                    borderBottom: '2px solid #000',
                    paddingBottom: '12px',
                    marginBottom: '25px'
                }}>
                    <h2 style={{ margin: 0, fontSize: '22px' }}>
                        서비스 지원
                    </h2>
                </div>

                {/* 메뉴 */}
                <div className="qna-menu">
                    <Link to="/qna">자주하는 질문</Link>
                </div>

                <div className="qna-menu">
                    <Link to="/qna/write">1:1 문의하기</Link>
                </div>

                <div className="qna-menu active">
                    <Link to="/qna/noticelist">공지사항</Link>
                </div>
            </div>

            {/* 오른쪽 컨텐츠 */}
            <div style={{ flexGrow: 1 }}>

                {/* 페이지 제목 */}
                <h2 style={{ borderBottom: '2px solid #000', paddingBottom: '15px', marginBottom: '10px' }}>
                    공지사항
                </h2>

                {/* 제목 영역 */}
                <div style={{ margin: '0', borderBottom: '1px solid #ddd', padding: '20px 10px' }}>
                    <h3 style={{ margin: '0 0 15px 0', fontSize: '22px' }}>
                        {notice.subject}
                    </h3>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        color: '#777',
                        fontSize: '14px'
                    }}>
                        <span>CANVAS</span>
                        <div>
                            <span style={{ marginRight: '15px' }}>
                                {new Date(notice.writedate).toLocaleDateString()}
                            </span>
                            <span>조회수 {notice.hit}</span>
                        </div>
                    </div>

                </div>

                {/* 내용 영역 */}
                <div style={{
                    minHeight: '350px',
                    padding: '40px 10px',
                    lineHeight: '1.9',
                    borderBottom: '1px solid #ddd'
                }}  dangerouslySetInnerHTML={{ __html: notice.context}}>       
                </div>

                {/* 목록 버튼 */}
                <div style={{
                    marginTop: '30px',
                    textAlign: 'center'
                }}>
                    <Link to="/qna/noticelist">
                        <button
                            style={{
                                padding: '10px 25px',
                                border: 'none',
                                background: '#000',
                                color: '#fff',
                                cursor: 'pointer',
                                borderRadius: '5px'
                            }}>
                            목록
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default NoticeView;