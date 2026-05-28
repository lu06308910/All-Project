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
                axios.get('http://192.168.4.60:9991/event/active')
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

        // Manager 이벤트에서 상품 목록 추출
        // events: /event/active 에서 받아온 배열 (위에서 이미 fetch)
        // 각 event = { e_id, subject, context, updatedate, enddate, discountPercent, product: { pid, name, price, company, fileList, ... } }
        const eventProducts = events
                .filter(e => e.product != null)
                .map(e => ({
                        e_id: e.e_id,
                        pid: e.product?.pid,
                        discountPercent: e.discountPercent ?? 0,
                        product: e.product,
                }));

        // 보여줄 상품
        const visibleProducts = showMore ? eventProducts : eventProducts.slice(0, 8);

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

                axios.get(`http://192.168.4.60:9991/like/list/${mId}`)
                        .then(res => setLikedItems(res.data))
                        .catch(err => console.log(err));
        }, []);

        // 별 리뷰 수 가져오기
        useEffect(() => {
                if (eventProducts.length === 0) return;

                eventProducts.forEach(item => {
                        axios.get(`http://192.168.4.60:9991/review/avg/${item.pid}`)
                                .then(res => {
                                        setStarMap(prev => ({
                                                ...prev,
                                                [item.pid]: res.data ?? 0
                                        }));
                                });
                });
        }, [events]);
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
                                                                                                        product?.fileList?.[0]?.filename
                                                                                                                ? `http://192.168.4.60:9991/upload/${product.fileList[0].filename}.${product.fileList[0].extname}`
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
                                                                                                        ₩ {Number(String(product?.price || '0').replace(/[^0-9]/g, '')).toLocaleString()}
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
                                                                                                                Number(String(product?.price || '0').replace(/[^0-9]/g, '')) * (1 - Number(item.discountPercent || 0) / 100)
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
                                {/* 더보기 버튼 */}
                                {eventProducts.length > 8 && (
                                        <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '40px' }}>
                                                <button
                                                        style={{
                                                                padding: '10px 40px', border: '1px solid #333',
                                                                borderRadius: '6px', background: 'white', cursor: 'pointer',
                                                                fontSize: '14px', fontWeight: '500'
                                                        }}
                                                        onClick={() => setShowMore(prev => !prev)}
                                                >
                                                        {showMore ? '접기' : '더보기'}
                                                </button>
                                        </div>
                                )}
                        </div>

                </>
        )
}

export default sale