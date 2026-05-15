import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Carousel } from 'react-bootstrap';
import axios from "axios";
import './../css/seul.css';

function ProductDetail() {
        const [count, setCount] = useState(1);
        const [showDetail, setShowDetail] = useState(false);

        const { id } = useParams()
        const [filelist, setFilelist] = useState([]) // ['a.png','b.jpg','c.jpeg']
        const [data, setData] = useState({})

        const mounted = useRef(false)

        // 선택한 옵션값
        const [color, setColor] = useState("");
        const [colors, setColors] = useState([]);
        const [extraOption, setExtraOption] = useState("");
        const [selectedOptions, setSelectedOptions] = useState([]);

        // 사이즈 옵션
        const [sizes, setSizes] = useState([]);

        // 메인 상품 이미지 상태
        const [mainImage, setMainImage] = useState("");

        const loginUserId = sessionStorage.getItem("loginUserId");

        // 리뷰 
        const [reviewFilter, setReviewFilter] = useState("all"); // 리뷰글보기 , 사진만 보기 버튼
        const [zoomImage, setZoomImage] = useState(null); // 리뷰 확대 사진

        useEffect(() => {
                if (filelist.length > 0) {
                        const first = filelist[0];
                        setMainImage(first.url);
                }
        }, [filelist]);

        // 좋아요
        useEffect(() => {
                const loginUserId = sessionStorage.getItem("loginUserId");
                const mId = sessionStorage.getItem("mId");

                if (!loginUserId) return;

                axios.get(`http://localhost:9991/like/list/${mId}`)
                        .then(res => setLikedItems(res.data))
                        .catch(err => console.log(err));
        }, []);

        useEffect(() => {
                if (!color || !filelist) return;

                // 선택된 색상의 이미지만 필터링
                const filtered = filelist.filter(f => f.colorName === color);

                if (filtered.length > 0) {
                        setMainImage(filtered[0].url);
                }

        }, [color, filelist]);

        useEffect(() => {

                getDataDetail()

        }, [])

        // 상품이미지 배열
        const images = filelist;



        //  탭 메뉴 선택
        const [activeTab, setActiveTab] = useState("detail");
        // detail | related | review | qna

        // 좋아요 상태 저장
        const [likedItems, setLikedItems] = useState([]);


        const toggleMenu = (menuName) => {
                setOpenMenu(openMenu === menuName ? null : menuName);
        };

        // 제품 데이터 배열, 관련상품 
        const products = [
                { id: 1, img: "public/p1.png", title: "글자수체크를위해서최대한글귀를늘려보고있습니다안녕하세요반갑습니다어서오세요", price: "89,900", discount: "17%", rating: '4.9', ratcut: '304' },
                { id: 2, img: "public/p2.png", title: "BILLY 빌리", price: "89,900", discount: "17%", rating: '4.9', ratcut: '304' },
                { id: 3, img: "public/p3.png", title: "BILLY 빌리", price: "89,900", discount: "17%", rating: '4.9', ratcut: '304' },
                { id: 4, img: "public/p4.png", title: "BILLY 빌리", price: "89,900", discount: "17%", rating: '4.9', ratcut: '304' },
                { id: 5, img: "public/p1.png", title: "BILLY 빌리", price: "89,900", discount: "17%", rating: '4.9', ratcut: '304' },
                { id: 6, img: "public/p2.png", title: "BILLY 빌리", price: "89,900", discount: "17%", rating: '4.9', ratcut: '304' },
                { id: 7, img: "public/p3.png", title: "BILLY 빌리", price: "89,900", discount: "17%", rating: '4.9', ratcut: '304' },
        ];
        const chunkProducts = (arr, size) => {
                const result = [];
                for (let i = 0; i < arr.length; i += size) {
                        result.push(arr.slice(i, i + size));
                }
                return result;
        };

        const productChunks = chunkProducts(products, 4);



        const addOption = () => {
                if (!color || !extraOption) return alert("옵션을 모두 선택하세요!");

                const newOption = {
                        color,
                        extraOption,
                        count
                };

                setSelectedOptions([...selectedOptions, newOption]);

                // 초기화
                setColor("");
                setExtraOption("");
                setCount(1);
        };
        // 상품문의
        const [openQna, setOpenQna] = useState(false);
        const [openAnswer, setOpenAnswer] = useState(null);

        // 백엔드
        function getDataDetail() {
                axios.get(`http://localhost:9991/productDetail/${id}`)

                        .then((response) => {

                                const d = response.data;   // 핵심 수정

                                const colorsArr = d.product?.color
                                        ? d.product.color.split(",")
                                        : [];
                                setColors(colorsArr);

                                // 사이즈 배열 
                                let sizeArr = [];
                                if (d.product?.size) {
                                        try {
                                                sizeArr = JSON.parse(d.product.size);
                                        } catch (e) {
                                                console.log("size JSON parse error:", e);
                                        }
                                }
                                setSizes(sizeArr);

                                console.log("data", d);

                                setData({
                                        id: d.product?.pid,
                                        username: d.product?.company?.name,
                                        name: d.product?.name,
                                        price: d.product?.price,
                                        content: d.product?.context
                                });

                                //  이미지
                                const file = [];
                                d.fileList?.forEach((f) => {
                                        file.push({
                                                color: f.colorName,
                                                url: `http://localhost:9991/upload/${f.filename}.${f.extname}`
                                        });
                                });
                                setFilelist(file);
                        })
                        .catch((error) => {
                                console.log("상품상세보기 에러==>", error)
                        })



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

                axios.post("http://localhost:9991/like/toggle", {
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
                <div className="product-detail-container">

                        {/* 상단 카테고리 경로 */}
                        <div className="breadcrumb">
                                제품 &gt; 수납가구 &gt; 책장
                        </div>

                        <div className="product-wrapper">

                                {/* 왼쪽 이미지 영역 */}
                                <div className="image-section">

                                        {/* 썸네일 리스트 */}
                                        <div className="thumb-list">
                                                {filelist.map((img, index) => (
                                                        <img
                                                                key={index}
                                                                src={img.url}
                                                                className="thumb-img"
                                                                onClick={() => setMainImage(img.url)}
                                                        />
                                                ))}
                                        </div>

                                        {/* 메인 이미지 */}
                                        <img
                                                src={mainImage ? mainImage : "/no-image.png"}
                                                className="main-img"
                                        />

                                </div>

                                {/* 오른쪽 상품 정보 */}
                                <div className="info-section">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <h3>{data?.name}</h3>
                                                <span>
                                                        <img
                                                                src={
                                                                        likedItems.includes(data?.id)
                                                                                ? "/like2.png"
                                                                                : "/like.png"
                                                                }
                                                                alt="like"
                                                                onClick={(e) => {
                                                                        console.log("data:", data);
                                                                        e.preventDefault();
                                                                        handleLike(data.id);
                                                                }}
                                                                style={{
                                                                        width: "30px",
                                                                        height: "30px",
                                                                        cursor: "pointer"
                                                                }}
                                                        />
                                                </span>
                                        </div>

                                        <p className="price">{data?.price}원</p>

                                        <div className="rating">
                                                <span style={{ fontSize: '20px' }}>★★★★★</span>
                                                <span>(168)</span>
                                        </div>

                                        {/* 옵션 선택 */}
                                        <div className="option-box">
                                                <select value={color} onChange={(e) => setColor(e.target.value)}>
                                                        <option value="">색상 선택</option>

                                                        {colors.map((c, idx) => (
                                                                <option key={idx} value={c}>
                                                                        {c}
                                                                </option>
                                                        ))}
                                                </select>

                                                <select value={extraOption} onChange={(e) => setExtraOption(e.target.value)}>
                                                        <option value="">사이즈 선택</option>

                                                        {sizes.map((item, idx) => (
                                                                <option key={idx} value={item.size}>
                                                                        {item.price && item.price !== "0"
                                                                                ? `${item.size} (+${Number(item.price).toLocaleString()}원)`
                                                                                : item.size}
                                                                </option>
                                                        ))}
                                                </select>
                                        </div>
                                        <div className="count-add-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '10px 0' }}>
                                                {/* 수량 선택 */}
                                                <div className="count-box">
                                                        <button className="count-btn" onClick={() => setCount(count > 1 ? count - 1 : 1)}>−</button>
                                                        <span className="count-number">{count}</span>
                                                        <button className="count-btn" onClick={() => setCount(count + 1)}>+</button>


                                                </div>
                                                <button className="add-option-btn" onClick={addOption} >
                                                        옵션 추가
                                                </button>
                                        </div>
                                        {/* 선택한 옵션 보이기 */}
                                        {selectedOptions.length > 0 && (
                                                <div style={{ marginTop: '15px' }}>
                                                        <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>✔ 선택한 옵션</p>

                                                        {selectedOptions.map((opt, index) => (
                                                                <div key={index}
                                                                        style={{
                                                                                padding: '10px',
                                                                                border: '1px solid #ddd',
                                                                                borderRadius: '8px',
                                                                                marginBottom: '8px',
                                                                                display: 'flex',
                                                                                justifyContent: 'space-between',
                                                                                alignItems: 'center'
                                                                        }}
                                                                >
                                                                        <span>{opt.color} / {opt.extraOption} / {opt.count}개</span>

                                                                        <button
                                                                                style={{
                                                                                        background: '#ccc',
                                                                                        border: 'none',
                                                                                        padding: '5px 10px',
                                                                                        cursor: 'pointer',
                                                                                        borderRadius: '4px'
                                                                                }}
                                                                                onClick={() =>
                                                                                        setSelectedOptions(selectedOptions.filter((_, i) => i !== index))
                                                                                }
                                                                        >
                                                                                삭제
                                                                        </button>
                                                                </div>
                                                        ))}

                                                </div>
                                        )}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '10px 0', justifyContent: 'space-between' }}>
                                                <button className="buy-btn">장바구니</button>
                                                <button className="buy-btn">구매하기</button>
                                        </div>
                                </div>
                        </div>

                        {/* 탭 메뉴 */}
                        <div className="tab-menu">
                                <div
                                        onClick={() => setActiveTab("detail")}
                                        className={activeTab === "detail" ? "active" : ""}
                                >
                                        상세페이지
                                </div>

                                <div
                                        onClick={() => setActiveTab("related")}
                                        className={activeTab === "related" ? "active" : ""}
                                >
                                        관련상품
                                </div>

                                <div
                                        onClick={() => setActiveTab("review")}
                                        className={activeTab === "review" ? "active" : ""}
                                >
                                        리뷰(1,500)
                                </div>

                                <div
                                        onClick={() => setActiveTab("qna")}
                                        className={activeTab === "qna" ? "active" : ""}
                                >
                                        문의
                                </div>
                        </div>

                        {/* ⭐ 탭 콘텐츠 영역 */}
                        <div>
                                {activeTab === "detail" && (
                                        <div className="detail-toggle-wrapper" style={{ textAlign: 'center', margin: '40px 0' }}>

                                                <div className={`detail-content ${showDetail ? "open" : ""}`}>
                                                        <div
                                                                className="detail-html"
                                                                dangerouslySetInnerHTML={{ __html: data?.content }}
                                                        />
                                                </div>

                                                {!showDetail && (
                                                        <div className="detail-fade"></div>
                                                )}

                                                <button
                                                        className="detail-toggle-btn"
                                                        onClick={() => setShowDetail(!showDetail)}
                                                >
                                                        {showDetail ? "상세정보 접기 ▲" : "상세정보 펼치기 ▼"}
                                                </button>
                                        </div>
                                )}

                                {activeTab === "related" && (
                                        <div style={{ padding: "40px 0", textAlign: "center" }}>
                                                <Carousel
                                                        indicators={false} // 하단 점 숨기기
                                                        interval={null}    // 자동 재생 끄기 (화살표로만 조작)                                                       
                                                        prevIcon={
                                                                <span
                                                                        className="carousel-control-prev-icon"
                                                                        style={{
                                                                                filter: "brightness(0)",
                                                                                width: "40px",
                                                                                height: "40px",
                                                                        }}
                                                                />
                                                        }
                                                        nextIcon={
                                                                <span
                                                                        className="carousel-control-next-icon"
                                                                        style={{
                                                                                filter: "brightness(0)",
                                                                                width: "40px",
                                                                                height: "40px",
                                                                        }}
                                                                />
                                                        }
                                                >

                                                        {productChunks.map((chunk, index) => (
                                                                <Carousel.Item key={index}>
                                                                        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', padding: '0 50px', marginTop: '100px', marginBottom: '100px' }}>
                                                                                {chunk.map((item) => (
                                                                                        <Link to="" className="product-link" key={item.id} style={{ textDecoration: 'none', color: 'inherit', width: '25%' }}>
                                                                                                <div className="product-card">
                                                                                                        <div className="product-img">
                                                                                                                <img src={item.img} alt={item.title} style={{ width: '100%' }} />
                                                                                                        </div>
                                                                                                        <div style={{ textAlign: 'left', marginTop: '10px' }}>
                                                                                                                <div style={{ color: "gray", fontSize: '0.8em' }}>한샘</div>
                                                                                                                <div className="title" style={{
                                                                                                                        overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box',
                                                                                                                        WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, whiteSpace: 'normal',
                                                                                                                        height: '2.8em', fontWeight: '500'
                                                                                                                }}>{item.title}</div>
                                                                                                                <div style={{ color: 'gray', textDecoration: 'line-through', fontSize: '0.8em' }}>
                                                                                                                        {item.price}원
                                                                                                                </div>
                                                                                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                                                                        <span style={{ color: 'red', marginRight: '5px', fontWeight: 'bold' }}>{item.discount}</span>
                                                                                                                        <span style={{ fontWeight: 'bold' }}>{item.price}원</span>
                                                                                                                </div>
                                                                                                                <div style={{ fontSize: '0.8em', color: 'gray' }}>
                                                                                                                        <span>★</span>
                                                                                                                        <span>{item.rating}</span>
                                                                                                                        <span style={{ color: 'gray' }}>({item.ratcut})</span>
                                                                                                                </div>
                                                                                                        </div>
                                                                                                </div>
                                                                                        </Link>
                                                                                ))}
                                                                        </div>
                                                                </Carousel.Item>
                                                        ))}
                                                </Carousel>
                                        </div>
                                )}

                                {activeTab === "review" && (
                                        <div style={{ padding: "40px 0" }}>

                                                {/* 별점 */}
                                                <div style={{ textAlign: 'center', margin: '50px 0' }}>
                                                        <p style={{ fontWeight: 'bold', fontSize: '20px' }}>별점</p>
                                                        <h1 style={{ fontSize: '50px' }}>4.5</h1>
                                                        <span style={{ fontSize: '25px' }}>★★★★★</span>
                                                </div>

                                                {/* 정렬 버튼 */}
                                                <div className="sort-btns">
                                                        <button
                                                                onClick={() => setReviewFilter("all")}
                                                                className={reviewFilter === "all" ? "active" : ""}
                                                        >
                                                                전체(1,500건)
                                                        </button>

                                                        <button
                                                                onClick={() => setReviewFilter("photo")}
                                                                className={reviewFilter === "photo" ? "active" : ""}
                                                        >
                                                                사진(620건)
                                                        </button>
                                                </div>

                                                {/* 사진 영역 */}
                                                <div
                                                        className="review-imageBox"
                                                        style={{
                                                                overflowX: reviewFilter === "photo" ? "visible" : "auto",
                                                                flexWrap: reviewFilter === "photo" ? "wrap" : "nowrap",
                                                                height: reviewFilter === "photo" ? "auto" : "250px"
                                                        }}
                                                >
                                                        <img src="public/review1.jpg" onClick={() => setZoomImage("public/review1.jpg")} />
                                                        <img src="public/review2.jpg" onClick={() => setZoomImage("public/review2.jpg")} />
                                                        <img src="public/review3.jpg" onClick={() => setZoomImage("public/review3.jpg")} />
                                                        <img src="public/review4.jpg" onClick={() => setZoomImage("public/review4.jpg")} />
                                                        <img src="public/review5.jpg" onClick={() => setZoomImage("public/review5.jpg")} />
                                                </div>

                                                {/* 리뷰글 */}
                                                {reviewFilter === "all" && (
                                                        <div style={{ marginTop: "40px" }}>
                                                                <div style={{
                                                                        borderBottom: "1px solid #ccc",
                                                                        paddingBottom: "20px",
                                                                        marginBottom: "20px"
                                                                }}>
                                                                        <p style={{ color: '#7a7a7a', margin: '0px' }}>상품옵션 : 내추럴,기본옵션</p>
                                                                        <div>★★★★★</div>
                                                                        <p style={{ margin: '0' }}>이*</p>
                                                                        <p>생각보다 튼튼하고 깔끔한 느낌이에요! 추천드려요 ㅎㅎ</p>
                                                                        <p style={{ color: '#7a7a7a', margin: '0px' }}>2025.08.11 11:50</p>
                                                                </div>

                                                                <div style={{
                                                                        borderBottom: "1px solid #ccc",
                                                                        paddingBottom: "20px",
                                                                        marginBottom: "20px"
                                                                }}>
                                                                        <p style={{ color: '#7a7a7a', margin: '0px' }}>상품옵션 : 내추럴,기본옵션</p>
                                                                        <div>★★★★☆</div>
                                                                        <p style={{ margin: '0' }}>박*지</p>
                                                                        <p>생각보다 작은 편이에요. 그래도 만족하고 있어요.</p>
                                                                        <p style={{ color: '#7a7a7a', margin: '0px' }}>2025.08.11 11:50</p>
                                                                </div>
                                                        </div>
                                                )}

                                        </div>
                                )}

                                {/*  확대 이미지 모달 (어느 모드에서도 보이도록 바깥에!) */}
                                {zoomImage && (
                                        <div className="zoom-modal">
                                                <div className="zoom-content">
                                                        <button className="close-btn" onClick={() => setZoomImage(null)}>✕</button>
                                                        <img src={zoomImage} className="zoom-img" />
                                                </div>
                                        </div>
                                )}

                                {activeTab === "qna" && (
                                        <div style={{ padding: "40px 0", textAlign: "center", minHeight: '700px' }}>
                                                <div style={{ textAlign: 'left', margin: '20px 0' }}>
                                                        <h3>문의사항</h3>
                                                        <p style={{ color: '#686868' }}>
                                                                * 상품에 관한 문의가 아닌 배송 / 결제 / 교환 / 반품에 대한 문의는 서비스지원 &gt; 1:1문의 를 이용해 주시기 바랍니다.<br />
                                                                *  본인 외 타인이 볼 수 있는 공간으로 개인정보 유출의 위험이 있으므로 개인정보 보호로 인해 개인정보가 기재된 게시글은 통보 없이 삭제될 수 있습니다.
                                                        </p>
                                                        <div style={{ float: 'right', margin: '20px 10px' }}>
                                                                <button id="p-qnaBtn" style={{ margin: '10px', padding: '10px' }}
                                                                        onClick={() => setOpenQna(true)}>
                                                                        상품문의
                                                                </button>
                                                        </div>
                                                </div>

                                                <table style={{ width: '100%', borderTop: '2px solid #000', fontSize: '15px', borderCollapse: 'collapse' }}>
                                                        <thead>
                                                                <tr style={{ borderBottom: '1px solid #ccc', height: '50px' }}>
                                                                        <th style={{ width: '80px' }}>번호</th>
                                                                        <th style={{ textAlign: 'left', paddingLeft: '60px' }}>제목</th>
                                                                        <th style={{ width: '120px' }}>작성자</th>
                                                                        <th style={{ width: '120px' }}>작성일</th>
                                                                </tr>
                                                        </thead>

                                                        <tbody>

                                                                {/* 첫 번째 문의 */}
                                                                <>
                                                                        <tr
                                                                                style={{
                                                                                        borderBottom: '1px solid #eee',
                                                                                        height: '48px',
                                                                                        cursor: 'pointer'
                                                                                }}
                                                                                onClick={() =>
                                                                                        setOpenAnswer(openAnswer === 1 ? null : 1)
                                                                                }
                                                                        >
                                                                                <td>12</td>

                                                                                <td
                                                                                        style={{
                                                                                                textAlign: 'left',
                                                                                                paddingLeft: '60px',
                                                                                                fontWeight: 'bold'
                                                                                        }}
                                                                                >
                                                                                        상품문의 [답변완료]
                                                                                </td>

                                                                                <td>이*</td>
                                                                                <td>2025.04.13</td>
                                                                        </tr>

                                                                        {openAnswer === 1 && (
                                                                                <tr>
                                                                                        <td
                                                                                                colSpan="4"
                                                                                                style={{
                                                                                                        background: '#f8f8f8',
                                                                                                        textAlign: 'left',
                                                                                                        padding: '25px 60px',
                                                                                                        lineHeight: '1.8'
                                                                                                }}
                                                                                        >
                                                                                                <div style={{ marginBottom: '20px' }}>
                                                                                                        <strong>Q.</strong>
                                                                                                        <p style={{ marginTop: '10px' }}>
                                                                                                                상품 사이즈가 어떻게 되나요?
                                                                                                        </p>
                                                                                                </div>

                                                                                                <div>
                                                                                                        <strong>A.</strong>
                                                                                                        <p style={{ marginTop: '10px' }}>
                                                                                                                안녕하세요 고객님 🙂
                                                                                                                <br />
                                                                                                                해당 상품의 사이즈는
                                                                                                                1200 x 400 x 1800(mm) 입니다.
                                                                                                                <br />
                                                                                                                감사합니다.
                                                                                                        </p>
                                                                                                </div>
                                                                                        </td>
                                                                                </tr>
                                                                        )}
                                                                </>

                                                                {/* 두 번째 문의 */}
                                                                <>
                                                                        <tr
                                                                                style={{
                                                                                        borderBottom: '1px solid #eee',
                                                                                        height: '48px',
                                                                                        cursor: 'pointer'
                                                                                }}
                                                                                onClick={() =>
                                                                                        setOpenAnswer(openAnswer === 2 ? null : 2)
                                                                                }
                                                                        >
                                                                                <td>11</td>

                                                                                <td
                                                                                        style={{
                                                                                                textAlign: 'left',
                                                                                                paddingLeft: '60px',
                                                                                                fontWeight: 'bold'
                                                                                        }}
                                                                                >
                                                                                        어떤 재질인지 궁금합니다. [답변완료]
                                                                                </td>

                                                                                <td>김*철</td>
                                                                                <td>2025.04.10</td>
                                                                        </tr>

                                                                        {openAnswer === 2 && (
                                                                                <tr>
                                                                                        <td
                                                                                                colSpan="4"
                                                                                                style={{
                                                                                                        background: '#f8f8f8',
                                                                                                        textAlign: 'left',
                                                                                                        padding: '25px 60px',
                                                                                                        lineHeight: '1.8'
                                                                                                }}
                                                                                        >
                                                                                                <div style={{ marginBottom: '20px' }}>
                                                                                                        <strong>Q.</strong>
                                                                                                        <p style={{ marginTop: '10px' }}>
                                                                                                                어떤 소재로 만들어졌나요?
                                                                                                        </p>
                                                                                                </div>

                                                                                                <div>
                                                                                                        <strong>A.</strong>
                                                                                                        <p style={{ marginTop: '10px' }}>
                                                                                                                MDF + PB 소재로 제작되었습니다.
                                                                                                                <br />
                                                                                                                상세페이지 하단에서도 확인 가능합니다 🙂
                                                                                                        </p>
                                                                                                </div>
                                                                                        </td>
                                                                                </tr>
                                                                        )}
                                                                </>

                                                        </tbody>
                                                </table>
                                        </div>
                                )}

                                {openQna && (
                                        <div
                                                style={{
                                                        position: "fixed",
                                                        top: 0,
                                                        left: 0,
                                                        width: "100vw",
                                                        height: "100vh",
                                                        background: "rgba(0,0,0,0.5)",
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        zIndex: 9999
                                                }}
                                                onClick={() => setOpenQna(false)}  // 바깥 클릭 → 닫힘
                                        >
                                                <div
                                                        style={{
                                                                background: "#fff",
                                                                width: "600px",
                                                                padding: "30px",
                                                                borderRadius: "8px",
                                                                position: "relative"
                                                        }}
                                                        onClick={(e) => e.stopPropagation()} // 내부 클릭은 유지
                                                >
                                                        {/* 닫기(X) 버튼 */}
                                                        <button
                                                                onClick={() => setOpenQna(false)}
                                                                style={{
                                                                        position: "absolute",
                                                                        top: "20px",
                                                                        right: "20px",
                                                                        background: "none",
                                                                        border: "none",
                                                                        fontSize: "24px",
                                                                        cursor: "pointer"
                                                                }}
                                                        >
                                                                ✕
                                                        </button>

                                                        {/* 타이틀 */}
                                                        <h2 style={{ marginBottom: "20px" }}>상품 문의하기</h2>

                                                        {/* 문의 유형 */}
                                                        <div style={{ marginBottom: "20px" }}>
                                                                <label>문의 유형</label>
                                                                <select style={{ width: "100%", padding: "10px", marginTop: "5px" }}>
                                                                        <option>문의 유형 선택</option>
                                                                        <option>상품 문의</option>
                                                                </select>
                                                        </div>

                                                        {/* 제목 */}
                                                        <div style={{ marginBottom: "20px" }}>
                                                                <label>제목</label>
                                                                <input
                                                                        type="text"
                                                                        placeholder="제목을 입력해주세요."
                                                                        style={{ width: "100%", padding: "10px", marginTop: "5px" }}
                                                                />
                                                        </div>

                                                        {/* 내용 */}
                                                        <div style={{ marginBottom: "20px" }}>
                                                                <label>내용</label>
                                                                <textarea
                                                                        placeholder="내용을 입력해주세요."
                                                                        style={{ width: "100%", height: "150px", padding: "10px", marginTop: "5px" }}
                                                                />
                                                        </div>

                                                        {/* 하단 버튼 */}
                                                        <button
                                                                style={{
                                                                        width: "100%",
                                                                        padding: "12px",
                                                                        background: "#333",
                                                                        color: "#fff",
                                                                        border: "none",
                                                                        borderRadius: "5px",
                                                                        fontSize: "16px",
                                                                        cursor: "pointer"
                                                                }}
                                                        >
                                                                문의하기
                                                        </button>
                                                </div>
                                        </div>
                                )}
                        </div>

                </div>
        );
}

export default ProductDetail;