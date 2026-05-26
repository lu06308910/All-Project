import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import './../css/seul.css';


function Space() {

        const [showMore, setShowMore] = useState(false);


        const [likedItems, setLikedItems] = useState([]);// 좋아요 상태 저장

        const [selectedCategory, setSelectedCategory] = useState(null); // 관련상품

        const [data, setData] = useState([]); // 카테고리 해당 제품 데이터

        const [list, setList] = useState([]);// 모든 상품 데이터
        const [mergedList, setMergedList] = useState([]);

        const [starMap, setStarMap] = useState({});// 상품별 별점 평균 저장 (예: { productId: avgRating, ... })

        const [saleList, setSaleList] = useState([]); // 할인상품


        useEffect(() => {
                getDataList();
        }, []);
        useEffect(() => {
                axios.get("http://localhost:9990/event/sale/list")
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

        // 좋아요
        useEffect(() => {
                const loginUserId = sessionStorage.getItem("loginUserId");
                const mId = sessionStorage.getItem("mId");

                if (!loginUserId) return;

                axios.get(`http://localhost:9990/like/list/${mId}`)
                        .then(res => setLikedItems(res.data))
                        .catch(err => console.log(err));
        }, []);


        // 처음 모든 제품데이터 가져오기
        function getDataList() {
                let url = "?";


                axios.get("http://localhost:9990/spaceproduct")
                        .then((response) => {

                                const dataList = response.data ?? [];  // ⭐ 핵심 수정

                                const newList = dataList.map((record) => ({
                                        id: record.pid,
                                        title: record.name,
                                        price: Number(String(record.price).replace(/[^0-9]/g, "")),
                                        category: record.b_category,
                                        img: record.fileList?.[0]
                                                ? `http://localhost:9990/upload/${record.fileList[0].filename}.${record.fileList[0].extname}`
                                                : "/no-image.png"


                                }));
                                console.log("공간 상품 데이터 가격 :", newList);
                                setList(newList);
                        })
        }
        // 관련상품 가져오기
        const filteredProducts = useMemo(() => {
                if (!selectedCategory) return mergedList;

                return mergedList.filter(item =>
                        item.category === selectedCategory
                );
        }, [mergedList, selectedCategory]);
        const visibleProducts = useMemo(() => {
                return showMore
                        ? filteredProducts
                        : filteredProducts.slice(0, 8);
        }, [filteredProducts, showMore]);




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


        return (
                <div className="space-wrap">

                        <div style={{ width: '100%', padding: '80px 0' }}>
                                {/* 상단 카테고리 경로 */}
                                <div style={{ fontSize: '14px', color: '#777', marginBottom: '40px' }}>
                                        공간별 쇼핑하기
                                </div>

                                <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        gap: '40px'
                                }}>

                                        {/* 텍스트 영역 */}
                                        <div style={{ flex: 1, minWidth: '380px' }}>
                                                <h2 style={{ fontWeight: 'bold', margin: '0 0 8px 0' }}>
                                                        공간을 완성하는 편안함, 스타일,
                                                </h2>
                                                <h2 style={{ fontWeight: 'bold', margin: '0 0 8px 0' }}>
                                                        그리고 스마트한 라이프를 위한
                                                </h2>
                                                <h2 style={{ fontWeight: 'bold', margin: '0 0 20px 0' }}>
                                                        집 안 모든 공간 맞춤 솔루션
                                                </h2>

                                                <p style={{ lineHeight: '1.6', color: '#555', maxWidth: '520px' }}>
                                                        집 안의 다양한 공간들이 필요한 기능과 분위기를 완성할 수 있도록
                                                        공간에 어울리는 디자인과 실용적인 제품들을 만나보세요.
                                                        편안함, 스타일, 그리고 스마트함까지 균형 있게 갖춘 아이템으로
                                                        당신의 생활공간을 더 특별하게 만듭니다.
                                                </p>

                                                <div style={{ fontSize: '24px', marginTop: '20px' }}>
                                                        <button style={{ border: 'none', backgroundColor: 'white', cursor: 'pointer' }}
                                                                onClick={() => {
                                                                        const section = document.getElementById('nextSection');
                                                                        section?.scrollIntoView({ behavior: 'smooth' });
                                                                }}>↓</button>
                                                </div>
                                        </div>

                                        {/* 우측 이미지 */}
                                        <div style={{ flex: 1, textAlign: 'right' }}>
                                                <img
                                                        src="public/spacemain.png"
                                                        alt="공간 이미지"
                                                        style={{
                                                                width: '100%',
                                                                maxWidth: '420px',
                                                                borderRadius: '12px',
                                                                objectFit: 'cover'
                                                        }}
                                                />
                                        </div>
                                </div>
                        </div>


                        <div id="nextSection">

                                <h1>CANVAS만의 공간 디자인</h1>

                                <div className="space-grid " >
                                        {/* 1번 큰 이미지 */}
                                        <div className="big-img img-box" onClick={() => {
                                                console.log("CLICK OK");
                                                setSelectedCategory("소파/암체어");
                                                setShowMore(false);
                                        }}>
                                                <img src="public/imgcatagory4.jpg" />
                                                <img src="public/imgBtn.png" className="btn-img" />


                                                {/* 오버레이(마우스 오버 시 나타남) */}
                                                <div className="hover-box">
                                                        <span>거실 더보기</span>
                                                </div>
                                        </div>

                                        {/* 2번 위쪽 작은 이미지 */}
                                        <div className="small-top img-box"
                                                onClick={() => {
                                                        console.log("CLICK OK");
                                                        setSelectedCategory("식탁/테이블/의자");
                                                        setShowMore(false);
                                                }} >
                                                <img src="public/imgcatagory3.png" />
                                                <img src="public/imgBtn.png" className="btn-img" />


                                                <div className="hover-box">
                                                        <span>주방 더보기</span>
                                                </div>
                                        </div>

                                        {/* 3번 식물 이미지 */}
                                        <div className="small-right img-box"
                                                onClick={() => {
                                                        console.log("CLICK OK");
                                                        setSelectedCategory("욕실");
                                                        setShowMore(false);
                                                }}>
                                                <img src="public/imgcatagory2.png" />
                                                <img src="public/imgBtn.png" className="btn-img" />


                                                <div className="hover-box">
                                                        <span>욕실 더보기</span>
                                                </div>
                                        </div>

                                        {/* 4번 긴 테이블 이미지 */}
                                        <div className="wide-bottom img-box" onClick={() => {
                                                console.log("CLICK OK");
                                                setSelectedCategory("침대/매트리스");
                                                setShowMore(false);
                                        }} >
                                                <img src="public/imgcatagory.png" />
                                                <img src="public/imgBtn.png" className="btn-img" />


                                                <div className="hover-box">
                                                        <span>침실 더보기</span>
                                                </div>
                                        </div>

                                </div>
                        </div>


                        <div style={{ margin: '150px 20px 50px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h2 style={{ margin: 0 }}>관련 상품</h2>

                                <a href="/allproduct" style={{ textDecoration: 'none', color: 'black', fontSize: '15px' }}>
                                        더보기 &gt;
                                </a>
                        </div>
                        {/* 오른쪽 컨텐츠 ---------------------------------------------------- */}
                        <div className="product-content">

                                {/* 제품 리스트 (한 줄 4개 고정 + 더보기 기능) */}
                                <div className="product-grid">

                                        {visibleProducts.map((item) => (


                                                <Link
                                                        to={`/productDetail/${item.id}`}
                                                        className="product-link"
                                                        key={item.id}
                                                >

                                                        <div className="product-card">

                                                                <div className="product-img" style={{
                                                                        position: "relative",
                                                                        overflow: "hidden"

                                                                }}>

                                                                        <img
                                                                                className="main-product-img"
                                                                                src={item.img}
                                                                                alt=""
                                                                        />

                                                                        <img
                                                                                className="like-btn"
                                                                                src={
                                                                                        likedItems.includes(item.id)
                                                                                                ? "/like2.png"
                                                                                                : "/like.png"
                                                                                }
                                                                                alt="like"
                                                                                onClick={(e) => {
                                                                                        e.preventDefault();
                                                                                        handleLike(item.id);
                                                                                }}
                                                                        />

                                                                </div>

                                                                <div className="product-info">

                                                                        <div style={{ fontWeight: "bold" }}>
                                                                                {item.company?.name || "canvas"}
                                                                        </div>

                                                                        <div className="title">
                                                                                {item.title}
                                                                        </div>

                                                                        {/* <div className="price">
                                                                                ₩{item.price}
                                                                        </div> */}

                                                                        {/* 가격 */}
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
        )


}
export default Space;