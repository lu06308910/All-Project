import React, { useState } from 'react';
import axios from 'axios';
import './../css/kdh.css';

const MyPage = () => {
        const [userName, setUserName] = useState("db등록시 로그인_이름");

        const [sideMenus] = useState(['주문 내역', '취소/반품/교환 내역', '찜', '이벤트', '문의 내역']);

        const [orders] = useState([
                {
                        id: 1,
                        brand: "CANVAS",
                        name: "크로켓 2000 거실장",
                        price: "230,000",
                        rating: "★★★☆☆",
                        status: "배송 중",
                        deliveryDate: "26.04.27",
                        deliveryStatus: "도착(예정)"
                }
        ]);

        return (
                <div className="mypage-container">
                        <h1 className="mypage-title">마이스토어({userName} 님)</h1>

                        <section className="info-box">
                                <div className="profile-header">
                                        <div className="nickname-link">닉네임 〉</div>
                                        <div className="settings-icon"><a href="">⚙️</a></div>
                                </div>
                                <div className="info-stats">
                                        <div className="stat-item">
                                                <div className="stat-label">총구매 금액 〉</div>
                                                <div className="stat-value">--원</div>
                                        </div>
                                        <div className="stat-item">
                                                <div className="stat-label">쿠폰 〉</div>
                                                <div className="stat-value">보유쿠폰 : --장</div>
                                        </div>
                                </div>
                        </section>

                        <div className="main-wrapper">
                                <div className="sidebar">
                                        <ul className="mypage-side-menu">
                                                {sideMenus.map((menu, index) => (
                                                        <li key={index} className="p-menu">{menu}</li>
                                                ))}
                                        </ul>
                                </div>

                                <main className="content-area">
                                        <div className="content-header">
                                                <h2>주문 내역</h2>
                                        </div>
                                        <div className="search-bar" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px' }}>
                                                <input type="text" placeholder="검색할 상품을 입력해주세요." />
                                                <button className="search-icon"></button>
                                        </div>

                                        {orders.map((item) => (
                                                <div className="order-item" key={item.id}>
                                                        <div className="item-img"></div>
                                                        <div className="item-info">
                                                                <span className="brand-name">{item.brand}</span>
                                                                <h3 className="product-name">{item.name}</h3>
                                                                <p className="product-price">{item.price}원</p>
                                                        </div>

                                                        <div className="btn-group">
                                                                <span style={{ color: '#ffc107' }}>{item.rating}</span>
                                                                <button className="btn-light">후기작성</button>
                                                        </div>

                                                        <div className="btn-group">
                                                                <span className="status-text">{item.status}</span>
                                                                <button className="btn-light">배송조회</button>
                                                        </div>

                                                        <div className="btn-group">
                                                                <span style={{ fontSize: '12px', textAlign: 'center' }}>
                                                                        {item.deliveryDate}<br />{item.deliveryStatus}
                                                                </span>
                                                                <button className="btn-dark">상세보기</button>
                                                        </div>
                                                </div>
                                        ))}
                                </main>
                        </div>
                </div>
        );
};

export default MyPage;