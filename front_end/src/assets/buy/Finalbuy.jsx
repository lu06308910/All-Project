import React, { useState, useRef, useEffect, useMemo } from "react";
import { Link } from "react-router-dom"
import { Carousel } from "react-bootstrap";
import axios from "axios";

function Finalbuy() {

        // 제품 데이터 배열, 관련상품  
        // ======= 이슬 관련상품 추가 ================
        const [mergedList, setMergedList] = useState([]); // 할인 정보가 합쳐진 상품 리스트
        const [saleList, setSaleList] = useState([]); // 할인상품

        const [starMap, setStarMap] = useState({});// 상품별 별점 평균 

        const purchasedItems = JSON.parse(sessionStorage.getItem("buyItems")) || [];
        const baseCategory = purchasedItems[0]?.scategory;

        // 구매한 상품 불러오기
        const [tempCartData, setTempCartData] = useState([]);// 구매한 상품
        const boughtCategory = tempCartData?.[0]?.product?.scategory;


        // 전체상품
        const [allProducts, setAllProducts] = useState([]);

        useEffect(() => {
                axios.get("http://localhost:9990/allproduct")
                        .then(res => setAllProducts(res.data));
        }, []);

        const [related, setRelated] = useState([]);
        const [buyList, setBuyList] = useState([]);

        useEffect(() => {
                const mId = sessionStorage.getItem("mId");
                if (!mId) return;

                axios.get(`http://localhost:9990/buy/list/${mId}`)
                        .then(res => {
                                console.log("구매 목록:", res.data);
                                setBuyList(res.data);

                                // 구매목록 대표 카테고리
                                const boughtCategory = res.data?.[0]?.product?.scategory;
                                console.log("구매 대표 카테고리:", boughtCategory);

                                // 관련상품 가져오기
                                if (boughtCategory) {
                                        axios.get(`http://localhost:9990/categoryproduct/${boughtCategory}`)
                                                .then(r => {
                                                        console.log("관련상품 응답:", r.data);

                                                        const arr = r.data.dataList || [];

                                                        console.log("관련상품 배열:", arr);
                                                        setRelated(arr);
                                                });
                                }
                        })
                        .catch(err => console.log(err));
        }, []);



        // 관련상품 필터링
        const relatedProducts = useMemo(() => {
                return related.filter(p => p && p.id !== buyList?.[0]?.product?.pid);
        }, [related, buyList]);

        // 4개씩 묶기
        const productChunks = [];
        for (let i = 0; i < relatedProducts.length; i += 4) {
                productChunks.push(relatedProducts.slice(i, i + 4));
        }

        // 관련상품 리스트 숫자 → 별(★) 변환 함수
        function renderStars(avg) {
                if (!avg) return "☆☆☆☆☆";  // 값 없을 때

                const fullStars = Math.floor(avg);      // 정수 부분 (예: 3.7 → 3)
                const halfStar = avg % 1 >= 0.5 ? 1 : 0; // 반개 여부
                const emptyStars = 5 - fullStars - halfStar;

                return "★".repeat(fullStars)
                        + (halfStar ? "☆" : "")
                        + "☆".repeat(emptyStars);
        }


        useEffect(() => {
                // 1. 세션 스토리지에서 결제 직전에 저장한 데이터 꺼내기
                const tempDelivery = JSON.parse(sessionStorage.getItem('tempDelivery'));
                const tempCart = JSON.parse(sessionStorage.getItem('tempCart'));

                // 데이터가 있다면 서버로 주문 저장 요청하기
                if (tempDelivery && tempCart) {
                        axios.post('http://localhost:9990/buy/process-order', {
                                delivery: tempDelivery,
                                cartList: tempCart
                        })
                                .then(res => {
                                        console.log("주문 DB 저장 완료!");
                                        // 저장이 끝났으니 임시 데이터는 삭제
                                        sessionStorage.removeItem('tempDelivery');
                                        sessionStorage.removeItem('tempCart');
                                        sessionStorage.removeItem('buyItems'); // 장바구니 비우기 연동
                                })
                                .catch(err => {
                                        console.error("주문 DB 저장 실패:", err);
                                        alert("결제는 완료되었으나 주문 저장 중 오류가 발생했습니다.");
                                });
                }
        }, []);

        return (
                <>
                        <div className="footer-container" style={{ backgroundColor: 'white' }}>
                                <div>
                                        <h3 style={{ fontWeight: '600' }}>결제 진행</h3>
                                        <div style={{ position: 'relative' }}>
                                                <div className='stepper-line-active' style={{ width: '75%' }}></div>
                                                <div className="stepper-container">
                                                        <div><span>●</span></div>
                                                        <div><span>●</span></div>
                                                        <div><span>●</span></div>
                                                </div>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-evenly', marginTop: '-40px' }}>
                                                <div>
                                                        <span>장바구니</span>
                                                </div>
                                                <div>
                                                        <span>주문결제</span>
                                                </div>
                                                <div>
                                                        <span>주문완료</span>
                                                </div>
                                        </div>
                                </div>
                                <h4 style={{ textAlign: 'center', marginTop: '50px' }}>결제가 완료 되었습니다.</h4>
                                <div style={{ marginTop: '50px', marginBottom: '100px', display: 'flex', justifyContent: 'center' }}>
                                        <Link to='/'>
                                                <button className='button3' style={{ marginRight: '10px', width: '100px' }}>
                                                        메인 페이지
                                                </button>
                                        </Link>
                                        <Link to='/mypage'>
                                                <button className='button3' style={{ width: '100px' }}>마이스토어</button>
                                        </Link>
                                </div>
                                <hr />
                                <h5 style={{ margin: '20px 30px' }}>관련 상품</h5>
                                <hr />
                                <div style={{ padding: "40px 0", textAlign: "center" }}>
                                        <Carousel
                                                indicators={false} // 하단 점 숨기기
                                                interval={null}    // 자동 재생 끄기 (화살표로만 조작)
                                                variant="dark"     // 화살표 색상을 어둡게 (배경이 밝을 때)
                                        >
                                                {productChunks.map((chunk, index) => (
                                                        <Carousel.Item key={index}>
                                                                <div
                                                                        style={{
                                                                                display: 'flex',
                                                                                justifyContent: 'center',
                                                                                gap: '20px',
                                                                                padding: '0 50px',
                                                                                marginTop: '100px',
                                                                                marginBottom: '100px'
                                                                        }}
                                                                >
                                                                        {chunk.map(raw => {
                                                                                // 구매목록이면 raw.product 사용 / 아니면 raw 자체 사용
                                                                                const item = raw.product || raw;

                                                                                return (
                                                                                        <Link
                                                                                                to={`/product/${item.pId || item.id}`}
                                                                                                className="product-link"
                                                                                                key={item.pId || item.id}
                                                                                                style={{ textDecoration: 'none', color: 'inherit', width: '25%' }}
                                                                                        >
                                                                                                <div className="product-card">
                                                                                                        {/* 이미지 */}
                                                                                                        <div className="product-img">
                                                                                                                <img
                                                                                                                        src={item.fileList?.[0]
                                                                                                                                ? `http://localhost:9990/upload/${item.fileList[0].filename}.${item.fileList[0].extname}`
                                                                                                                                : "/no-image.png"}
                                                                                                                        alt={item.pname || item.name}
                                                                                                                        style={{ width: '100%' }}
                                                                                                                />
                                                                                                        </div>

                                                                                                        <div style={{ textAlign: 'left', marginTop: '10px' }}>
                                                                                                                {/* 브랜드 */}
                                                                                                                <div style={{ color: "gray", fontSize: '0.8em' }}>한샘</div>

                                                                                                                {/* 상품명 */}
                                                                                                                <div
                                                                                                                        className="title"
                                                                                                                        style={{
                                                                                                                                overflow: 'hidden',
                                                                                                                                textOverflow: 'ellipsis',
                                                                                                                                display: '-webkit-box',
                                                                                                                                WebkitBoxOrient: 'vertical',
                                                                                                                                WebkitLineClamp: 2,
                                                                                                                                whiteSpace: 'normal',
                                                                                                                                height: '2.8em',
                                                                                                                                fontWeight: '500'
                                                                                                                        }}
                                                                                                                >
                                                                                                                        {item.pname || item.name}
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
                                                                                                                                        ₩ {Number(String(item.price || 0).replace(/,/g, "")).toLocaleString()}
                                                                                                                                </span>
                                                                                                                        )}
                                                                                                                </div>

                                                                                                                <div className="rating">
                                                                                                                        {renderStars(starMap[item.id])}
                                                                                                                </div>
                                                                                                        </div>
                                                                                                </div>
                                                                                        </Link>
                                                                                );
                                                                        })}
                                                                </div>
                                                        </Carousel.Item>
                                                ))}
                                        </Carousel>
                                </div>
                        </div>
                </>
        )
}

export default Finalbuy