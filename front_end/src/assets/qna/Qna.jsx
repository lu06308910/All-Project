import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import './../css/seul.css';

function Qna() {

        const [faqList, setFaqList] = useState([]);
        const [openIndex, setOpenIndex] = useState(null);
        const [searchTerm, setSearchTerm] = useState("");

        const logid = sessionStorage.getItem("logId");

        useEffect(() => {
                fetchFaqs();
        }, []);

        const fetchFaqs = async () => {
                try {
                        const response = await axios.get("http://localhost:9989/service");
                        setFaqList(response.data);
                } catch (error) {
                        console.error("FAQ 데이터를 가져오는 중 오류 발생:", error);
                        alert("데이터를 불러오는 데 실패했습니다.");
                }
        };

        // 검색 기능 연동
        const handleSearch = async () => {
                if (!searchTerm.trim()) {
                        fetchFaqs(); // 검색어 없으면 전체 리스트 호출
                        return;
                }
                try {
                        const response = await axios.get(`http://localhost:9989/service/search?keyword=${searchTerm}`);
                        setFaqList(response.data);
                } catch (error) {
                        console.error("검색 중 오류 발생:", error);
                }
        };

        // 엔터키 검색 지원
        const handleKeyDown = (e) => {
                if (e.key === 'Enter') {
                        handleSearch();
                }
        };

        const handleToggle = (index) => {
                setOpenIndex(openIndex === index ? null : index);
        };

        return (
                <div style={{ marginTop: '150px', marginBottom: '100px', width: '90%', display: 'flex', gap: '60px' }}>

                        {/*  왼쪽 사이드 메뉴 */}
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

                        {/* 오른쪽 컨텐츠 */}
                        <div style={{ width: '100%' }}>

                                {/* 상단 제목 */}
                                <div style={{
                                        borderBottom: '2px solid #000',
                                        paddingBottom: '10px',
                                        marginBottom: '20px'
                                }}>
                                        <h2 style={{ margin: 0, fontSize: '24px' }}>자주 묻는 질문</h2>
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
                                        <input
                                                type="text"
                                                placeholder="검색어를 입력해주세요"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                onKeyDown={handleKeyDown}
                                                style={{ border: 'none', width: '90%', outline: 'none', fontSize: '16px' }}
                                        />
                                        <button className="search-icon" onClick={handleSearch} style={{ cursor: 'pointer', border: 'none', background: 'none' }}></button>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                                        <div>
                                                {logid === "admin" && (
                                                        <Link to="/qna/popularqna" style={{ textDecoration: 'none' }}>
                                                                <button style={{
                                                                        padding: '10px',
                                                                        backgroundColor: '#007bff',
                                                                        color: '#fff',
                                                                        border: 'none',
                                                                        cursor: 'pointer',
                                                                        fontWeight: 'bold',
                                                                        borderRadius: '10px'
                                                                }}>
                                                                        FAQ 등록하기 (관리자)
                                                                </button>
                                                        </Link>
                                                )}
                                        </div>

                                        {/* 오른쪽: 모든 사용자에게 보이는 1:1 문의 버튼 */}
                                        <button onClick={() => (window.location.href = '/qna/write')}
                                                style={{
                                                        padding: '10px',
                                                        backgroundColor: '#000',
                                                        color: '#fff',
                                                        border: 'none',
                                                        cursor: 'pointer',
                                                        fontWeight: 'bold',
                                                        borderRadius: '10px'
                                                }}>
                                                1:1 문의하기
                                        </button>
                                </div>

                                {/* Q&A 리스트 표 */}
                                <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
                                        <thead>
                                                <tr style={{ borderBottom: '1px solid #ddd' }}>
                                                        <th style={{ width: '30%', padding: '12px', textAlign: 'left' }}>구분</th>
                                                        <th style={{ width: '70%', padding: '12px', textAlign: 'left' }}>제목</th>
                                                </tr>
                                        </thead>

                                        <tbody>
                                                {faqList.length > 0 ? (
                                                        faqList.map((item, index) => (
                                                                <React.Fragment key={index}>
                                                                        {/* 질문 */}
                                                                        <tr style={{ borderBottom: '1px solid #eee', cursor: 'pointer' }} onClick={() => handleToggle(index, item.s_id)}>
                                                                                <td style={{ width: '30%', padding: '12px', textAlign: 'left' }}>{item.category}</td>
                                                                                <td style={{ width: '70%', padding: '12px' }}>{item.subject}</td>
                                                                        </tr>

                                                                        {/* 답변 */}
                                                                        {openIndex === index && (
                                                                                <tr>
                                                                                        <td colSpan="3" style={{ background: '#f8f8f8', padding: '15px', fontSize: '14px', lineHeight: '1.6' }}>
                                                                                                <div style={{ whiteSpace: 'pre-wrap' }}>
                                                                                                        {item.context || "내용이 없습니다."}
                                                                                                </div>
                                                                                        </td>
                                                                                </tr>
                                                                        )}
                                                                </React.Fragment>
                                                        ))
                                                ) : (
                                                        <tr>
                                                                <td colSpan="3" style={{ textAlign: 'center', padding: '30px', color: '#888' }}>
                                                                        등록된 자주 묻는 질문이 없습니다.
                                                                </td>
                                                        </tr>
                                                )}
                                        </tbody>
                                </table>
                        </div>
                </div>
        );
}

export default Qna;