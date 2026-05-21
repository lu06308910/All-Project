import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import './../css/seul.css';


function Space() {

        const [showMore, setShowMore] = useState(false);

        // 좋아요 상태 저장
        const [likedItems, setLikedItems] = useState([]);

        const { sCategory } = useParams(); // 카테고리 매핑주소
        const [data, setData] = useState([]); // 카테고리 해당 제품 데이터

        const [list, setList] = useState([]);// 모든 상품 데이터

        // 처음 4개 + showMore true면 전체
        const visibleProducts = showMore ? list : list.slice(0, 4);

        useEffect(() => {
                getDataList();
        }, []);

        // 처음 모든 제품데이터 가져오기
        function getDataList() {
                let url = "?";


                axios.get(`http://localhost:9989/spaceproduct${url}`)
                        .then((response) => {

                                console.log(response.data);


                                const newList = response.data.dataList.map((record) => {
                                        return {
                                                id: record.pid,
                                                title: record.name,
                                                price: record.price,
                                                img: record.fileList?.[0]
                                                        ? `http://localhost:9989/upload/${record.fileList[0].filename}.${record.fileList[0].extname}`
                                                        : "/no-image.png"
                                        };
                                });

                                setList(newList);

                        })
                        .catch((error) => {
                                console.log("목록조회 에러발생==>", error);
                        });
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

                axios.post("http://localhost:9989/like/toggle", {
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
                                        <div className="big-img img-box">
                                                <img src="public/imgcatagory4.jpg" />
                                                <a href="/categoryproduct/2인용 소파">
                                                        <img src="public/imgBtn.png" className="btn-img" />
                                                </a>

                                                {/* 오버레이(마우스 오버 시 나타남) */}
                                                <div className="hover-box">
                                                        <span>거실 더보기</span>
                                                </div>
                                        </div>

                                        {/* 2번 위쪽 작은 이미지 */}
                                        <div className="small-top img-box">
                                                <img src="public/imgcatagory3.png" />
                                                <a href="/categoryproduct/식탁">
                                                        <img src="public/imgBtn.png" className="btn-img" />
                                                </a>

                                                <div className="hover-box">
                                                        <span>주방 더보기</span>
                                                </div>
                                        </div>

                                        {/* 3번 식물 이미지 */}
                                        <div className="small-right img-box">
                                                <img src="public/imgcatagory2.png" />
                                                <a href="/categoryproduct/욕실">
                                                        <img src="public/imgBtn.png" className="btn-img" />
                                                </a>

                                                <div className="hover-box">
                                                        <span>욕실 더보기</span>
                                                </div>
                                        </div>

                                        {/* 4번 긴 테이블 이미지 */}
                                        <div className="wide-bottom img-box">
                                                <img src="public/imgcatagory.png" />
                                                <a href="/categoryproduct/퀸 침대">
                                                        <img src="public/imgBtn.png" className="btn-img" />
                                                </a>

                                                <div className="hover-box">
                                                        <span>침실 더보기</span>
                                                </div>
                                        </div>

                                </div>
                        </div>


                        <div style={{ margin: '150px 20px 50px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h2 style={{ margin: 0 }}>모든 상품</h2>

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
                                                        key={item.pid}
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

                                                                        <div className="price">
                                                                                ₩{item.price}
                                                                        </div>

                                                                        <div className="rating">
                                                                                <img src="/bal.png" alt="" />
                                                                                <img src="/bal.png" alt="" />
                                                                                <img src="/bal.png" alt="" />
                                                                                <img src="/bal.png" alt="" />
                                                                                <img src="/bal.png" alt="" />
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
        )


}
export default Space;