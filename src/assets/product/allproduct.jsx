import React, { useState } from "react";
import { Link } from "react-router-dom";
import './../css/seul.css';

function AllProduct() {
    const [openMenu, setOpenMenu] = useState(null);
    const [showMore, setShowMore] = useState(false);

    const toggleMenu = (menuName) => {
        setOpenMenu(openMenu === menuName ? null : menuName);
    };

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

                <div className="p-menu" onClick={() => toggleMenu("storage")}>수납가구</div>
                {openMenu === "storage" && (
                    <div className="submenu">
                        <Link to="">책장</Link>
                        <Link to="">수납장</Link>
                        <Link to="">옷장</Link>
                    </div>
                )}

                <div className="p-menu" onClick={() => toggleMenu("bed")}>침대 / 매트리스</div>
                {openMenu === "bed" && (
                    <div className="submenu">
                        <Link to="">싱글 침대</Link>
                        <Link to="">퀸 침대</Link>
                        <Link to="">매트리스</Link>
                    </div>
                )}

                <div className="p-menu" onClick={() => toggleMenu("sofa")}>소파 / 암체어</div>
                {openMenu === "sofa" && (
                    <div className="submenu">
                        <Link to="">2인용 소파</Link>
                        <Link to="">3인용 소파</Link>
                        <Link to="">암체어</Link>
                    </div>
                )}

                <div className="p-menu" onClick={() => toggleMenu("table")}>식탁 / 테이블 /의자</div>
                {openMenu === "table" && (
                    <div className="submenu">
                        <Link to="">식탁</Link>
                        <Link to="">거실용 테이블</Link>
                        <Link to="">의자</Link>
                    </div>
                )}
            </div>

            {/* 오른쪽 컨텐츠 ---------------------------------------------------- */}
            <div className="product-content">

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
                        <Link to="" className="product-link" key={item.id}>
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

export default AllProduct;