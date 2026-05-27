import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Link } from 'react-router-dom';
import './../css/kdh.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Carousel } from 'react-bootstrap';

function Home() {

        // 정보 불러오기 
        const { id } = useParams();

        // 좋아요 상태 저장
        const [likedItems, setLikedItems] = useState([]);
        const [starMap, setStarMap] = useState({});

        const toggleMenu = (menuName) => {
                setOpenMenu(openMenu === menuName ? null : menuName);
        };

        // 좋아요
        useEffect(() => {
                const loginUserId = sessionStorage.getItem("loginUserId");
                const mId = sessionStorage.getItem("mId");

                if (!loginUserId) return;

                axios.get(`http://localhost:9990/like/list/${mId}`)
                        .then(res => setLikedItems(res.data))
                        .catch(err => console.log(err));
        }, []);
        // 상품 정보
        useEffect(() => {
        
                getDataList(1);
        
            }, []);


        // 카테고리
        const categories = [
                { id: 1, name: '책장', img: '/image/storage.jpeg',category:'수납가구'},
                { id: 2, name: '매트리스', img: '/image/bed.jpeg',category:'침대 / 매트리스' },
                { id: 3, name: '2인용 소파', img: '/image/sofa.jpeg',category:'소파 / 암체어' },
                { id: 4, name: '식탁', img: '/image/table.jpeg' ,category:'식탁 / 테이블 / 의자'},
                { id: 5, name: '책상', img: '/image/desk.jpeg',category:'책상 / 사무용 의자' },
                { id: 6, name: '조명', img: '/image/lighting.jpeg',category:'조명' },
                { id: 7, name: '욕실', img: '/image/bath.jpeg',category:'욕실' },
        ]

        const [showMore, setShowMore] = useState(false);
        const [showTopBtn, setShowTopBtn] = useState(false);

        // 더보기
        const [list, setList] = useState([]);
        // 처음 4개 + showMore true면 전체
        const visibleProducts = showMore ? list : list.slice(0, 8);

        // springboot 서버에서 비동기식으로 정보를 가져올 함수
        function getDataList(page) {
                
                axios.get(`http://localhost:9990/home`)
                        .then((response) => {

                                console.log(response.data);


                                const newList = response.data.map((record) => {
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
        // 별 리뷰 수 가져오기
        useEffect(() => {

                if (!list || list.length === 0) return;

                list.forEach(product => {
                        axios.get(`http://localhost:9990/review/avg/${product.id}`)
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
        // --------------------------------------------------------------------------------------------------

        return (
                <div className="home-main">
                        {/* 카테고리 */}
                        <nav className="category-unit">
                                <ul className="category-list">
                                        {categories.map((item) => (
                                                <li key={item.id} className="category-item">
                                                        {/* 페이징 후 각 페이지 링크*/}
                                                        <a href={`/categoryproduct/${item.name}`} className="category-link">
                                                                <div className="category-circle">
                                                                        <img src={item.img} alt={item.name} />
                                                                </div>
                                                                <span className="category-name">{item.category}</span>
                                                        </a>
                                                </li>
                                        ))}
                                </ul>
                        </nav>

                        {/* 슬라이드(Carousel) */}
                        <div className="main-slider">
                                <Carousel fade interval={3000}>
                                        <Carousel.Item>
                                                <Link to="/">
                                                        <img className="d-block w-100" src="/image/banner1.jpg" alt="first slide" />
                                                </Link>
                                        </Carousel.Item>
                                        <Carousel.Item>
                                                <Link to="/">
                                                        <img className="d-block w-100" src="/image/banner2.jpg" alt="twice slide" />
                                                </Link>
                                        </Carousel.Item>
                                        <Carousel.Item>
                                                <Link to="/">
                                                        <img className="d-block w-100" src="/image/banner3.jpg" alt="twice slide" />
                                                </Link>
                                        </Carousel.Item>
                                </Carousel>
                        </div>

                        {/* 모든 상품 */}
                        <div className="main-product-section">
                                <h2>CANVAS 상품</h2><br />
                                <p>CANVAS의 모든 컬렉션을 만나보세요</p>
                                <hr />
                        </div>

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

                </div >
        );
}
export default Home;