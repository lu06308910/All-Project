import React from "react";
import { Link } from "react-router-dom";
import './../css/seul.css';

function NoticeView() {

    return (
        <div
            style={{
                marginTop: '150px',
                marginBottom: '100px',
                width: '90%',
                display: 'flex',
                gap: '60px'
            }}
        >

            {/* 왼쪽 사이드 메뉴 */}
            <div
                className="side-menu"
                style={{ width: '220px' }}
            >

                {/* 타이틀 */}
                <div
                    style={{
                        borderBottom: '2px solid #000',
                        paddingBottom: '12px',
                        marginBottom: '25px'
                    }}
                >
                    <h2
                        style={{
                            margin: 0,
                            fontSize: '22px'
                        }}
                    >
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
                <h2
                    style={{
                        borderBottom: '2px solid #000',
                        paddingBottom: '15px',
                        marginBottom: '10px'
                    }}
                >
                    공지사항
                </h2>

                {/* 제목 영역 */}
                <div
                    style={{
                        margin:'0',
                        borderBottom: '1px solid #ddd',
                        padding: '20px 10px'
                    }}
                >

                    <h3
                        style={{
                            margin: '0 0 15px 0',
                            fontSize: '22px'
                        }}
                    >
                        [정기점검 발표] 20년 03월 교육기관 일정 안내
                    </h3>

                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            color: '#777',
                            fontSize: '14px'
                        }}
                    >
                        <span>CANVAS</span>
                        <span>2020.04.13</span>
                    </div>

                </div>

                {/* 내용 영역 */}
                <div
                    style={{
                        minHeight: '350px',
                        padding: '40px 10px',
                        lineHeight: '1.9',
                        borderBottom: '1px solid #ddd'
                    }}
                >

                    안녕하세요 CANVAS 입니다.
                    <br /><br />

                    20년 03월 교육기관 일정 관련 공지사항 안내드립니다.
                    <br /><br />

                    보다 안정적인 서비스 제공을 위해
                    정기 점검이 진행될 예정입니다.
                    <br /><br />

                    이용에 참고 부탁드립니다.
                    <br /><br />

                    감사합니다.

                </div>

                {/* 목록 버튼 */}
                <div
                    style={{
                        marginTop: '30px',
                        textAlign: 'center'
                    }}
                >

                    <Link to="/qna/noticelist">
                        <button
                            style={{
                                padding: '10px 25px',
                                border: 'none',
                                background: '#000',
                                color: '#fff',
                                cursor: 'pointer',
                                borderRadius: '5px'
                            }}
                        >
                            목록
                        </button>
                    </Link>

                </div>

            </div>

        </div>
    );
}

export default NoticeView;