import './../css/kdh.css';
import './../css/seul.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { Carousel } from 'react-bootstrap';
import { Ellipsis } from 'react-bootstrap/esm/PageItem';
import { Link } from 'react-router-dom';

function sale(){
        
        // 제품 데이터 배열
        const products = [
                { id: 1, img: "public/p1.png", title: "글자수체크를위해서최대한글귀를늘려보고있습니다안녕하세요반갑습니다어서오세요", price: "89,900", discount: "17%", rating:'4.9', ratcut:'304' },
                { id: 2, img: "public/p2.png", title: "BILLY 빌리", price: "89,900", discount: "17%", rating:'4.9', ratcut:'304' },
                { id: 3, img: "public/p3.png", title: "BILLY 빌리", price: "89,900", discount: "17%", rating:'4.9', ratcut:'304' },
                { id: 4, img: "public/p4.png", title: "BILLY 빌리", price: "89,900", discount: "17%", rating:'4.9', ratcut:'304' },
                { id: 5, img: "public/p1.png", title: "BILLY 빌리", price: "89,900", discount: "17%", rating:'4.9', ratcut:'304' },
                { id: 6, img: "public/p2.png", title: "BILLY 빌리", price: "89,900", discount: "17%", rating:'4.9', ratcut:'304' },
                { id: 7, img: "public/p3.png", title: "BILLY 빌리", price: "89,900", discount: "17%", rating:'4.9', ratcut:'304' },
        ];
        const chunkProducts = (arr, size) => {
                const result = [];
                for (let i = 0; i < arr.length; i += size) {
                result.push(arr.slice(i, i + size));
                }
                return result;
        };

        const productChunks = chunkProducts(products, 4);

        return(
                <>
                        <div style={{margin:'0 auto', marginTop:'100px', textAlign:'center'}}>
                                <h3 style={{fontWeight:'600'}}>CANVAS 특가 상품 기획</h3>
                                <div style={{display:'flex', gap:'20px', justifyContent: 'center'}}>
                                        <h1 style={{color:"white", backgroundColor:"black", padding:"2px 10px"}}>D-3</h1>
                                        <h1>09:09:48</h1>
                                </div>
                                {/* 슬라이드(Carousel) */}
                                <div style={{display:'flex', gap:'20px', justifyContent: 'center', marginTop:'20px'}}>
                                        <div className="sub-slider">
                                                <Carousel fade interval={3000}>
                                                        <Carousel.Item>
                                                                <Link to="#">
                                                                        <img className="d-block w-100" src="/image/banner1.jpg" alt="first slide" />
                                                                </Link>
                                                        </Carousel.Item>
                                                        <Carousel.Item>
                                                                <Link to="#">
                                                                        <img className="d-block w-100" src="/image/banner2.jpg" alt="twice slide" />
                                                                </Link>
                                                        </Carousel.Item>
                                                        <Carousel.Item>
                                                                <Link to="#">
                                                                        <img className="d-block w-100" src="/image/banner3.jpg" alt="twice slide" />
                                                                </Link>
                                                        </Carousel.Item>
                                                </Carousel>
                                        </div>
                                        <div className="sub-slider">
                                                <Carousel fade interval={3000}>
                                                        <Carousel.Item>
                                                                <Link to="#">
                                                                        <img className="d-block w-100" src="/image/banner1.jpg" alt="first slide" />
                                                                </Link>
                                                        </Carousel.Item>
                                                        <Carousel.Item>
                                                                <Link to="#">
                                                                        <img className="d-block w-100" src="/image/banner2.jpg" alt="twice slide" />
                                                                </Link>
                                                        </Carousel.Item>
                                                        <Carousel.Item>
                                                                <Link to="#">
                                                                        <img className="d-block w-100" src="/image/banner3.jpg" alt="twice slide" />
                                                                </Link>
                                                        </Carousel.Item>
                                                </Carousel>
                                        </div>
                                </div>
                                {/* 상품 리스트 슬라이더 */}
                                <Carousel 
                                        indicators={false}
                                        interval={null}
                                >
                                        {productChunks.map((chunk, index) => (
                                        <Carousel.Item key={index}>
                                                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', padding: '0 50px', marginTop:'100px', marginBottom:'100px' }}>
                                                {chunk.map((item) => (
                                                        <Link to="/productDetail" className="product-link" key={item.id} style={{ textDecoration: 'none', color: 'inherit', width: '25%' }}>
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
                                                                <div style={{ fontSize: '0.8em', color:'gray' }}>
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
                        
                </>
        )
}

export default sale