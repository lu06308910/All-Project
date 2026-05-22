import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import './../css/seul.css';


function CategoryProduct() {

        const [openMenu, setOpenMenu] = useState(null);
        const [showMore, setShowMore] = useState(false);

        const { id } = useParams(); // URL에서 카테고리 정보 추출

        // 리뷰,별점
        const [reviews, setReviews] = useState({}); // 백엔드 받아오기
        const [starMap, setStarMap] = useState({});// 예: { 1: 4.2, 3: 0, 5: 3.7 }
        const [dataList, setDataList] = useState([]);

        const toggleMenu = (menuName) => {
                setOpenMenu(openMenu === menuName ? null : menuName);
        };

        const [activeSub, setActiveSub] = useState(null);

        // 좋아요 상태 저장
        const [likedItems, setLikedItems] = useState([]);

        // 좋아요
        useEffect(() => {
                const loginUserId = sessionStorage.getItem("loginUserId");
                const mId = sessionStorage.getItem("mId");

                if (!loginUserId) return;

                axios.get(`http://192.168.4.51:9989/like/list/${mId}`)
                        .then(res => setLikedItems(res.data))
                        .catch(err => console.log(err));
        }, []);

        const { sCategory } = useParams(); // 카테고리 매핑주소
        const [data, setData] = useState([]); // 카테고리 해당 제품 데이터


        // 처음 4개 + showMore true면 전체 + 내림차순 정렬(새상품부터 보여짐)
        const visibleProducts = showMore
                ? [...data].sort((a, b) => b.pid - a.pid)
                : [...data].sort((a, b) => b.pid - a.pid).slice(0, 4);

        // 카테고리별 제품 데이터 
        useEffect(() => {
                if (!sCategory) return;

                axios.get(`http://192.168.4.51:9989/categoryproduct/${sCategory}`)
                        .then((res) => {
                                setData(res.data.dataList);
                        });
        }, [sCategory]);

        // 좋아요 백엔드
        function handleLike(productId) {
                const mId = sessionStorage.getItem("mId");
                console.log("mId:", mId);
                console.log("productId:", productId);

                if (!mId || !productId) {
                        return;
                }

                axios.post("http://192.168.4.51:9989/like/toggle", {
                        memberId: mId,
                        productId: productId
                })
                        .then(res => {
                                const { liked } = res.data;

                                setLikedItems(prev =>
                                        liked
                                                ? [...prev, productId]
                                                : prev.filter(id => id !== productId)
                                );
                        })
                        .catch(err => console.log(err));
        }



        // 별 리뷰 수 가져오기
        useEffect(() => {
                if (!data || data.length === 0) return;

                data.forEach(product => {
                        axios.get(`http://192.168.4.51:9989/review/avg/${product.pid}`)
                                .then(res => {
                                        setStarMap(prev => ({
                                                ...prev,
                                                [product.pid]: res.data
                                        }));
                                })
                                .catch(err => console.log(err));
                });
        }, [data]);
        // 숫자 → 별(★) 변환 함수
        function renderStars(avg) {
                if (!avg) return "☆☆☆☆☆";  // 값 없을 때

                const fullStars = Math.floor(avg);      // 정수 부분 (예: 3.7 → 3)
                const halfStar = avg % 1 >= 0.5 ? 1 : 0; // 반개 여부
                const emptyStars = 5 - fullStars - halfStar;

                return "★".repeat(fullStars)
                        + (halfStar ? "☆" : "")
                        + "☆".repeat(emptyStars);
        }

        return (
                <div className="all-product-wrap">

                        {/* 왼쪽 사이드 메뉴 ------------------------------------------------- */}

                        <div className="side-menu">
                                <h2>제품</h2>

                                {/* 수납가구 */}
                                <div className="p-menu" onClick={() => toggleMenu("storage")}>수납가구</div>
                                {openMenu === "storage" && (
                                        <div className="submenu">
                                                <Link to="/categoryproduct/책장" onClick={() => setActiveSub("책장")} className={activeSub === "책장" ? "active" : ""}>책장</Link>
                                                <Link to="/categoryproduct/수납장" onClick={() => setActiveSub("수납장")} className={activeSub === "수납장" ? "active" : ""}>수납장</Link>
                                                <Link to="/categoryproduct/옷장" onClick={() => setActiveSub("옷장")} className={activeSub === "옷장" ? "active" : ""}>옷장</Link>
                                        </div>
                                )}

                                {/* 침대 / 매트리스 */}
                                <div className="p-menu" onClick={() => toggleMenu("bed")}>침대 / 매트리스</div>
                                {openMenu === "bed" && (
                                        <div className="submenu">
                                                <Link to="/categoryproduct/싱글 침대" onClick={() => setActiveSub("싱글 침대")} className={activeSub === "싱글 침대" ? "active" : ""}>싱글 침대</Link>
                                                <Link to="/categoryproduct/퀸 침대" onClick={() => setActiveSub("퀸 침대")} className={activeSub === "퀸 침대" ? "active" : ""}>퀸 침대</Link>
                                                <Link to="/categoryproduct/매트리스" onClick={() => setActiveSub("매트리스")} className={activeSub === "매트리스" ? "active" : ""}>매트리스</Link>
                                        </div>
                                )}

                                {/* 소파 */}
                                <div className="p-menu" onClick={() => toggleMenu("sofa")}>소파 / 암체어</div>
                                {openMenu === "sofa" && (
                                        <div className="submenu">
                                                <Link to="/categoryproduct/2인용 소파" onClick={() => setActiveSub("2인용 소파")} className={activeSub === "2인용 소파" ? "active" : ""}>2인용 소파</Link>
                                                <Link to="/categoryproduct/3인용 소파" onClick={() => setActiveSub("3인용 소파")} className={activeSub === "3인용 소파" ? "active" : ""}>3인용 소파</Link>
                                                <Link to="/categoryproduct/암체어" onClick={() => setActiveSub("암체어")} className={activeSub === "암체어" ? "active" : ""}>암체어</Link>
                                        </div>
                                )}

                                {/* 식탁 / 테이블 / 의자 */}
                                <div className="p-menu" onClick={() => toggleMenu("table")}>식탁 / 테이블 / 의자</div>
                                {openMenu === "table" && (
                                        <div className="submenu">
                                                <Link to="/categoryproduct/식탁" onClick={() => setActiveSub("식탁")} className={activeSub === "식탁" ? "active" : ""}>식탁</Link>
                                                <Link to="/categoryproduct/거실용 테이블" onClick={() => setActiveSub("거실용 테이블")} className={activeSub === "거실용 테이블" ? "active" : ""}>거실용 테이블</Link>
                                                <Link to="/categoryproduct/의자" onClick={() => setActiveSub("의자")} className={activeSub === "의자" ? "active" : ""}>의자</Link>
                                        </div>
                                )}

                                {/* 책상 / 사무용 의자 */}
                                <div className="p-menu" onClick={() => toggleMenu("chair")}>책상 / 사무용 의자</div>
                                {openMenu === "chair" && (
                                        <div className="submenu">
                                                <Link to="/categoryproduct/책상 컴퓨터 책상" onClick={() => setActiveSub("컴퓨터 책상")} className={activeSub === "컴퓨터 책상" ? "active" : ""}>책상/컴퓨터 책상</Link>
                                                <Link to="/categoryproduct/의자 사무실 의자" onClick={() => setActiveSub("사무실 의자")} className={activeSub === "사무실 의자" ? "active" : ""}>의자/사무실의자</Link>
                                                <Link to="/categoryproduct/책상 의자 세트" onClick={() => setActiveSub("책상 의자 세트")} className={activeSub === "책상 의자 세트" ? "active" : ""}>책상/의자 세트</Link>
                                        </div>
                                )}

                                {/* 조명 */}
                                <div className="p-menu" onClick={() => toggleMenu("light")}>조명</div>
                                {openMenu === "light" && (
                                        <div className="submenu">
                                                <Link to="/categoryproduct/일반 조명" onClick={() => setActiveSub("일반 조명")} className={activeSub === "일반 조명" ? "active" : ""}>일반 조명</Link>
                                                <Link to="/categoryproduct/시스템 조명" onClick={() => setActiveSub("시스템 조명")} className={activeSub === "시스템 조명" ? "active" : ""}>시스템 조명</Link>
                                                <Link to="/categoryproduct/장식 조명" onClick={() => setActiveSub("장식 조명")} className={activeSub === "장식 조명" ? "active" : ""}>장식조명</Link>
                                        </div>
                                )}

                                {/* 욕실 */}
                                <div className="p-menu" onClick={() => toggleMenu("bathroom")}>욕실</div>
                                {openMenu === "bathroom" && (
                                        <div className="submenu">
                                                <Link to="/categoryproduct/욕실 벽수납장" onClick={() => setActiveSub("욕실 벽수납장")} className={activeSub === "욕실 벽수납장" ? "active" : ""}>욕실 벽수납장</Link>
                                                <Link to="/categoryproduct/욕실 세면대 하부장" onClick={() => setActiveSub("욕실 세면대 하부장")} className={activeSub === "욕실 세면대 하부장" ? "active" : ""}>욕실 세면대하부장</Link>
                                                <Link to="/categoryproduct/욕실 거울" onClick={() => setActiveSub("욕실 거울")} className={activeSub === "욕실 거울" ? "active" : ""}>욕실 거울</Link>
                                        </div>
                                )}
                        </div>


                        {/* 오른쪽 컨텐츠 ---------------------------------------------------- */}
                        <div className="product-content">
                                <div style={{ borderBottom: '2px solid black', marginBottom: '30px', padding: '10px' }}>
                                        <h2>{data?.[0]?.scategory}</h2>
                                </div>

                                {/* 제품 리스트 (한 줄 4개 고정 + 더보기 기능) */}
                                <div className="product-grid">

                                        {visibleProducts.map((item) => (

                                                <Link
                                                        to={`/productDetail/${item.pid}`}
                                                        className="product-link"
                                                        key={item.pid}
                                                >

                                                        <div className="product-card">

                                                                <div className="product-img" style={{
                                                                        position: "relative",
                                                                        overflow: "hidden"

                                                                }}>

                                                                        <img
                                                                                className="main-product-img"
                                                                                src={item.fileList?.[0]
                                                                                        ? `http://192.168.4.51:9989/upload/${item.fileList[0].filename}.${item.fileList[0].extname}`
                                                                                        : "/no-image.png"}
                                                                                alt=""
                                                                        />

                                                                        <img
                                                                                className="like-btn"
                                                                                src={
                                                                                        likedItems.includes(item.pid)
                                                                                                ? "/like2.png"
                                                                                                : "/like.png"
                                                                                }
                                                                                alt="like"
                                                                                onClick={(e) => {
                                                                                        e.preventDefault();
                                                                                        handleLike(item.pid);
                                                                                }}
                                                                        />

                                                                </div>

                                                                <div className="product-info">

                                                                        <div style={{ fontWeight: "bold" }}>
                                                                                {item.company?.name || "canvas"}
                                                                        </div>

                                                                        <div className="title">
                                                                                {item.name}
                                                                        </div>

                                                                        <div className="price">
                                                                                ₩{item.price}
                                                                        </div>

                                                                        <div className="rating">
                                                                                {renderStars(starMap[item.pid])}
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