import React, { useState } from "react";
import { Link } from "react-router-dom";
import './../css/seul.css';


function CategoryProduct() {

        const [openMenu, setOpenMenu] = useState(null);
        const [showMore, setShowMore] = useState(false);

        const toggleMenu = (menuName) => {
                setOpenMenu(openMenu === menuName ? null : menuName);
        };

        const [activeSub, setActiveSub] = useState(null);
        
        // 제품 데이터 배열
        const products = [
                { id: 1, img: "public/p1.png", title: "BILLY 빌리", price: "89,900" },
                { id: 2, img: "public/p2.png", title: "BILLY 빌리", price: "89,900" },
                { id: 3, img: "public/p3.png", title: "BILLY 빌리", price: "89,900" },
                { id: 4, img: "public/p4.png", title: "BILLY 빌리", price: "89,900" },
                { id: 5, img: "public/p1.png", title: "BILLY 빌리", price: "89,900" },
                { id: 6, img: "public/p2.png", title: "BILLY 빌리", price: "89,900" },
                { id: 7, img: "public/p3.png", title: "BILLY 빌리", price: "89,900" },
        ];

        // 처음 4개 + showMore true면 전체
        const visibleProducts = showMore ? products : products.slice(0, 4);

        return (
                <div className="all-product-wrap">

                        {/* 왼쪽 사이드 메뉴 ------------------------------------------------- */}

                        <div className="side-menu">
                                <h2>제품</h2>

                                {/* 수납가구 */}
                                <div className="p-menu" onClick={() => toggleMenu("storage")}>수납가구</div>
                                {openMenu === "storage" && (
                                        <div className="submenu">
                                                <Link to="" onClick={() => setActiveSub("책장")} className={activeSub === "책장" ? "active" : ""}>책장</Link>
                                                <Link to="" onClick={() => setActiveSub("수납장")} className={activeSub === "수납장" ? "active" : ""}>수납장</Link>
                                                <Link to="" onClick={() => setActiveSub("옷장")} className={activeSub === "옷장" ? "active" : ""}>옷장</Link>
                                        </div>
                                )}

                                {/* 침대 / 매트리스 */}
                                <div className="p-menu" onClick={() => toggleMenu("bed")}>침대 / 매트리스</div>
                                {openMenu === "bed" && (
                                        <div className="submenu">
                                                <Link to="" onClick={() => setActiveSub("싱글 침대")} className={activeSub === "싱글 침대" ? "active" : ""}>싱글 침대</Link>
                                                <Link to="" onClick={() => setActiveSub("퀸 침대")} className={activeSub === "퀸 침대" ? "active" : ""}>퀸 침대</Link>
                                                <Link to="" onClick={() => setActiveSub("매트리스")} className={activeSub === "매트리스" ? "active" : ""}>매트리스</Link>
                                        </div>
                                )}

                                {/* 소파 */}
                                <div className="p-menu" onClick={() => toggleMenu("sofa")}>소파 / 암체어</div>
                                {openMenu === "sofa" && (
                                        <div className="submenu">
                                                <Link to="" onClick={() => setActiveSub("2인용 소파")} className={activeSub === "2인용 소파" ? "active" : ""}>2인용 소파</Link>
                                                <Link to="" onClick={() => setActiveSub("3인용 소파")} className={activeSub === "3인용 소파" ? "active" : ""}>3인용 소파</Link>
                                                <Link to="" onClick={() => setActiveSub("암체어")} className={activeSub === "암체어" ? "active" : ""}>암체어</Link>
                                        </div>
                                )}

                                {/* 식탁 / 테이블 / 의자 */}
                                <div className="p-menu" onClick={() => toggleMenu("table")}>식탁 / 테이블 / 의자</div>
                                {openMenu === "table" && (
                                        <div className="submenu">
                                                <Link to="" onClick={() => setActiveSub("식탁")} className={activeSub === "식탁" ? "active" : ""}>식탁</Link>
                                                <Link to="" onClick={() => setActiveSub("거실용 테이블")} className={activeSub === "거실용 테이블" ? "active" : ""}>거실용 테이블</Link>
                                                <Link to="" onClick={() => setActiveSub("의자")} className={activeSub === "의자" ? "active" : ""}>의자</Link>
                                        </div>
                                )}

                                {/* 책상 / 사무용 의자 */}
                                <div className="p-menu" onClick={() => toggleMenu("chair")}>책상 / 사무용 의자</div>
                                {openMenu === "chair" && (
                                        <div className="submenu">
                                                <Link to="" onClick={() => setActiveSub("컴퓨터 책상")} className={activeSub === "컴퓨터 책상" ? "active" : ""}>책상/컴퓨터 책상</Link>
                                                <Link to="" onClick={() => setActiveSub("사무실 의자")} className={activeSub === "사무실 의자" ? "active" : ""}>의자/사무실의자</Link>
                                                <Link to="" onClick={() => setActiveSub("책상/의자 세트")} className={activeSub === "책상/의자 세트" ? "active" : ""}>책상/의자 세트</Link>
                                        </div>
                                )}

                                {/* 조명 */}
                                <div className="p-menu" onClick={() => toggleMenu("light")}>조명</div>
                                {openMenu === "light" && (
                                        <div className="submenu">
                                                <Link to="" onClick={() => setActiveSub("일반 조명")} className={activeSub === "일반 조명" ? "active" : ""}>일반 조명</Link>
                                                <Link to="" onClick={() => setActiveSub("시스템 조명")} className={activeSub === "시스템 조명" ? "active" : ""}>시스템 조명</Link>
                                                <Link to="" onClick={() => setActiveSub("장식 조명")} className={activeSub === "장식 조명" ? "active" : ""}>장식조명</Link>
                                        </div>
                                )}

                                {/* 욕실 */}
                                <div className="p-menu" onClick={() => toggleMenu("bathroom")}>욕실</div>
                                {openMenu === "bathroom" && (
                                        <div className="submenu">
                                                <Link to="" onClick={() => setActiveSub("욕실 벽수납장")} className={activeSub === "욕실 벽수납장" ? "active" : ""}>욕실 벽수납장</Link>
                                                <Link to="" onClick={() => setActiveSub("욕실 세면대 하부장")} className={activeSub === "욕실 세면대 하부장" ? "active" : ""}>욕실 세면대하부장</Link>
                                                <Link to="" onClick={() => setActiveSub("욕실 거울")} className={activeSub === "욕실 거울" ? "active" : ""}>욕실 거울</Link>
                                        </div>
                                )}
                        </div>


                        {/* 오른쪽 컨텐츠 ---------------------------------------------------- */}
                        <div className="product-content">
                                <div style={{ borderBottom: '2px solid black', marginBottom: '30px', padding: '10px' }}>
                                        <h2>책장</h2>
                                </div>
                                {/* 정렬 버튼 */}
                                <div className="sort-btns">
                                        <button>신제품</button>
                                        <button>베스트 매치</button>
                                        <button>낮은 가격순</button>
                                        <button>높은 가격순</button>
                                        <button>평점순</button>
                                </div>

                                {/* 제품 리스트 (한 줄 4개 고정 + 더보기 기능) */}
                                <div className="product-grid">
                                        {visibleProducts.map((item) => (
                                                <Link to="/productDetail" className="product-link" key={item.id}>
                                                        <div className="product-card">
                                                                <div className="product-img"><img src={item.img} alt="" /></div>
                                                                <div className="product-info">
                                                                        <div style={{ fontWeight: 'bold' }}>canvas</div>
                                                                        <div className="title">{item.title}</div>
                                                                        <div className="price">
                                                                                <span className="symbol">₩</span>
                                                                                <span className="amount">{item.price}</span>
                                                                        </div>
                                                                        <div className="rating">
                                                                                <img src="public/bal.png" />
                                                                                <img src="public/bal.png" />
                                                                                <img src="public/bal.png" />
                                                                                <img src="public/bal.png" />
                                                                                <img src="public/bal.png" />
                                                                                <span>(168)</span>
                                                                        </div>
                                                                </div>
                                                        </div>
                                                </Link>
                                        ))}
                                </div>

                                {/* 더보기 버튼 */}
                                <div className="more-box">
                                        <button className="more-btn" onClick={() => setShowMore(!showMore)}>
                                                {showMore ? "접기" : "더보기"}
                                        </button>
                                </div>

                        </div>
                </div>
        );


}
export default CategoryProduct;