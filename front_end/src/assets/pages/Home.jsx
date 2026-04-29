import React from 'react';
import './../css/home.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Home() {

        const categories = [
                { id: 1, name: '수납가구', img: '/image/storage.jpeg' },
                { id: 2, name: '침대/매트리스', img: '/image/bed.jpeg' },
                { id: 3, name: '소파/암체어', img: '/image/sofa.jpeg' },
                { id: 4, name: '식탁/테이블/의자', img: '/image/table.jpeg' },
                { id: 5, name: '책상/사무용 의자', img: '/image/desk.jpeg' },
                { id: 6, name: '조명', img: '/image/lighting.jpeg' },
                { id: 7, name: '욕실', img: '/image/bath.jpeg' },
        ]

        const products = [
                { id: 1, name: '1.스와니예 라지킹 침대 프레임(ㅇㅇ/ㅇㅇ)', price: '1,125,000', brand: 'CANVAS', img: '/image/product.jpeg' },
                { id: 2, name: '2.스와니예 라지킹 침대 프레임(ㅇㅇ/ㅇㅇ)', price: '1,125,000', brand: 'CANVAS', img: '/image/product.jpeg' },
                { id: 3, name: '3.스와니예 라지킹 침대 프레임(ㅇㅇ/ㅇㅇ)', price: '1,125,000', brand: 'CANVAS', img: '/image/product.jpeg' },
                { id: 4, name: '4.스와니예 라지킹 침대 프레임(ㅇㅇ/ㅇㅇ)', price: '1,125,000', brand: 'CANVAS', img: '/image/product.jpeg' }
        ]

        return (
                <div className="home-main">
                        {/* 카테고리 */}
                        <nav className="category-unit">
                                <ul className="category-list">
                                        {categories.map((item) => (
                                                <li key={item.id} className="category-item">
                                                        {/* 페이징 후 각 페이지 링크*/}
                                                        <a href={`/category/${item.id}`} className="category-link">
                                                                <div className="category-circle">
                                                                        <img src={item.img} alt={item.name} />
                                                                </div>
                                                                <span className="category-name">{item.name}</span>
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
                        <div className="product-section">
                                <h2>CANVAS 상품</h2><br />
                                <p>CANVAS의 모든 컬렉션을 만나보세요</p>
                                <hr />
                        </div>

                        <div className="product-grid">
                                {products.map((product) => (
                                        <div key={product.id} className="product-card">
                                                <Link to={`/product/${product.id}`} className="product-link">
                                                        <div className="product-img-box">
                                                                <img src={product.img} alt={product.name} />
                                                        </div>
                                                        <div className="product-info">
                                                                {/* 이미지 속 'CanVas' 태그 부분 */}
                                                                <div className="brand-tag">CanVas</div>
                                                                <div className="product-name">{product.name}</div>
                                                                <div className="product-price">
                                                                        <span className="price-number">{product.price}</span>원~
                                                                </div>
                                                        </div>
                                                </Link>
                                        </div>
                                ))}
                        </div>
                </div >
        );
}
export default Home;