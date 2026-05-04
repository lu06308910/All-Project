import React,{ useState } from "react";
import { Link } from "react-router-dom";
import './../css/seul.css';

function QnaWrite() {

    const [agree, setAgree] = useState(false);

    return (
                <div style={{
                marginTop: '150px',
                marginBottom: '100px',
                width: '90%',
                display: 'flex',
                gap: '60px'
                }}>

                        {/* ▷ 왼쪽 사이드 메뉴 */}
                        <div className="side-menu">

                                {/* 사이드 메뉴 타이틀 */}
                                <div style={{
                                width: '220px',
                                borderBottom: '2px solid #000',
                                paddingBottom: '12px',
                                marginBottom: '25px'
                                }}>
                                <h2 style={{ margin: 0, fontSize: '22px' }}>서비스 지원</h2>
                                </div>

                                {/* 메뉴 목록 */}
                                <div className="qna-menu"><Link to="/qna">자주하는 질문</Link></div>
                                <div className="qna-menu active"><Link to="/qna/write">1:1 문의하기</Link></div>
                                <div className="qna-menu"><Link to="/qna/noticelist">공지사항</Link></div>
                        </div>

                        {/* ▷ 오른쪽 컨텐츠 */}
                        <div style={{ width: '100%' }}>

                                {/* 상단 제목 */}
                                <div style={{
                                borderBottom: '2px solid #000',
                                paddingBottom: '12px',
                                marginBottom: '25px'
                                }}>
                                <h2 style={{ margin: 0, fontSize: '24px' }}>1:1 문의하기</h2>
                                </div>

                                {/* 안내 문구 */}
                                <div style={{
                                fontSize: '14px',
                                lineHeight: '1.7',
                                marginBottom: '30px'
                                }}>
                                CANVAS 서비스에 대해 궁금하신 점을 문의해 주시면 친절하게 답변해드리겠습니다.<br />
                                <span style={{ color: 'red' }}>상품에 대한 문의</span>는 해당 상품 상세페이지에서 문의해주시면 더욱 신속하게 답변을 받으실 수 있습니다.
                                </div>

                                {/* 개인정보 동의 제목 */}
                                <div style={{ marginBottom: '15px' }}>
                                <p style={{ fontSize: '20px', fontWeight: 'bold' }}>
                                        1:1문의하기 개인정보 수집 • 이용 동의
                                </p>
                                </div>

                                {/* 개인정보 수집 동의 박스 */}
                                <div style={{border: '1px solid #ddd', padding: '20px',borderRadius: '4px',lineHeight: '1.6',fontSize: '14px'}}>
                                <p style={{ marginBottom: '8px' }}>1. 개인 정보 수집 · 이용 목적</p>
                                <p style={{ marginBottom: '8px' }}>불만 처리 의사소통 경로 확보, 기타 원활한 양질의 서비스 제공, 문의 접소, 상담 및 처리결과회신</p>
                                <p style={{ marginBottom: '8px' }}>2. 개인정보의 항목</p>
                                <p style={{ marginLeft: '12px' }}>
                                        - 필수항목: 이름, 연락처, 이메일<br />
                                        - 선택항목: 구매한 상품 정보, 기타 문의 관련 정보
                                </p>

                                <p style={{ marginTop: '20px', marginBottom: '8px'}}>3. 개인정보 보유 및 이용 기간</p>
                                <p style={{ marginLeft: '12px' }}>
                                        - 상담 완료 후 3년간 보관<br />
                                        - 관련 법령에 따라 보관 기간이 달라질 수 있음
                                </p>

                                <p style={{ marginTop: '20px', fontWeight: 'bold', color: '#444' }}>
                                        ※ 동의를 거부하실 수 있으나, 동의하지 않을 경우 문의 응대가 어려울 수 있습니다.
                                </p>
                                </div>

                                {/* 체크박스 추가 */}
                                <div style={{
                                marginTop: '15px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                                }}>
                                <input
                                        type="checkbox"
                                        id="agree"
                                        checked={agree}
                                        onChange={(e) => setAgree(e.target.checked)}
                                        style={{ width: '18px', height: '18px'}}
                                />
                                <label htmlFor="agree" style={{ fontSize: '15px', cursor: 'pointer' }}>
                                        (필수) 개인정보 수집 및 이용에 동의합니다.
                                </label>
                                </div>

                                  {/* ▽ 문의 작성 폼 */}
                <form style={{ marginTop: '40px' }}>

                    {/* 문의유형 */}
                    <div style={{ marginBottom: '25px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>문의구분</label>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <select style={{ padding: '10px', width: '200px', border: '1px solid #ccc' }}>
                                <option>회원/ 정보문의</option>
                                <option>배송문의</option>
                                <option>환불문의</option>
                                <option>교환문의</option>
                            </select>
                            <select style={{ padding: '10px', width: '200px', border: '1px solid #ccc' }}>
                                <option>구분</option>
                            </select>
                            <select style={{ padding: '10px', width: '200px', border: '1px solid #ccc' }}>
                                <option>상세구분</option>
                            </select>
                        </div>
                    </div>

                    {/* 상품명 + 조회 */}
                    <div style={{ marginBottom: '25px' }}>
                        <label style={{ display: 'block', marginBottom: '8px' }}>상품명</label>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input type="text" style={{ flex: 1, padding: '12px', border: '1px solid #ccc' }} />
                            <button type="button" style={{width: '180px', padding: '14px 0',backgroundColor: '#000',color:'#fff',fontSize: '16px',cursor: 'pointer'
                            }}>
                                주문번호 조회
                            </button>
                        </div>
                    </div>

                    {/* 이름 */}
                    <div style={{ marginBottom: '25px' }}>
                        <label style={{ display: 'block', marginBottom: '8px' }}>* 이름</label>
                        <input type="text" style={{ width: '60%', padding: '12px', border: '1px solid #ccc' }} />
                    </div>

                    {/* 알림선택 */}
                    <div style={{ marginBottom: '25px' }}>
                        <label style={{ display: 'block', marginBottom: '8px' }}>* 알림선택</label>
                        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                            <label><input type="checkbox" /> SMS수신</label>
                            <label><input type="checkbox" /> 이메일수신</label>
                        </div>
                    </div>

                    {/* 제목 */}
                    <div style={{ marginBottom: '25px' }}>
                        <label style={{ display: 'block', marginBottom: '8px' }}>* 제목</label>
                        <input type="text" style={{ width: '100%', padding: '12px', border: '1px solid #ccc' }} />
                    </div>

                    {/* 내용 */}
                    <div style={{ marginBottom: '25px' }}>
                        <label style={{ display: 'block', marginBottom: '8px' }}>* 내용</label>
                        <textarea
                            style={{ width: '100%', padding: '12px', border: '1px solid #ccc', height: '150px' }}
                        ></textarea>
                    </div>

                    {/* 첨부파일 */}
                    <div style={{ marginBottom: '25px' }}>
                        <label style={{ display: 'block', marginBottom: '8px' }}>첨부파일</label>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <input type="text" style={{ flex: 1, padding: '12px', border: '1px solid #ccc' }} readOnly />
                            <button type="button" style={{
                               width: '180px', padding: '14px 10px',backgroundColor: '#000',color:'#fff',fontSize: '16px',cursor: 'pointer'
                            }}>파일찾기</button>
                        </div>
                        <div style={{ fontSize: '12px', color: '#888', marginTop: '5px' }}>
                            jpg, gif, png파일, 10MB 이하, 4개까지 첨부가 가능합니다.
                        </div>
                    </div>

                    {/* 제출 버튼 */}
                    <div style={{ marginTop: '40px', textAlign: 'center' }}>
                        <button type="submit" style={{
                            width: '180px',
                            padding: '14px 0',
                            backgroundColor: '#000',
                            color: '#fff',
                            borderRadius: '25px',
                            fontSize: '16px',
                            cursor: 'pointer'
                        }}>
                            문의하기
                        </button>
                    </div>
                </form>


                        </div>
                </div>
    )
}

export default QnaWrite;