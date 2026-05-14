import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import './../css/seul.css';

function AllProduct() {
    const [openMenu, setOpenMenu] = useState(null);
    const [showMore, setShowMore] = useState(false);

    // 좋아요 상태 저장
    const [likedItems, setLikedItems] = useState([]);
    const toggleMenu = (menuName) => {
        setOpenMenu(openMenu === menuName ? null : menuName);
    };

    
    // 제품 데이터 배열
    const products = [
        { id: 1, img: "/p1.png", title: "BILLY 빌리", price: "89,900" },
        { id: 2, img: "/p2.png", title: "BILLY 빌리", price: "89,900" },
        { id: 3, img: "/p3.png", title: "BILLY 빌리", price: "89,900" },
        { id: 4, img: "/p4.png", title: "BILLY 빌리", price: "89,900" },
        { id: 5, img: "/p1.png", title: "BILLY 빌리", price: "89,900" },
        { id: 6, img: "/p2.png", title: "BILLY 빌리", price: "89,900" },
        { id: 7, img: "/p3.png", title: "BILLY 빌리", price: "89,900" },
    ];

    const [list, setList] = useState([]);
    // 처음 4개 + showMore true면 전체
    const visibleProducts = showMore ? list : list.slice(0, 4);

    // 좋아요 클릭
    const handleLike = (id) => {

        if (likedItems.includes(id)) {
            setLikedItems(likedItems.filter((item) => item !== id));
        } else {
            setLikedItems([...likedItems, id]);
        }

    };
    // 검색키와 검색어를 담을 변수
    const [searchData, setSearchData] = useState({ searchKey: 'subject', searchWord: '' });
    useEffect(() => {

        getDataList(1);

    }, []);
    // springboot 서버에서 비동기식으로 정보를 가져올 함수
    function getDataList(page) {
        let url = "?";

        if (searchData.searchWord !== '') {
            url += "searchKey=" + searchData.searchKey +
                "&searchWord=" + searchData.searchWord;
        }

        axios.get(`http://localhost:9990/allproduct${url}`)
            .then((response) => {

                console.log(response.data);
                

                const newList = response.data.dataList.map((record) => {
                    return {
                        id: record.pid,
                        title: record.name,
                        price: record.price,
                        img: record.fileList?.[0]
                            ? `http://localhost:9990/upload/${record.fileList[0].filename}.${record.fileList[0].extname}`
                            : "/no-image.png"
                    };
                });

                setList(newList);

            })
            .catch((error) => {
                console.log("목록조회 에러발생==>", error);
            });
    }

    return (
        <div className="all-product-wrap">

            {/* 왼쪽 사이드 메뉴 ------------------------------------------------- */}
            <div className="side-menu">
                <h2>제품</h2>

                <div className="p-menu" onClick={() => toggleMenu("storage")}>수납가구</div>
                {openMenu === "storage" && (
                    <div className="submenu">
                        <Link to="/categoryproduct">책장</Link>
                        <Link to="/categoryproduct">수납장</Link>
                        <Link to="/categoryproduct">옷장</Link>
                    </div>
                )}

                <div className="p-menu" onClick={() => toggleMenu("bed")}>침대 / 매트리스</div>
                {openMenu === "bed" && (
                    <div className="submenu">
                        <Link to="/categoryproduct">싱글 침대</Link>
                        <Link to="/categoryproduct">퀸 침대</Link>
                        <Link to="/categoryproduct">매트리스</Link>
                    </div>
                )}

                <div className="p-menu" onClick={() => toggleMenu("sofa")}>소파 / 암체어</div>
                {openMenu === "sofa" && (
                    <div className="submenu">
                        <Link to="/categoryproduct">2인용 소파</Link>
                        <Link to="/categoryproduct">3인용 소파</Link>
                        <Link to="/categoryproduct">암체어</Link>
                    </div>
                )}

                <div className="p-menu" onClick={() => toggleMenu("table")}>식탁 / 테이블 / 의자</div>
                {openMenu === "table" && (
                    <div className="submenu">
                        <Link to="/categoryproduct">식탁</Link>
                        <Link to="/categoryproduct">거실용 테이블</Link>
                        <Link to="/categoryproduct">의자</Link>
                    </div>
                )}
                <div className="p-menu" onClick={() => toggleMenu("chair")}>책상 / 사무용 의자</div>
                {openMenu === "chair" && (
                    <div className="submenu">
                        <Link to="/categoryproduct">책상/컴퓨터 책상</Link>
                        <Link to="/categoryproduct">의자/사무실의자</Link>
                        <Link to="/categoryproduct">책상/의자 세트</Link>
                    </div>
                )}
                <div className="p-menu" onClick={() => toggleMenu("light")}>조명</div>
                {openMenu === "light" && (
                    <div className="submenu">
                        <Link to="/categoryproduct">일반 조명</Link>
                        <Link to="/categoryproduct">시스템 조명</Link>
                        <Link to="/categoryproduct">장식조명</Link>
                    </div>
                )}
                <div className="p-menu" onClick={() => toggleMenu("bathroom")}>욕실</div>
                {openMenu === "bathroom" && (
                    <div className="submenu">
                        <Link to="/categoryproduct">욕실 벽수납장</Link>
                        <Link to="/categoryproduct">욕실 세면대하부장</Link>
                        <Link to="/categoryproduct">욕실 거울</Link>
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
                {/* 제품 리스트 */}
                <div className="product-grid">

                    {visibleProducts.map((item) => (

                        <Link
                            to={`/productDetail/${item.id}`}
                            className="product-link"
                            key={item.id}
                        >

                            <div className="product-card"
                            >

                                {/* 이미지 영역 */}
                                <div
                                    className="product-img"
                                    style={{
                                        position: "relative",
                                        overflow: "hidden"

                                    }}
                                >
                                    {/* 상품 이미지 */}
                                    <img
                                        className="main-product-img"
                                        src={item.img}
                                        alt=""
                                        style={{
                                            width: "100%",
                                            display: "block",
                                        }}
                                    />

                                    {/* 좋아요 버튼 */}
                                    <img
                                        className="like-btn"
                                        src={
                                            likedItems.includes(item.id)
                                                ? "/like2.png"
                                                : "/like.png"
                                        }
                                        alt="like"
                                        onClick={(e) => {
                                            e.preventDefault(); // Link 이동 방지
                                            handleLike(item.id);
                                        }}
                                    />



                                </div>

                                {/* 상품 정보 */}
                                <div className="product-info">

                                    <div style={{ fontWeight: "bold" }}>
                                        canvas
                                    </div>

                                    <div className="title">
                                        {item.title}
                                    </div>

                                    <div className="price">
                                        <span className="symbol">₩</span>
                                        <span className="amount">{item.price}</span>
                                    </div>

                                    <div className="rating">
                                        <img src="public/bal.png" alt="" />
                                        <img src="public/bal.png" alt="" />
                                        <img src="public/bal.png" alt="" />
                                        <img src="public/bal.png" alt="" />
                                        <img src="public/bal.png" alt="" />
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