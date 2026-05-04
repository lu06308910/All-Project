import React, { useState } from "react";
import { Link } from "react-router-dom";
import './../css/seul.css';

function ProductDetail() {
        const [count, setCount] = useState(1);
        const [showDetail, setShowDetail] = useState(false);

        //  탭 메뉴 선택
        const [activeTab, setActiveTab] = useState("detail");
        // detail | related | review | qna

        // 선택한 옵션값
        const [color, setColor] = useState("");
        const [extraOption, setExtraOption] = useState("");
        const [selectedOptions, setSelectedOptions] = useState([]);

        const addOption = () => {
                if (!color || !extraOption) return alert("옵션을 모두 선택하세요!");

                const newOption = {
                        color,
                        extraOption,
                        count
                };

                setSelectedOptions([...selectedOptions, newOption]);

                // 초기화
                setColor("");
                setExtraOption("");
                setCount(1);
        };


        return (
                <div className="product-detail-container">

                        {/* 상단 카테고리 경로 */}
                        <div className="breadcrumb">
                                제품 &gt; 수납가구 &gt; 책장 
                        </div>

                        <div className="product-wrapper">

                                {/* 왼쪽 이미지 영역 */}
                                <div className="image-section">
                                        <div className="thumb-list">
                                                <img src="public/p1.png" alt="" className="thumb-img" />
                                                <img src="public/p1.png" alt="" className="thumb-img" />
                                                <img src="public/p1.png" alt="" className="thumb-img" />
                                        </div>
                                        <div className="main-img-box">
                                                <img src="public/p1.png" alt="" className="main-img" />
                                        </div>
                                </div>

                                {/* 오른쪽 상품 정보 */}
                                <div className="info-section">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <h3>BILLY 빌리, 120cm</h3>
                                                <span>
                                                        <Link to="">
                                                                <img style={{ width: '30px', height: '30px', cursor: 'pointer' }} src="public/like.png" />
                                                        </Link>
                                                </span>
                                        </div>

                                        <p className="price">89,900원</p>

                                        <div className="rating">
                                                <img src="public/bal.png" />
                                                <img src="public/bal.png" />
                                                <img src="public/bal.png" />
                                                <img src="public/bal.png" />
                                                <img src="public/bal.png" />
                                                <span>(168)</span>
                                        </div>

                                        {/* 옵션 선택 */}
                                        <div className="option-box">
                                                <select value={color} onChange={(e) => setColor(e.target.value)}>
                                                        <option value="">색상 선택</option>
                                                        <option value="내츄럴">내츄럴</option>
                                                        <option value="브라운">브라운</option>
                                                </select>

                                                <select value={extraOption} onChange={(e) => setExtraOption(e.target.value)}>
                                                        <option value="">옵션 선택</option>
                                                        <option value="기본 옵션">기본 옵션</option>
                                                </select>
                                        </div>
                                        <div className="count-add-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '10px 0' }}>
                                                {/* 수량 선택 */}
                                                <div className="count-box">
                                                        <button className="count-btn" onClick={() => setCount(count > 1 ? count - 1 : 1)}>−</button>
                                                        <span className="count-number">{count}</span>
                                                        <button className="count-btn" onClick={() => setCount(count + 1)}>+</button>


                                                </div>
                                                <button className="add-option-btn" onClick={addOption} >
                                                        옵션 추가
                                                </button>
                                        </div>
                                        {/* 선택한 옵션 보이기 */}
                                        {selectedOptions.length > 0 && (
                                                <div style={{ marginTop: '15px' }}>
                                                        <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>✔ 선택한 옵션</p>

                                                        {selectedOptions.map((opt, index) => (
                                                                <div key={index}
                                                                        style={{
                                                                                padding: '10px',
                                                                                border: '1px solid #ddd',
                                                                                borderRadius: '8px',
                                                                                marginBottom: '8px',
                                                                                display: 'flex',
                                                                                justifyContent: 'space-between',
                                                                                alignItems: 'center'
                                                                        }}
                                                                >
                                                                        <span>{opt.color} / {opt.extraOption} / {opt.count}개</span>

                                                                        <button
                                                                                style={{
                                                                                        background: '#ccc',
                                                                                        border: 'none',
                                                                                        padding: '5px 10px',
                                                                                        cursor: 'pointer',
                                                                                        borderRadius: '4px'
                                                                                }}
                                                                                onClick={() =>
                                                                                        setSelectedOptions(selectedOptions.filter((_, i) => i !== index))
                                                                                }
                                                                        >
                                                                                삭제
                                                                        </button>
                                                                </div>
                                                        ))}

                                                </div>
                                        )}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '10px 0' }}>
                                                <button className="buy-btn">장바구니 담기</button>
                                                <button className="buy-btn">구매하기</button>
                                        </div>
                                </div>
                        </div>

                        {/* ⭐ 탭 메뉴 */}
                        <div className="tab-menu">
                                <div
                                        onClick={() => setActiveTab("detail")}
                                        className={activeTab === "detail" ? "active" : ""}
                                >
                                        상세페이지
                                </div>

                                <div
                                        onClick={() => setActiveTab("related")}
                                        className={activeTab === "related" ? "active" : ""}
                                >
                                        관련상품
                                </div>

                                <div
                                        onClick={() => setActiveTab("review")}
                                        className={activeTab === "review" ? "active" : ""}
                                >
                                        리뷰(1,500)
                                </div>

                                <div
                                        onClick={() => setActiveTab("qna")}
                                        className={activeTab === "qna" ? "active" : ""}
                                >
                                        문의
                                </div>
                        </div>

                        {/* ⭐ 탭 콘텐츠 영역 */}
                        <div>
                                {activeTab === "detail" && (
                                        <div className="detail-toggle-wrapper" style={{ textAlign: 'center', margin: '40px 0' }}>

                                                <div className={`detail-content ${showDetail ? "open" : ""}`}>
                                                        <img src="public/p-detail2.png" alt="detail" />
                                                        <img src="public/p-detail3.png" alt="detail" />
                                                </div>

                                                {!showDetail && (
                                                        <div className="detail-fade"></div>
                                                )}

                                                <button
                                                        className="detail-toggle-btn"
                                                        onClick={() => setShowDetail(!showDetail)}
                                                >
                                                        {showDetail ? "상세정보 접기 ▲" : "상세정보 펼치기 ▼"}
                                                </button>
                                        </div>
                                )}

                                {activeTab === "related" && (
                                        <div style={{ padding: "40px 0", textAlign: "center" }}>
                                                관련 상품 리스트 영역
                                        </div>
                                )}

                                {activeTab === "review" && (
                                        
                                        <div style={{ padding: "40px 0" }}>
                                                {/* 정렬 버튼 */}
                                                <div className="sort-btns">
                                                        <button>전체(1,500건)</button>
                                                        <button>사진(620건)</button>
                                                </div>
                                                <div className="review-imageBox" style={{border:'2px solid #ccc',borderRadius:'10px', height:'250px', textAlign:'center',lineHeight:'250px'}}>
                                                        <img src="public/review1.jpg" />
                                                        <img src="public/review2.jpg" />
                                                        <img src="public/review3.jpg" />
                                                        <img src="public/review4.jpg" />
                                                        <img src="public/review5.jpg" />
                                                
                                                </div>




                                        </div>
                                )}

                                {activeTab === "qna" && (
                                        <div style={{ padding: "40px 0", textAlign: "center" }}>
                                                Q&A 목록 영역
                                        </div>
                                )}
                        </div>

                </div>
        );
}

export default ProductDetail;