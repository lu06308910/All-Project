import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom"
import './../css/seul.css';

function PopularQna() {
        const [logid, setLogid] = useState("");

        const [formData, setFormData] = useState({
                category: "회원/정보",
                subject: "",
                context: ""
        });

        useEffect(() => {
                const savedId = sessionStorage.getItem("logId");

                if (savedId !== "admin") {
                        alert("관리자만 접근 가능한 페이지입니다.");
                        window.location.href = "/qna";
                        return;
                }
                setLogid(savedId);
        }, []);

        // 입력 핸들러
        const handleChange = (e) => {
                const { name, value } = e.target;
                setFormData({
                        ...formData,
                        [name]: value
                });
        };

        // FAQ 등록
        const handleSubmit = async (e) => {
                e.preventDefault();

                if (!formData.subject || !formData.context) {
                        alert("질문과 답변 내용을 모두 입력해주세요.");
                        return;
                }

                const savedMId = sessionStorage.getItem("mId");

                const sendData = {
                        category: formData.category,
                        subject: formData.subject,
                        context: formData.context,
                        m_id: savedMId ? parseInt(savedMId) : 1 
                };

                try {
                        const response = await axios.post("http://localhost:9989/service/write", sendData);

                        if (response.status === 200 || response.status === 201) {
                                alert("FAQ가 성공적으로 등록되었습니다!");
                                window.location.href = "/qna";
                        }
                } catch (error) {
                        console.error("FAQ 등록 오류:", error);
                        alert("등록 중 오류가 발생했습니다. 백엔드 콘솔의 에러 메시지를 확인해주세요.");
                }
        };

        return (
                <div style={{ marginTop: '150px', marginBottom: '100px', width: '90%', display: 'flex', gap: '60px' }}>

                        {/* 왼쪽 사이드 메뉴 */}
                        <div className="side-menu">
                                <div style={{ width: '220px', borderBottom: '2px solid #000', paddingBottom: '12px', marginBottom: '25px' }}>
                                        <h2 style={{ margin: 0, fontSize: '22px' }}>서비스 지원</h2>
                                </div>
                                <div className="qna-menu active"><Link to="/qna">자주하는 질문</Link></div>
                                <div className="qna-menu"><Link to="/qna/write">1:1 문의하기</Link></div>
                                <div className="qna-menu"><Link to="/qna/noticelist">공지사항</Link></div>
                        </div>

                        {/* 오른쪽 컨텐츠 */}
                        <div style={{ width: '100%' }}>
                                <div style={{ borderBottom: '2px solid #000', paddingBottom: '12px', marginBottom: '25px' }}>
                                        <h2 style={{ margin: 0, fontSize: '24px' }}>FAQ(자주하는 질문) 등록</h2>
                                </div>

                                {/* FAQ 작성 폼 */}
                                <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>

                                        {/* 카테고리 선택 */}
                                        <div style={{ marginBottom: '25px' }}>
                                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>문의구분</label>
                                                <select
                                                        name="category"
                                                        value={formData.category}
                                                        onChange={handleChange}
                                                        style={{ padding: '12px', width: '250px', border: '1px solid #ccc' }}
                                                >
                                                        <option value="회원/정보">회원/정보문의</option>
                                                        <option value="주문/결제">주문/결제문의</option>
                                                        <option value="배송문의">배송문의</option>
                                                        <option value="반품/교환/환불">반품/교환/환불문의</option>
                                                        <option value="서비스/기타">서비스/기타문의</option>
                                                </select>
                                        </div>

                                        {/* 질문 */}
                                        <div style={{ marginBottom: '25px' }}>
                                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>* 질문 (Subject)</label>
                                                <input
                                                        type="text"
                                                        name="subject"
                                                        placeholder="자주 묻는 질문 제목을 입력하세요"
                                                        value={formData.subject}
                                                        onChange={handleChange}
                                                        style={{ width: '100%', padding: '12px', border: '1px solid #ccc' }}
                                                />
                                        </div>

                                        {/* 답변 */}
                                        <div style={{ marginBottom: '25px' }}>
                                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>* 답변 (Context)</label>
                                                <textarea
                                                        name="context"
                                                        placeholder="답변 내용을 상세히 입력하세요"
                                                        value={formData.context}
                                                        onChange={handleChange}
                                                        style={{ width: '100%', padding: '12px', border: '1px solid #ccc', height: '250px', resize: 'vertical' }}
                                                ></textarea>
                                        </div>

                                        {/* 버튼 */}
                                        <div style={{ marginTop: '40px', display: 'flex', gap: '15px', justifyContent: 'center' }}>
                                                <button
                                                        type="button"
                                                        onClick={() => window.location.href = "/qna"}
                                                        style={{ width: '150px', padding: '14px 0', backgroundColor: '#fff', color: '#000', border: '1px solid #000', borderRadius: '25px', cursor: 'pointer' }}>
                                                        취소
                                                </button>
                                                <button
                                                        type="submit"
                                                        style={{ width: '180px', padding: '14px 0', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '25px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
                                                        FAQ 등록하기
                                                </button>
                                        </div>
                                </form>
                        </div>
                </div>
        );
}

export default PopularQna;