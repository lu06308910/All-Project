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
        const [openReviewModal, setOpenReviewModal] = useState(false);



        // 사이즈 옵션
        const [sizes, setSizes] = useState([]);
        const selectedSize = sizes.find(s => s.size === extraOption);
        const sizeExtraPrice = Number(selectedSize?.price || 0);

        // 메인 상품 이미지 상태
        const [mainImage, setMainImage] = useState("");

        const loginUserId = sessionStorage.getItem("loginUserId");

        // 리뷰 
        const [reviewFilter, setReviewFilter] = useState("all"); // 리뷰글보기 , 사진만 보기 버튼
        const [zoomImage, setZoomImage] = useState(null); // 리뷰 확대 사진

        const [content, setContent] = useState("");
        const [file, setFile] = useState(null);

        const [reviews, setReviews] = useState([]); // 백엔드 받아오기
        const [star, setStar] = useState(0);

        // 문의
        const [qnaTitle, setQnaTitle] = useState("");
        const [qnaType, setQnaType] = useState("");
        const [questions, setQuestions] = useState([]); // 백엔드 받아오기

        useEffect(() => {
                if (filelist.length > 0) {
                        const first = filelist[0];
                        setMainImage(first.url);
                }
        }, [filelist]);

        // 좋아요
        useEffect(() => {
                const mId = sessionStorage.getItem("mId");
                if (!mId) return;

                // 컨트롤러의 @GetMapping("/list/{memberId}") 경로를 정확히 찌릅니다.
                axios.get(`http://localhost:9991/like/list/${mId}`)
                        .then(res => {
                                console.log("DB에서 가져온 내 찜 목록(상품ID배열):", res.data);
                                // 백엔드가 [42, 43, 44] 같은 숫자 배열을 주므로 그대로 저장합니다.
                                setLikedItems(res.data || []);
                        })
                        .catch(err => console.log("찜 목록 로딩 실패:", err));
        }, []);

        useEffect(() => {
                if (!color || !filelist) return;

                // 선택된 색상의 이미지만 필터링
                const filtered = filelist.filter(f => f.colorName === color);

                if (filtered.length > 0) {
                        setMainImage(filtered[0].url);
                }

        }, [color, filelist]);
        // 상품정보
        useEffect(() => {

                getDataDetail()

        }, [])
        // 리뷰불러오기
        useEffect(() => {
                if (data?.id) {
                        getReviews();
                }
                console.log("reviews", reviews);
        }, [data?.id]);

        // 문의불러오기
        useEffect(() => {
                if (data?.id) getQuestions();
        }, [data?.id]);

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
                if (!color || !extraOption) {
                        alert("옵션을 모두 선택하세요!");
                        return;
                }

                const selectedSize = sizes.find(s => s.size === extraOption);
                const sizeExtraPrice = Number(selectedSize?.price || 0);

                const basePrice = Number(data.price || 0);

                const finalPrice = basePrice + sizeExtraPrice;

                const newOption = {
                        productId: data.id,
                        name: data.name,

                        color,
                        size: extraOption,
                        count,

                        basePrice,
                        sizeExtraPrice,
                        finalPrice   // ⭐ 핵심
                };

                setSelectedOptions(prev => [...prev, newOption]);

                // 초기화
                setColor("");
                setExtraOption("");
                setCount(1);
        };

        // 상품문의
        const [openQna, setOpenQna] = useState(false);
        const [openAnswer, setOpenAnswer] = useState(null);
        const [questionText, setQuestionText] = useState("");



        // 상품 정보 백엔드
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
        // 좋아요 백엔드 - 대호수정
        function handleLike(productId) {
                const logId = sessionStorage.getItem("logId") || sessionStorage.getItem("loginUserId");
                const mId = sessionStorage.getItem("mId");

                if (!mId || !productId) {
                        alert("로그인 후 이용 가능합니다.");
                        return;
                }

                // 컨트롤러의 @PostMapping("/toggle")에 맞춰서 데이터 전송
                axios.post("http://localhost:9991/like/toggle", {
                        userid: logId,
                        memberId: Number(mId),
                        productId: Number(productId),
                        pid: Number(productId) // 백엔드에서 pid로 받든 productId로 받든 상관없게 둘 다 넣음
                })
                        .then(res => {
                                // 백엔드가 새로 보내주는 res.data.liked (true/false) 값을 확인
                                const { liked } = res.data;
                                console.log("서버 토글 결과 (liked 상태):", liked);

                                setLikedItems(prev => {
                                        // 안전하게 모든 요소를 숫자로 변환해서 처리
                                        const cleanList = prev.map(id => Number(id));

                                        if (liked) {
                                                // 찜 추가 시 배열에 추가
                                                return [...cleanList, Number(productId)];
                                        } else {
                                                // 찜 해제 시 배열에서 삭제
                                                return cleanList.filter(id => id !== Number(productId));
                                        }
                                });
                        })
                        .catch(err => console.log("찜하기 요청 에러:", err));
        }

        // 장바구니 담기 버튼 클릭시 선택한 옵션값 보내기
        const addToCart = () => {
                const mId = Number(sessionStorage.getItem("mId"));
                console.log("mId:", mId);
                console.log("productId:", data.id);

                if (selectedOptions.length === 0) {
                        return alert("추가한 옵션이 없습니다.");
                }

                selectedOptions.forEach(opt => {

                        const totalPrice =
                                Number(opt.basePrice) +
                                Number(opt.sizeExtraPrice || 0);

                        const payload = {
                                mId: Number(mId),
                                pId: Number(data.id),
                                discount: 0,
                                count: opt.count,
                                color: opt.color,
                                size: opt.size || opt.extraOption,
                                price: opt.finalPrice // 총금액(사이즈별 추가금액도 합산)
                        };

                        axios.post("http://localhost:9991/cart/add", payload)
                                .catch(err => console.log(err));
                });

                alert("장바구니에 담겼습니다!");
        };


        // 리뷰 작성
        const averageStar =
                reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.star, 0) / reviews.length).toFixed(1) : 0; // 평균별점 계산
        const renderStar = (score) => {
                const full = "★".repeat(Math.floor(score));
                const empty = "☆".repeat(5 - Math.floor(score));
                return full + empty;
        };

        function handleReviewSubmit() {
                const mId = sessionStorage.getItem("mId");
                const productId = data?.id;

                const formData = new FormData();

                console.log("mId:", mId);
                console.log("productId:", productId);
                console.log("star:", star);
                console.log("content:", content);

                if (!mId || !productId || !star || !content) {
                        console.log("값 없음", mId, productId, star, content);
                        return;
                }

                formData.append("mId", mId);
                formData.append("pId", productId);
                formData.append("star", star);
                formData.append("context", content);

                if (file) {
                        formData.append("file", file);
                }

                axios.post("http://localhost:9991/review/write", formData)
                        .then(res => {
                                console.log("리뷰 작성 성공:", res.data);

                                setOpenReviewModal(false); // 성공하면 모달 닫기
                        })
                        .catch(err => console.log("리뷰 에러:", err));
        }
        function getReviews() {
                axios.get(`http://localhost:9991/review/list/${data?.id}`)
                        .then(res => {
                                setReviews(res.data);

                        })
                        .catch(err => console.log("리뷰 불러오기 에러", err));
        }

        // 문의 불러오기
        function getQuestions() {
                axios.get(`http://localhost:9991/question/list/${data.id}`)
                        .then(res => {
                                console.log(" Q&A 서버 데이터 전체 확인");
                                console.log(res.data);

                                setQuestions(res.data);
                        })
                        .catch(err => console.log("문의 리스트 에러", err));
        }


        // 문의 작성
        const handleQuestionSubmit = () => {
                if (!qnaTitle.trim() || !questionText.trim()) {
                        alert("제목과 내용을 모두 입력해주세요.");
                        return;
                }

                const formData = new FormData();
                formData.append("mId", sessionStorage.getItem("mId"));
                formData.append("pId", data.id);
                formData.append("cId", 1);
                formData.append("subject", qnaTitle);
                formData.append("context", questionText);

                axios.post("http://localhost:9991/question/write", formData)
                        .then(() => {
                                alert("문의가 등록되었습니다.");
                                setQuestionText("");
                                setQnaTitle("");
                                getQuestions();

                                setOpenQna(false);
                        })
                        .catch(err => console.log("문의 작성 에러", err));
        };


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
                                                        <img // 대호수정
                                                                src={likedItems.map(id => Number(id)).includes(Number(data?.id)) ? "/like2.png" : "/like.png"}
                                                                alt="like"
                                                                onClick={(e) => {
                                                                        e.preventDefault();
                                                                        handleLike(data.id);
                                                                }}
                                                                style={{ width: "30px", height: "30px", cursor: "pointer" }}
                                                        />
                                                </span>
                                        </div>

                                        <p className="price">{data?.price}원</p>

                                        <div className="rating">
                                                <span style={{ fontSize: '20px' }}>{renderStar(averageStar)}</span>
                                                <span>({reviews.length})</span>
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
                                                        <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>
                                                                ✔ 선택한 옵션
                                                        </p>

                                                        {selectedOptions.map((opt, index) => {

                                                                const price =
                                                                        (Number(opt.basePrice || 0) + Number(opt.sizeExtraPrice || 0)) *
                                                                        Number(opt.count || 1);

                                                                return (
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
                                                                                <span>
                                                                                        {opt.color} / {opt.size} / {opt.count}개
                                                                                        {" "}
                                                                                        ( +{Number(opt.sizeExtraPrice || 0).toLocaleString()}원 )
                                                                                </span>

                                                                                <span>
                                                                                        {price.toLocaleString()}원
                                                                                </span>

                                                                                <button
                                                                                        style={{
                                                                                                background: '#ccc',
                                                                                                border: 'none',
                                                                                                padding: '5px 10px',
                                                                                                cursor: 'pointer',
                                                                                                borderRadius: '4px'
                                                                                        }}
                                                                                        onClick={() =>
                                                                                                setSelectedOptions(
                                                                                                        selectedOptions.filter((_, i) => i !== index)
                                                                                                )
                                                                                        }
                                                                                >
                                                                                        삭제
                                                                                </button>
                                                                        </div>
                                                                );
                                                        })}

                                                        {/* 총합계 */}
                                                        <div style={{
                                                                marginTop: '15px',
                                                                padding: '10px',
                                                                borderTop: '2px solid #000',
                                                                fontWeight: 'bold',
                                                                textAlign: 'right'
                                                        }}>
                                                                총 합계: {" "}
                                                                {selectedOptions.reduce((acc, opt) => {
                                                                        const price =
                                                                                (Number(opt.basePrice || 0) + Number(opt.sizeExtraPrice || 0)) *
                                                                                Number(opt.count || 1);
                                                                        return acc + price;
                                                                }, 0).toLocaleString()}원
                                                        </div>
                                                </div>
                                        )}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '10px 0', justifyContent: 'space-between' }}>
                                                <button className="buy-btn" onClick={addToCart}>장바구니</button>
                                                <button className="buy-btn">구매하기</button>
                                        </div>
                                </div>
                        </div>

                        {/* 탭 메뉴 */}
                        <div className="tab-menu">
                                <div onClick={() => setActiveTab("detail")} className={activeTab === "detail" ? "active" : ""} >
                                        상세페이지
                                </div>

                                <div onClick={() => setActiveTab("related")} className={activeTab === "related" ? "active" : ""}>
                                        관련상품
                                </div>

                                <div onClick={() => setActiveTab("review")} className={activeTab === "review" ? "active" : ""}>
                                        리뷰({reviews.length})
                                </div>

                                <div onClick={() => setActiveTab("qna")} className={activeTab === "qna" ? "active" : ""} >
                                        문의({questions.length})
                                </div>
                        </div>

                        {/* ⭐ 탭 콘텐츠 영역 */}
                        <div>
                                {activeTab === "detail" && (
                                        <div className="detail-toggle-wrapper" style={{ textAlign: 'center', margin: '40px 0' }}>
                                                <div className={`detail-content ${showDetail ? "open" : ""}`}>
                                                        <div className="detail-html" dangerouslySetInnerHTML={{ __html: data?.content }} />
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

                                                        {/* 평균 별점 숫자 */}
                                                        <h1 style={{ fontSize: '50px' }}>{averageStar}</h1>

                                                        {/* 별 모양 (그래픽) */}
                                                        <span style={{ fontSize: '25px' }}>
                                                                {renderStar(averageStar)}
                                                        </span>

                                                        {/* 리뷰 개수 표시 (선택 사항) */}
                                                        <p style={{ color: '#777', marginTop: '10px' }}>
                                                                리뷰 {reviews.length}개
                                                        </p>
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
                                                        {reviews
                                                                .filter((r) => r.imgUrl) // imgUrl이 존재하는 리뷰만
                                                                .map((r) => (
                                                                        <img
                                                                                key={r.id}
                                                                                src={`http://localhost:9991/upload/review/${r.imgUrl}`} // 서버 주소 + 이미지 경로
                                                                                onClick={() => setZoomImage(`http://localhost:9991/upload/review/${r.imgUrl}`)}
                                                                                style={{
                                                                                        width: "200px",
                                                                                        height: "200px",
                                                                                        objectFit: "cover",
                                                                                        cursor: "pointer",
                                                                                        marginRight: "10px"
                                                                                }}
                                                                        />
                                                                ))}
                                                </div>

                                                {/* 리뷰글 */}
                                                {reviewFilter === "all" && (
                                                        <div style={{ marginTop: "40px" }}>
                                                                {reviews.map((r) => (

                                                                        <div
                                                                                key={`${r.id}-${r.writedate}`}
                                                                                style={{
                                                                                        borderBottom: "1px solid #ccc",
                                                                                        paddingBottom: "20px",
                                                                                        marginBottom: "20px"
                                                                                }}
                                                                        >
                                                                                <p style={{ color: '#7a7a7a', margin: '0px' }}>
                                                                                        상품옵션 : {r.option}
                                                                                </p>

                                                                                <div>
                                                                                        {"★".repeat(r.star)}
                                                                                        {"☆".repeat(5 - r.star)}
                                                                                </div>
                                                                                <p style={{ margin: '0' }}>{r.member?.username}</p>


                                                                                <p style={{ margin: '0' }}>{r.writer}</p>

                                                                                <p>{r.context}</p>

                                                                                <p style={{ color: '#7a7a7a', margin: '0px' }}>
                                                                                        {r.writedate}
                                                                                </p>

                                                                        </div>
                                                                ))}
                                                                {/*  리뷰 작성 버튼 */}
                                                                <div style={{ textAlign: "center", marginTop: "30px" }}>
                                                                        <button
                                                                                onClick={() => setOpenReviewModal(true)}
                                                                                style={{
                                                                                        padding: "10px 20px",
                                                                                        background: "#000",
                                                                                        color: "#fff",
                                                                                        border: "none",
                                                                                        borderRadius: "6px",
                                                                                        cursor: "pointer"
                                                                                }}
                                                                        >
                                                                                리뷰 작성하기
                                                                        </button>
                                                                </div>

                                                                {/* 리뷰작성 모달 */}
                                                                {openReviewModal && (
                                                                        <div
                                                                                style={{
                                                                                        position: "fixed",
                                                                                        top: 0,
                                                                                        left: 0,
                                                                                        width: "100%",
                                                                                        height: "100%",
                                                                                        backgroundColor: "rgba(0,0,0,0.5)",
                                                                                        display: "flex",
                                                                                        justifyContent: "center",
                                                                                        alignItems: "center",
                                                                                        zIndex: 9999
                                                                                }}
                                                                                onClick={() => setOpenReviewModal(false)}
                                                                        >
                                                                                <div
                                                                                        onClick={(e) => e.stopPropagation()}
                                                                                        style={{
                                                                                                width: "520px",
                                                                                                background: "#fff",
                                                                                                borderRadius: "12px",
                                                                                                padding: "25px",
                                                                                                boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
                                                                                        }}
                                                                                >

                                                                                        {/* 헤더 */}
                                                                                        <div style={{
                                                                                                display: "flex",
                                                                                                justifyContent: "space-between",
                                                                                                alignItems: "center",
                                                                                                marginBottom: "20px"
                                                                                        }}>
                                                                                                <h2 style={{ margin: 0, fontSize: "20px" }}>
                                                                                                        리뷰 작성하기
                                                                                                </h2>

                                                                                                <button
                                                                                                        onClick={() => setOpenReviewModal(false)}
                                                                                                        style={{
                                                                                                                border: "none",
                                                                                                                background: "transparent",
                                                                                                                fontSize: "22px",
                                                                                                                cursor: "pointer"
                                                                                                        }}
                                                                                                >
                                                                                                        ✕
                                                                                                </button>
                                                                                        </div>

                                                                                        {/* 별점 */}
                                                                                        <div style={{ marginBottom: "15px" }}>
                                                                                                <label style={{ fontSize: "14px", fontWeight: "bold" }}>
                                                                                                        별점
                                                                                                </label>
                                                                                                <input
                                                                                                        type="number"
                                                                                                        min="1"
                                                                                                        max="5"
                                                                                                        placeholder="1 ~ 5"
                                                                                                        style={{
                                                                                                                width: "100%",
                                                                                                                marginTop: "6px",
                                                                                                                padding: "10px",
                                                                                                                border: "1px solid #ddd",
                                                                                                                borderRadius: "6px"
                                                                                                        }}
                                                                                                        onChange={(e) => setStar(e.target.value)}
                                                                                                />
                                                                                        </div>

                                                                                        {/* 내용 */}
                                                                                        <div style={{ marginBottom: "15px" }}>
                                                                                                <label style={{ fontSize: "14px", fontWeight: "bold" }}>
                                                                                                        리뷰 내용
                                                                                                </label>
                                                                                                <textarea
                                                                                                        placeholder="리뷰를 입력해주세요."
                                                                                                        style={{
                                                                                                                width: "100%",
                                                                                                                height: "120px",
                                                                                                                marginTop: "6px",
                                                                                                                padding: "10px",
                                                                                                                border: "1px solid #ddd",
                                                                                                                borderRadius: "6px",
                                                                                                                resize: "none"
                                                                                                        }}
                                                                                                        onChange={(e) => setContent(e.target.value)}
                                                                                                />
                                                                                        </div>

                                                                                        {/* 이미지 */}
                                                                                        <div style={{ marginBottom: "20px" }}>
                                                                                                <label style={{ fontSize: "14px", fontWeight: "bold" }}>
                                                                                                        사진
                                                                                                </label>
                                                                                                <input
                                                                                                        type="file"
                                                                                                        style={{
                                                                                                                width: "100%",
                                                                                                                marginTop: "6px"
                                                                                                        }}
                                                                                                        onChange={(e) => setFile(e.target.files[0])}
                                                                                                />
                                                                                        </div>

                                                                                        {/* 버튼 */}
                                                                                        <button
                                                                                                style={{
                                                                                                        width: "100%",
                                                                                                        padding: "12px",
                                                                                                        background: "#333",
                                                                                                        color: "white",
                                                                                                        border: "none",
                                                                                                        borderRadius: "8px",
                                                                                                        cursor: "pointer",
                                                                                                        fontWeight: "bold"
                                                                                                }}
                                                                                                onClick={handleReviewSubmit}
                                                                                        >
                                                                                                리뷰 등록
                                                                                        </button>
                                                                                </div>
                                                                        </div>
                                                                )}
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

                                {/* 문의하기 - 대호수정 */}
                                {activeTab === "qna" && (
                                        <div style={{ padding: "40px 0", textAlign: "center", minHeight: '700px' }}>
                                                <div style={{ textAlign: 'left', margin: '20px 0' }}>
                                                        <h3>문의사항</h3>
                                                        <p style={{ color: '#686868' }}>
                                                                * 상품에 관한 문의가 아닌 배송 / 결제 / 교환 / 반품에 대한 문의는 서비스지원 &gt; 1:1문의 를 이용해 주시기 바랍니다.<br />
                                                                * 본인 외 타인이 볼 수 있는 공간으로 개인정보 유출의 위험이 있습니다.
                                                        </p>
                                                        <div style={{ float: 'right', margin: '20px 10px' }}>
                                                                <button id="p-qnaBtn" style={{ margin: '10px', padding: '10px' }} onClick={(e) => {
                                                                        e.preventDefault();
                                                                        console.log("상품문의 버튼 클릭됨! openQna 변경 전:", openQna);
                                                                        setOpenQna(true);
                                                                }}>
                                                                        상품문의
                                                                </button>
                                                        </div>
                                                </div>

                                                <table className="p-qnaTable" style={{ width: '100%', borderTop: '2px solid #333', fontSize: '15px', borderCollapse: 'collapse' }}>
                                                        <thead>
                                                                <tr style={{ borderBottom: '1px solid #ccc', height: '50px', background: '#f9f9f9' }}>
                                                                        <th style={{ width: '80px' }}>번호</th>
                                                                        <th style={{ textAlign: 'left', paddingLeft: '20px' }}>제목 및 내용</th>
                                                                        <th style={{ width: '120px' }}>작성자</th>
                                                                        <th style={{ width: '120px' }}>작성일</th>
                                                                </tr>
                                                        </thead>
                                                        <tbody>
                                                                {questions.length === 0 ? (
                                                                        <tr>
                                                                                <td colSpan="4" style={{ textAlign: "center", padding: "30px 0", color: "#888" }}>
                                                                                        등록된 문의가 없습니다.
                                                                                </td>
                                                                        </tr>
                                                                ) : (
                                                                        questions.map((q, index) => {
                                                                                const currentId = q.id || index;
                                                                                const isOpened = openAnswer === currentId;

                                                                                const rawDate = q.writedate || q.writeday || "";
                                                                                const formattedDate = rawDate.length >= 10 ? rawDate.substring(0, 10) : rawDate;

                                                                                const rawReplyDate = q.replydate || "";
                                                                                const formattedReplyDate = rawReplyDate.length >= 10 ? rawReplyDate.substring(0, 10) : rawReplyDate;

                                                                                return (
                                                                                        <React.Fragment key={currentId}>
                                                                                                {/* 1. 질문 행 */}
                                                                                                <tr
                                                                                                        style={{ borderBottom: "1px solid #eee", height: "65px", cursor: "pointer" }}
                                                                                                        onClick={() => setOpenAnswer(isOpened ? null : currentId)}
                                                                                                >
                                                                                                        <td>{questions.length - index}</td>
                                                                                                        <td style={{ textAlign: "left", paddingLeft: "20px" }}>
                                                                                                                <span style={{ fontWeight: "500", marginRight: '10px', color: '#333' }}>
                                                                                                                        {q.subject}
                                                                                                                </span>
                                                                                                                <span style={{
                                                                                                                        color: q.reply ? '#1890ff' : '#f5222d',
                                                                                                                        fontWeight: 'bold',
                                                                                                                        fontSize: '13px'
                                                                                                                }}>
                                                                                                                        {q.reply ? '[답변완료]' : '[답변대기]'}
                                                                                                                </span>
                                                                                                        </td>
                                                                                                        <td>{q.member?.userid || q.userid}</td>
                                                                                                        <td>{formattedDate}</td>
                                                                                                </tr>

                                                                                                {/* 질문 클릭 시 열리는 상세 내용 및 라인 구분 답변 구역 */}
                                                                                                {isOpened && (
                                                                                                        <tr style={{ backgroundColor: "#fafafa", borderBottom: "1px solid #eee" }}>
                                                                                                                <td></td>
                                                                                                                <td colSpan="3" style={{ textAlign: "left", padding: "25px 20px" }}>

                                                                                                                        {/* 질문 영역 */}
                                                                                                                        <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: q.reply ? '25px' : '0' }}>
                                                                                                                                <strong style={{ color: '#333', fontSize: '18px', marginRight: '15px', lineHeight: '1' }}>Q.문의 내용</strong>
                                                                                                                                <div style={{ flex: 1 }}>
                                                                                                                                        <p style={{ margin: "0", color: '#444', fontSize: "14px", lineHeight: "1.6", whiteSpace: "pre-wrap" }}>
                                                                                                                                                {q.context}
                                                                                                                                        </p>
                                                                                                                                </div>
                                                                                                                        </div>

                                                                                                                        {/* 판매자 답변 영역 */}
                                                                                                                        {q.reply && (
                                                                                                                                <div style={{
                                                                                                                                        paddingTop: "20px",
                                                                                                                                        borderTop: "1px dashed #e8e8e8"
                                                                                                                                }}>
                                                                                                                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: 'center', marginBottom: "10px" }}>
                                                                                                                                                <span style={{ fontWeight: "bold", color: "#222", fontSize: "14px" }}>
                                                                                                                                                        A. 판매자 답변
                                                                                                                                                </span>
                                                                                                                                                <span style={{ fontSize: "12px", color: "#999" }}>
                                                                                                                                                        {formattedReplyDate}
                                                                                                                                                </span>
                                                                                                                                        </div>
                                                                                                                                        <p style={{ margin: 0, color: "#555", fontSize: "14px", lineHeight: "1.6", paddingLeft: "15px", whiteSpace: "pre-wrap" }}>
                                                                                                                                                {q.reply}
                                                                                                                                        </p>
                                                                                                                                </div>
                                                                                                                        )}
                                                                                                                </td>
                                                                                                        </tr>
                                                                                                )}
                                                                                        </React.Fragment>
                                                                                );
                                                                        })
                                                                )}
                                                        </tbody>
                                                </table>

                                                {openQna && (
                                                        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 10000 }}>
                                                                <div style={{ background: "#fff", padding: "30px", borderRadius: "12px", width: "500px", position: "relative", boxShadow: "0 8px 24px rgba(0,0,0,0.15)" }}>
                                                                        <button style={{ position: "absolute", top: "15px", right: "15px", background: "none", border: "none", fontSize: "22px", cursor: "pointer", color: '#aaa' }} onClick={() => setOpenQna(false)}>&times;</button>
                                                                        <h3 style={{ marginBottom: "25px", fontWeight: "bold", textAlign: 'left', fontSize: '20px' }}>상품 문의하기</h3>

                                                                        <div style={{ marginBottom: "15px", textAlign: "left" }}>
                                                                                <label style={{ display: "block", marginBottom: "6px", fontWeight: "bold", fontSize: '14px', color: '#333' }}>제목</label>
                                                                                <input type="text"
                                                                                        style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "6px", boxSizing: 'border-box' }}
                                                                                        value={qnaTitle}
                                                                                        onChange={(e) => setQnaTitle(e.target.value)} placeholder="제목을 입력해주세요." />
                                                                        </div>

                                                                        <div style={{ marginBottom: "25px", textAlign: "left" }}>
                                                                                <label style={{ display: "block", marginBottom: "6px", fontWeight: "bold", fontSize: '14px', color: '#333' }}>내용</label>
                                                                                <textarea style={{ width: "100%", height: "150px", padding: "10px", border: "1px solid #ddd", borderRadius: "6px", resize: "none", boxSizing: 'border-box', lineHeight: '1.5' }}
                                                                                        value={questionText}
                                                                                        onChange={(e) => setQuestionText(e.target.value)}
                                                                                        placeholder="문의하실 내용을 입력해주세요."></textarea>
                                                                        </div>

                                                                        <div style={{ display: "flex", gap: "10px" }}>
                                                                                <button type="button" style={{ flex: 1, padding: "12px", background: "#eee", color: "#333", border: "none", borderRadius: "6px", fontSize: "15px", cursor: "pointer" }} onClick={() => setOpenQna(false)}>취소</button>
                                                                                <button type="button" style={{ flex: 1, padding: "12px", background: "#333", color: "#fff", border: "none", borderRadius: "6px", fontSize: "15px", cursor: "pointer", fontWeight: 'bold' }} onClick={handleQuestionSubmit}>문의등록</button>
                                                                        </div>
                                                                </div>
                                                        </div>
                                                )}

                                        </div>
                                )}
                        </div>
                </div >
        )
}
export default ProductDetail;