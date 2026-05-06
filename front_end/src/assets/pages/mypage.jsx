import React, { useState } from 'react';
import './../css/kdh.css';

/* 주문내역 */
const OrderHistory = ({ orders }) => {
        if (!orders || orders.length === 0) {
                return <div className="empty-state">주문한 상품이 없습니다.</div>;
        }

        return (
                <>
                        <div className="search-bar" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px' }}>
                                <input type="text" placeholder="검색할 상품을 입력해주세요." />
                                <button className="search-icon"></button>
                        </div>
                        <hr />
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
                </>
        );
};
/* 취소/반품/ 교환 내역 */
const CancelHistory = ({ cancelItems }) => {
        if (!cancelItems || cancelItems.length === 0) {
                return <div className="empty-state">취소/반품/교환 내역이 없습니다.</div>;
        }

        return (
                <>
                        <div className="search-bar" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px' }}>
                                <input type="text" placeholder="검색할 상품을 입력해주세요." />
                                <button className="search-icon"></button>
                        </div>
                        <hr />
                        {cancelItems.map((item) => (
                                <div className="order-item" key={item.id}>
                                        <div className="item-img" style={{ backgroundImage: `url(${item.imgUrl})`, backgroundSize: 'cover' }}></div>

                                        <div className="item-info">
                                                <span className="brand-name">{item.brand}</span>
                                                <h3 className="product-name">{item.name}</h3>
                                                <p style={{ fontSize: '13px', color: '#888', margin: '4px 0' }}>{item.option}</p>
                                                <p className="product-price">{item.price}원</p>
                                        </div>

                                        {/* 상태 표시 (취소 완료, 반품 신청 등) */}
                                        <div className="btn-group">
                                                <span className="status-text" style={{ fontWeight: 'bold' }}>{item.status}</span>
                                                {/* 교환 신청 처럼 추가 버튼이 필요한 경우 */}
                                                {item.status === '교환 신청' && <button className="btn-light">배송조회</button>}
                                        </div>

                                        {/* 날짜 및 상세보기 버튼 */}
                                        <div className="btn-group">
                                                <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{item.date}</span>
                                                <button className="btn-light" style={{ border: '1px solid #333' }}>
                                                        {item.status.split(' ')[0]} 상세보기
                                                </button>
                                        </div>
                                </div>
                        ))}
                </>
        );
};

/* 찜 목록 */
const WishList = ({ wishItems, onDelete, onDeleteAll }) => {
        if (!wishItems || wishItems.length === 0) {
                return <div className="empty-state">찜한 상품 목록이 없습니다.</div>;
        }

        return (
                <>
                        <div className="wish-control-bar" style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '10px 0',
                                marginBottom: '10px'
                        }}>
                                <div className="left-info">
                                        <span style={{ fontWeight: 'bold' }}>전체 {wishItems.length}개</span>
                                        <button
                                                onClick={onDeleteAll}
                                                style={{ marginLeft: '15px', fontSize: '12px', color: '#999', border: 'none', background: 'none', cursor: 'pointer' }}
                                        >
                                                전체 삭제
                                        </button>
                                </div>

                                <div className="right-controls" style={{ display: 'flex', gap: '8px' }}>
                                        <div className="search-bar" style={{ position: 'relative' }}>
                                                <input type="text" placeholder="상품명 검색" />
                                                <button className="search-icon"></button>
                                        </div>
                                        <select style={{ border: 'none', fontSize: '13px', background: 'transparent', cursor: 'pointer' }}>
                                                <option>최근 등록순</option>
                                                <option>낮은 가격순</option>
                                        </select>
                                </div>
                        </div>
                        <hr />

                        {wishItems.map((item) => (
                                <div className="order-item" key={item.id}>
                                        <div className="item-img" style={{ backgroundImage: `url(${item.imgUrl})`, backgroundSize: 'cover' }}></div>

                                        <div className="item-info">
                                                <span className="brand-name">{item.brand}</span>
                                                <h3 className="product-name">{item.name}</h3>
                                                <p className="product-price">{item.price}원</p>
                                        </div>

                                        <div className="btn-group">
                                                <button className="btn-dark" style={{ width: '110px', borderRadius: '4px' }}>장바구니 담기</button>
                                                <button
                                                        className="btn-light"
                                                        style={{ width: '110px', marginTop: '6px', fontSize: '12px', color: '#888' }}
                                                        onClick={() => onDelete(item.id)}
                                                >
                                                        삭제
                                                </button>
                                        </div>
                                </div>
                        ))}
                </>
        );
};

/** 문의 내역 컴포넌트 **/
const InquiryList = ({ inquiries }) => {
        if (!inquiries || inquiries.length === 0) {
                return <div className="empty-state">작성한 문의 내역이 없습니다.</div>;
        }

        return (
                <>

                        <hr />
                        {inquiries.map((q) => (
                                <div className="order-item" key={q.id} style={{ cursor: 'pointer' }}>
                                        {/* 문의 유형 및 상태 */}
                                        <div className="item-info" style={{ flex: '0 0 120px' }}>
                                                <span style={{
                                                        fontSize: '12px',
                                                        padding: '4px 8px',
                                                        borderRadius: '4px',
                                                        backgroundColor: q.answered ? '#e8f5e9' : '#f5f5f5',
                                                        color: q.answered ? '#2e7d32' : '#888',
                                                        fontWeight: 'bold'
                                                }}>
                                                        {q.answered ? '답변완료' : '답변대기'}
                                                </span>
                                                <p style={{ marginTop: '10px', color: '#666', fontSize: '13px' }}>{q.category}</p>
                                        </div>

                                        {/* 문의 제목 및 날짜 */}
                                        <div className="item-info" style={{ flex: 1 }}>
                                                <h3 className="product-name" style={{ fontSize: '16px' }}>{q.title}</h3>
                                                <p style={{ color: '#999', fontSize: '13px', marginTop: '5px' }}>{q.date}</p>
                                        </div>

                                        {/* 우측 버튼 */}
                                        <div className="btn-group">
                                                <button className="btn-light">상세보기</button>
                                        </div>
                                </div>
                        ))}
                </>
        );
};

/** 마이페이지 컴포넌트 **/
const MyPage = () => {
        const [userName] = useState("db데이터_로그인이름"); //
        const [activeMenu, setActiveMenu] = useState('주문내역');
        const [sideMenus] = useState(['주문내역', '취소/반품/교환 내역', '찜', '이벤트', '문의 내역']);


        const [orders] = useState([
                { id: 1, brand: "CANVAS", name: "크로켓 2000 거실장", price: "230,000", rating: "★★★☆☆", status: "배송 중", deliveryDate: "26.04.27", deliveryStatus: "도착(예정)" }
        ]);
        const [cancelItems] = useState([
                { id: 101, brand: "CANVAS", name: "크로켓 2000 거실장[1200 / 1500 / 2000]", option: "월넛 / 1200cm / 1개", price: "230,000", status: "취소 완료", date: "26.04.11(토)" },
                { id: 102, brand: "CANVAS", name: "크로켓 2000 거실장[1200 / 1500 / 2000]", option: "월넛 / 1200cm / 1개", price: "230,000", status: "반품 신청", date: "26.04.11(토)" },
                { id: 103, brand: "CANVAS", name: "크로켓 2000 거실장[1200 / 1500 / 2000]", option: "월넛 / 1200cm / 1개", price: "230,000", status: "교환 신청", date: "26.04.11(토)" }
        ]);
        const [wishItems, setWishItems] = useState([
                { id: 201, brand: "CANVAS", name: "크로켓 2000 거실장", price: "230,000", imgUrl: "" },
                { id: 202, brand: "CANVAS", name: "심플 라인 소파", price: "450,000", imgUrl: "" }
        ]);

        // 찜 삭제 함수
        const handleDeleteAllWish = () => {
                if (window.confirm("찜한 상품을 모두 삭제하시겠습니까?")) {
                        setWishItems([]);
                }
        };

        const handleDeleteWish = (id) => {
                if (window.confirm("찜한 상품을 삭제하시겠습니까?")) {
                        setWishItems(wishItems.filter(item => item.id !== id));
                }
        };

        const [inquiries] = useState([
                {
                        id: 301,
                        category: "배송문의",
                        title: "거실장 배송 언제쯤 오나요?",
                        date: "2026.04.15",
                        answered: true
                },
                {
                        id: 302,
                        category: "상품문의",
                        title: "소파 가죽 샘플을 볼 수 있을까요?",
                        date: "2026.04.20",
                        answered: false
                }
        ]);

        // 메뉴에 따른 콘텐츠 렌더링 함수
        const renderContent = () => {
                switch (activeMenu) {
                        case '주문내역':
                                return <OrderHistory orders={orders} />;
                        case '취소/반품/교환 내역':
                                return <CancelHistory cancelItems={cancelItems} />;
                        case '찜':
                                return (
                                        <WishList
                                                wishItems={wishItems}
                                                onDelete={handleDeleteWish}
                                                onDeleteAll={handleDeleteAllWish}
                                        />
                                );
                        case '문의 내역':
                                return <InquiryList inquiries={inquiries} />;
                        default:
                                return <div className="empty-state">준비 중인 페이지입니다: {activeMenu}</div>;
                }
        };

        return (
                <div className="mypage-container">
                        <h1 className="mypage-title">마이스토어({userName} 님)</h1>

                        <section className="info-box">
                                <div className="profile-header">
                                        <div className="nickname-link">db데이터_로그인닉네임 님 〉</div>
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
                                                        <li
                                                                key={index}
                                                                className={`p-menu ${activeMenu === menu ? 'active' : ''}`}
                                                                onClick={() => setActiveMenu(menu)}
                                                                style={{ cursor: 'pointer' }}
                                                        >
                                                                {menu}
                                                        </li>
                                                ))}
                                        </ul>
                                </div>

                                <main className="content-area">
                                        <div className="content-header">
                                                <h2>{activeMenu}</h2>
                                        </div>
                                        {renderContent()}
                                </main>
                        </div>
                </div>
        );
};

export default MyPage;