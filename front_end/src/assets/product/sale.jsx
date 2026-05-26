import './../css/kdh.css';
import './../css/seul.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { Carousel } from 'react-bootstrap';
import { Ellipsis } from 'react-bootstrap/esm/PageItem';
import { Link } from 'react-router-dom';
import axios from 'axios';

function sale() {
        const [events, setEvents] = useState([]);
        useEffect(() => {
                axios.get('http://localhost:9990/event/active')
                        .then(res => setEvents(res.data))
                        .catch(err => console.log(err));
        }, []);



        const now = new Date();
        const activeEvent = events.find(e => {
                const start = e.updatedate ? new Date(e.updatedate) : null;
                const end = e.enddate ? new Date(e.enddate) : null;
                return start && end && now >= start && now <= end;
        });

        // 타이머
        const [timeLeft, setTimeLeft] = useState('');
        const [dDay, setDDay] = useState('');

        useEffect(() => {
                if (!activeEvent) return;

                const end = new Date(activeEvent.enddate);
                const start = new Date(activeEvent.updatedate);

                const tick = () => {
                        const now = new Date();

                        // D-day 계산
                        const diffMs = end - now;
                        if (diffMs <= 0) {
                                setTimeLeft('종료');
                                setDDay('종료');
                                return;
                        }
                        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                        setDDay(diffDays === 0 ? 'D-DAY' : `D-${diffDays}`);

                        // 시:분:초
                        const hours = String(Math.floor((diffMs / (1000 * 60 * 60)) % 24)).padStart(2, '0');
                        const minutes = String(Math.floor((diffMs / (1000 * 60)) % 60)).padStart(2, '0');
                        const seconds = String(Math.floor((diffMs / 1000) % 60)).padStart(2, '0');
                        setTimeLeft(`${hours}:${minutes}:${seconds}`);
                };

                tick(); // 즉시 1회 실행
                const timer = setInterval(tick, 1000);
                return () => clearInterval(timer); // 클린업
        }, [activeEvent]);



        // ====================== 이슬 ===========================
        // 상품리스트 더보기 상태
        const [showMore, setShowMore] = useState(false);

        // 상품 정보
        const [list, setList] = useState([]);
        const [saleList, setSaleList] = useState([]);

        useEffect(() => {
                axios.get("http://localhost:9990/event/sale/list")
                        .then(res => {
                                console.log("할인상품 리스트:", res.data);
                                setList(res.data);
                        })
                        .catch(err => console.log(err));
        }, []);

        // 보여줄 상품
        const visibleProducts = showMore ? list : list.slice(0, 8);

        // 할인 필터 (안전하게)
        const discountedProducts = visibleProducts.filter(
                item => Number(item?.discountPercent || 0) > 0
        );

        // 리뷰,별점  
        const [starMap, setStarMap] = useState({});// 예: { 1: 4.2, 3: 0, 5: 3.7 }
        const [dataList, setDataList] = useState([]);



        // 좋아요 상태 저장
        const [likedItems, setLikedItems] = useState([]);

        const toggleMenu = (menuName) => {
                setOpenMenu(openMenu === menuName ? null : menuName);
        };

        // 카테고리 파라미터
        const CategoryProduct = () => {
                const { sCategory } = useParams();

                console.log("카테고리:", sCategory);
        }



        // 좋아요
        useEffect(() => {
                const loginUserId = sessionStorage.getItem("loginUserId");
                const mId = sessionStorage.getItem("mId");

                if (!loginUserId) return;

                axios.get(`http://localhost:9990/like/list/${mId}`)
                        .then(res => setLikedItems(res.data))
                        .catch(err => console.log(err));
        }, []);

        // 별 리뷰 수 가져오기
        useEffect(() => {
                if (list.length === 0) return;

                list.forEach(product => {
                        axios.get(`http://localhost:9990/review/avg/${product.pid}`)
                                .then(res => {
                                        setStarMap(prev => ({
                                                ...prev,
                                                [product.pid]: res.data ?? 0
                                        }));
                                });
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

                axios.post("http://localhost:9990/like/toggle", {
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
                <>
                        <div >
                                <div style={{ margin: '0 auto', marginTop: '100px', textAlign: 'center' }}>
                                        <h3 style={{ fontWeight: '600' }}>CANVAS 특가 상품 기획</h3>
                                        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                                                {activeEvent ? (
                                                        <>
                                                                <h1 style={{ color: "white", backgroundColor: "black", padding: "2px 10px" }}>
                                                                        {dDay}
                                                                </h1>
                                                                <h1>{timeLeft}</h1>
                                                        </>
                                                ) : (
                                                        <h1 style={{ color: 'gray' }}>진행 중인 세일이 없습니다</h1>
                                                )}
                                        </div>
                                </div>
                                {/* 상품 리스트 */}
                                <div className="product-grid">

                                        {visibleProducts
                                                .filter(item => Number(item.discountPercent || 0) > 0)
                                                .map((item) => {

                                                        const product = item.product;
                                                        const pid = item.pid;


                                                        return (
                                                                <Link
                                                                        to={`/productDetail/${pid}`}
                                                                        className="product-link"
                                                                        key={pid}
                                                                >
                                                                        <div className="product-card">

                                                                                {/* 이미지 */}
                                                                                <div className="product-img"
                                                                                        style={{
                                                                                                position: "relative",
                                                                                                overflow: "hidden"

                                                                                        }}>
                                                                                        <img
                                                                                                className="main-product-img"
                                                                                                src={
                                                                                                        product.fileList[0].filename
                                                                                                                ? `http://localhost:9990/upload/${product.fileList[0].filename}.${product.fileList[0].extname}`
                                                                                                                : "/no-image.png"
                                                                                                }
                                                                                                alt={product?.name}
                                                                                                style={{
                                                                                                        width: "100%",
                                                                                                        display: "block",
                                                                                                }}
                                                                                        />

                                                                                        <img
                                                                                                className="like-btn"
                                                                                                src={
                                                                                                        likedItems.includes(pid)
                                                                                                                ? "/like2.png"
                                                                                                                : "/like.png"
                                                                                                }
                                                                                                onClick={(e) => {
                                                                                                        e.preventDefault();
                                                                                                        e.stopPropagation();
                                                                                                        handleLike(pid);
                                                                                                }}
                                                                                        />
                                                                                </div>

                                                                                {/* 정보 */}
                                                                                <div className="product-info">

                                                                                        <div className="brand">
                                                                                                {product?.company?.businessName || "brand"}
                                                                                        </div>

                                                                                        <div className="title">
                                                                                                {product?.name}
                                                                                        </div>

                                                                                        {/* 가격 (line style) */}
                                                                                        <div className="price-line">

                                                                                                {/* 정가 */}
                                                                                                <span className="origin-price">
                                                                                                        ₩ {Number(product?.price || 0).toLocaleString()}
                                                                                                </span>
                                                                                                {/* 할인율 */}
                                                                                                <span className="discount-percent">
                                                                                                        {item.discountPercent}%
                                                                                                </span>

                                                                                        </div>
                                                                                        <div>


                                                                                                {/* 할인 가격 */}
                                                                                                <span className="sale-price">
                                                                                                        ₩ {Math.floor(
                                                                                                                Number(product?.price || 0) *
                                                                                                                (1 - Number(item.discountPercent || 0) / 100)
                                                                                                        ).toLocaleString()}
                                                                                                </span>
                                                                                        </div>

                                                                                        {/* 별점 */}
                                                                                        <div className="rating">
                                                                                                {renderStars(starMap[pid])}
                                                                                        </div>

                                                                                </div>
                                                                        </div>
                                                                </Link>
                                                        );
                                                })}
                                </div>
                        </div>

                </>
        )
}

export default sale