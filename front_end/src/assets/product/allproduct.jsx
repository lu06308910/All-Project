import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import './../css/seul.css';

function AllProduct() {
    const [openMenu, setOpenMenu] = useState(null);
    const [showMore, setShowMore] = useState(false);


    // 리뷰,별점
    const [reviews, setReviews] = useState([]); // 백엔드 받아오기
    const [starMap, setStarMap] = useState({});// 예: { 1: 4.2, 3: 0, 5: 3.7 }
    const [dataList, setDataList] = useState([]);

    const { id } = useParams()

    // 상품정보
    const [list, setList] = useState([]);
    const [mergedList, setMergedList] = useState([]);
    const [saleList, setSaleList] = useState([]); // 할인상품

    // 카테고리 파라미터
    const CategoryProduct = () => {
        const { sCategory } = useParams();

        console.log("카테고리:", sCategory);
    }

    // 좋아요 상태 저장
    const [likedItems, setLikedItems] = useState([]);

    const toggleMenu = (menuName) => {
        setOpenMenu(openMenu === menuName ? null : menuName);
    };

    // 좋아요
    useEffect(() => {
        const loginUserId = sessionStorage.getItem("loginUserId");
        const mId = sessionStorage.getItem("mId");

        if (!loginUserId) return;

        axios.get(`http://192.168.4.60:9991/like/list/${mId}`)
            .then(res => setLikedItems(res.data))
            .catch(err => console.log(err));
    }, []);

    useEffect(() => {
        axios.get("http://192.168.4.60:9991/event/sale/list")
            .then(res => {
                console.log("할인 데이터:", res.data);
                setSaleList(res.data);
            })
            .catch(err => console.log(err));
    }, []);


    useEffect(() => {
        if (!list.length) return;

        const merged = list.map((item) => {
            const sale = saleList.find(
                (s) => Number(s.product?.pid) === Number(item.id)
            );

            const discountPercent = Number(sale?.discountPercent ?? 0);

            const price = item.price;

            return {
                ...item,
                discountPercent,
                salePrice:
                    discountPercent > 0
                        ? Math.floor(price * (1 - discountPercent / 100))
                        : price
            };
        });

        setMergedList(merged);
    }, [list, saleList]);


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

        axios.get(`http://192.168.4.60:9991/allproduct${url}`)
            .then((response) => {

                console.log(response.data);


                const newList = response.data.map((record) => {
                    return {
                        id: record.pid,
                        title: record.name,
                        price: Number(String(record.price).replace(/[^0-9]/g, "")),
                        businessName: record.company?.businessName,
                        img: record.fileList?.[0]
                            ? `http://192.168.4.60:9991/upload/${record.fileList[0].filename}.${record.fileList[0].extname}`
                            : "/no-image.png"

                    };
                });

                setList(newList);

            })
            .catch((error) => {
                console.log("목록조회 에러발생==>", error);
            });
    }
    const visibleProducts = useMemo(() => {
        return showMore
            ? mergedList
            : mergedList.slice(0, 8);
    }, [mergedList, showMore]);

    // 별 리뷰 수 가져오기
    useEffect(() => {

        if (!list || list.length === 0) return;

        list.forEach(product => {
            axios.get(`http://192.168.4.60:9991/review/avg/${product.id}`)
                .then(res => {

                    setStarMap(prev => ({
                        ...prev,
                        [product.id]: res.data
                    }));
                })
                .catch(err => console.log(err));
        });
    }, [list]);
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

    // 좋아요 백엔드
    function handleLike(productId) {
        const mId = sessionStorage.getItem("mId");
        console.log("mId:", mId);
        console.log("productId:", productId);

        if (!mId || !productId) {
            console.log("값 없음", mId, productId);
            navigate("/login");
            return;
        }

        axios.post("http://192.168.4.60:9991/like/toggle", {
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

    return (
        <div className="all-product-wrap">

            {/* 왼쪽 사이드 메뉴 ------------------------------------------------- */}
            <div className="side-menu">
                <h2>제품</h2>

                <div className="p-menu" onClick={() => toggleMenu("storage")}>수납가구</div>
                {openMenu === "storage" && (
                    <div className="submenu">
                        <Link to="/categoryproduct/책장">책장</Link>
                        <Link to="/categoryproduct/수납장">수납장</Link>
                        <Link to="/categoryproduct/옷장">옷장</Link>
                    </div>
                )}

                <div className="p-menu" onClick={() => toggleMenu("bed")}>침대 / 매트리스</div>
                {openMenu === "bed" && (
                    <div className="submenu">
                        <Link to="/categoryproduct/싱글 침대">싱글 침대</Link>
                        <Link to="/categoryproduct/퀸 침대">퀸 침대</Link>
                        <Link to="/categoryproduct/매트리스">매트리스</Link>
                    </div>
                )}

                <div className="p-menu" onClick={() => toggleMenu("sofa")}>소파 / 암체어</div>
                {openMenu === "sofa" && (
                    <div className="submenu">
                        <Link to="/categoryproduct/2인용 소파">2인용 소파</Link>
                        <Link to="/categoryproduct/3인용 소파">3인용 소파</Link>
                        <Link to="/categoryproduct/암체어">암체어</Link>
                    </div>
                )}

                <div className="p-menu" onClick={() => toggleMenu("table")}>식탁 / 테이블 / 의자</div>
                {openMenu === "table" && (
                    <div className="submenu">
                        <Link to="/categoryproduct/식탁">식탁</Link>
                        <Link to="/categoryproduct/거실용 테이블">거실용 테이블</Link>
                        <Link to="/categoryproduct/의자">의자</Link>
                    </div>
                )}
                <div className="p-menu" onClick={() => toggleMenu("chair")}>책상 / 사무용 의자</div>
                {openMenu === "chair" && (
                    <div className="submenu">
                        <Link to="/categoryproduct/책상 컴퓨터 책상">책상/컴퓨터 책상</Link>
                        <Link to="/categoryproduct/의자 사무실의자">의자/사무실의자</Link>
                        <Link to="/categoryproduct/책상 의자 세트">책상/의자 세트</Link>
                    </div>
                )}
                <div className="p-menu" onClick={() => toggleMenu("light")}>조명</div>
                {openMenu === "light" && (
                    <div className="submenu">
                        <Link to="/categoryproduct/일반 조명">일반 조명</Link>
                        <Link to="/categoryproduct/시스템 조명">시스템 조명</Link>
                        <Link to="/categoryproduct/장식조명">장식조명</Link>
                    </div>
                )}
                <div className="p-menu" onClick={() => toggleMenu("bathroom")}>욕실</div>
                {openMenu === "bathroom" && (
                    <div className="submenu">
                        <Link to="/categoryproduct/욕실 벽수납장">욕실 벽수납장</Link>
                        <Link to="/categoryproduct/욕실 세면대하부장">욕실 세면대하부장</Link>
                        <Link to="/categoryproduct/욕실 거울">욕실 거울</Link>
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

                                    <div style={{ fontWeight: "bold", color: "#868686", fontSize: "14px" }}>
                                        {item.businessName || "brand"}
                                    </div>

                                    <div className="title">
                                        {item.title}
                                    </div>

                                    <div className="price-line">

                                        {/* 할인 있는 경우만 */}
                                        {item.discountPercent > 0 ? (
                                            <>
                                                {/* 정가 */}
                                                <span className="origin-price">
                                                    ₩ {Number(item?.price || 0).toLocaleString()}
                                                </span>

                                                {/* 할인율 */}
                                                <span className="discount-percent">
                                                    {item.discountPercent}%
                                                </span>
                                            </>
                                        ) : null}

                                    </div>

                                    {/* 할인 가격 or 정가 */}
                                    <div>
                                        {item.discountPercent > 0 ? (
                                            <span className="price">
                                                ₩ {Math.floor(
                                                    Number(item?.price || 0) *
                                                    (1 - Number(item.discountPercent || 0) / 100)
                                                ).toLocaleString()}
                                            </span>
                                        ) : (
                                            <span className="price">
                                                ₩ {Number(item?.price || 0).toLocaleString()}
                                            </span>
                                        )}
                                    </div>

                                    <div className="rating">
                                        {renderStars(starMap[item.id])}
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