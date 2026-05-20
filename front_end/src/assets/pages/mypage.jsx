import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './../css/kdh.css';

const MyPage = () => {

        // 상태 관리: 사용자 데이터 및 타입
        const [userInfo, setUserInfo] = useState(null);
        const [loading, setLoading] = useState(true);
        const [inquiries, setInquiries] = useState([]); // DB에서 가져올 문의 목록
        const [orders, setOrders] = useState([]); // DB에서 가져올 주문목록
        const [activeMenu, setActiveMenu] = useState('');

        // 세션에서 정보 가져오기 (로그인 시 저장했던 값)
        const logId = sessionStorage.getItem("logId");
        const usertype = sessionStorage.getItem("usertype");
        const loginName = sessionStorage.getItem("logName"); // 문의내역 조회용
        const isCorporate = usertype === 'BUSINESS';

        // 이름/기업명 동적 할당 (DataEntity: username / CpDataEntity: businessName)
        const userName = isCorporate ? userInfo?.businessName : userInfo?.username;

        // 서버에서 데이터 불러오기
        useEffect(() => {
                const fetchData = async () => {
                        try {
                                // 유저 정보 가져오기
                                if (logId) {
                                        const userRes = await axios.get(`http://localhost:9991/member/edit?userid=${logId}&usertype=${usertype}`);
                                        setUserInfo(userRes.data);
                                }

                                // 문의 내역 가져오기 (DB 연동)
                                if (loginName) {
                                        const inqRes = await axios.get(`http://localhost:9991/support/list?writer=${loginName}`);
                                        setInquiries(inqRes.data);
                                }
                                // 일반사용자 목록
                                if (logId && !isCorporate) {
                                        const wishRes = await axios.get(`http://localhost:9991/wish/list?userid=${logId}`);
                                        setWishItems(wishRes.data); // 찜목록

                                        const orderRes = await axios.get(`http://localhost:9991/delivery/list?userid=${currentMId}`);
                                        setOrders(orderRes.data); // 주문목록
                                }
                        } catch (error) {
                                console.error("데이터 로딩 실패:", error);
                        } finally {
                                setLoading(false);
                        }
                };

                fetchData();
                setActiveMenu(isCorporate ? '판매 현황' : '주문내역');
        }, [logId, usertype, loginName, isCorporate]);

        // -----------------------------------------------------------------------------------------------------------------------



        const [cancelItems] = useState([
                { id: 101, brand: "CANVAS", name: "크로켓 2000 거실장[1200 / 1500 / 2000]", option: "월넛 / 1200cm / 1개", price: "230,000", status: "취소 완료", date: "26.04.11(토)" },
                { id: 102, brand: "CANVAS", name: "크로켓 2000 거실장[1200 / 1500 / 2000]", option: "월넛 / 1200cm / 1개", price: "230,000", status: "반품 신청", date: "26.04.11(토)" },
                { id: 103, brand: "CANVAS", name: "크로켓 2000 거실장[1200 / 1500 / 2000]", option: "월넛 / 1200cm / 1개", price: "230,000", status: "교환 신청", date: "26.04.11(토)" }
        ]);

        const [wishItems, setWishItems] = useState([
                { id: 201, brand: "CANVAS", name: "크로켓 2000 거실장", price: "230,000", imgUrl: "" },
                { id: 202, brand: "CANVAS", name: "심플 라인 소파", price: "450,000", imgUrl: "" }
        ]);

        const sideMenus = isCorporate
                ? ['판매 현황', '상품 등록/관리', '정산내역', '고객 문의 관리']
                : ['주문내역', '취소/반품/교환 내역', '찜', '문의 내역'];


        // 통계 (문의내역은 실제 DB 데이터 기준)
        const unansweredCount = inquiries.filter(inq => !inq.answer).length;

        const totalAmount = orders.reduce((sum, order) => {
                const price = order.price?.price || 0;
                return sum + (price || 0);
        }, 0);

        // 배송 중 건수
        const deliveryCount = orders.filter(order => order.status === "배송 중").length;

        // 작성할 리뷰)
        const reviewCount = 5;

        const cancelCount = cancelItems ? cancelItems.length : 0;


        /* 마이페이지 컴포넌트 */
        const renderContent = () => {
                // 기업용 메뉴
                if (isCorporate) {
                        switch (activeMenu) {
                                case '판매 현황':
                                        return <SalesStatus />;
                                case '상품 등록/관리':
                                        return <ProductManagement />;
                                case '정산내역':
                                        return <SettlementHistory products={products} />
                                case '고객 문의 관리':
                                        return <InquiryList inquiries={inquiries} isCorp={true} />;
                                default:
                                        return <div className="empty-state">준비 중인 기업 기능입니다.</div>;
                        }
                }

                // 일반 사용자용 메뉴
                switch (activeMenu) {
                        case '주문내역': return <OrderHistory orders={orders} />;
                        case '취소/반품/교환 내역': return <CancelHistory cancelItems={cancelItems} />;
                        case '찜': return <WishList wishItems={wishItems} onDelete={handleDeleteWish} />;
                        case '문의 내역': return <InquiryList inquiries={inquiries} />;
                        default: return <div className="empty-state">준비 중인 페이지입니다.</div>;
                }
        };

        // 찜 삭제 함수
        const handleDeleteWish = async (pid) => {
                if (!window.confirm("찜 목록에서 삭제하시겠습니까?")) return;
                try {
                        // ProductDetail에서 쓰던 toggleLike와 같은 주소
                        await axios.post(`http://localhost:9991/wish/toggle`, {
                                pid: pid,
                                userid: logId
                        });
                        // 서버 삭제 성공 후 UI에서도 즉시 제거
                        setWishItems(prev => prev.filter(item => item.pid !== pid));
                } catch (err) {
                        alert("삭제에 실패했습니다.");
                }
        };

        const [products, setProducts] = useState([
                { id: 1, name: "크로켓 2000 거실장", price: "230,000", status: "판매완료" },
                { id: 2, name: "심플 라인 소파", price: "450,000", status: "판매완료" },
                { id: 3, name: "캔버스 체어", price: "120,000", status: "판매중" }
        ]);

        // --------------------------------------------------마이스토어 공통 ---------------------------------------
        return (
                <div className="mypage-container">
                        <h1 className="mypage-title">마이스토어 {`(${userName}) 님`}</h1>

                        <section className="info-box">
                                <div className="profile-header">
                                        <div className="nickname-link">
                                                <a href={`/member/memberEdit?userid=${logId}&usertype=${usertype}`}>
                                                        {userName}님 〉
                                                </a></div>
                                </div>
                                <div className="info-stats">
                                        {isCorporate ? (
                                                // 기업용 스탯
                                                <>
                                                        <div className="stat-item">
                                                                <div className="stat-label">오늘의 주문 〉</div>
                                                                <div className="stat-value">5건</div>
                                                        </div>
                                                        <div className="stat-item">
                                                                <div className="stat-label">취소/반품 〉</div>
                                                                <div className="stat-value" style={{ color: cancelCount > 0 ? 'red' : 'inherit' }}>{cancelCount}건</div>
                                                        </div>
                                                        <div className="stat-item">
                                                                <div className="stat-label">미답변 문의 〉</div>
                                                                <div className="stat-value" style={{ color: unansweredCount > 0 ? 'red' : 'inherit' }}>
                                                                        {unansweredCount}건
                                                                </div>
                                                        </div>
                                                </>
                                        ) : (
                                                <>
                                                        <div className="stat-item" onClick={() => setActiveMenu('주문내역')}>
                                                                <div className="stat-label">총구매 금액 〉</div>
                                                                <div className="stat-value">
                                                                        {totalAmount.toLocaleString()}원
                                                                </div>
                                                        </div>

                                                        {/* 2. 배송 중: 현재 가장 궁금한 정보 (실시간성) */}
                                                        <div className="stat-item" >
                                                                <div className="stat-label">배송 중 〉</div>
                                                                <div className="stat-value">
                                                                        <span style={{ color: deliveryCount > 0 ? '#2c2c2e' : '#ccc' }}>
                                                                                {deliveryCount}건
                                                                        </span>
                                                                </div>
                                                        </div>

                                                        {/* 3. 작성할 리뷰: 재방문 및 참여 유도 */}
                                                        <div className="stat-item">
                                                                <div className="stat-label">작성할 리뷰 〉</div>
                                                                <div className="stat-value" style={{ color: reviewCount > 0 ? '#ffc107' : '#ccc' }}>
                                                                        {reviewCount}건
                                                                </div>
                                                        </div>
                                                </>
                                        )}
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

// 일반사용자 : 찜목록
const WishList = ({ wishItems, onDelete }) => {
        return (
                <div className="wishlist-container">
                        <div className="wish-count-bar">
                                전체 <strong>{wishItems.length}</strong>개
                        </div>

                        {wishItems.length === 0 ? (
                                <div className="empty-state">찜한 상품이 없습니다.</div>
                        ) : (
                                <div className="wish-grid">
                                        {wishItems.map((item) => (
                                                <div className="order-item" key={item.pid}>
                                                        <div className="item-img-box">
                                                                {item.fileList && item.fileList.length > 0 && item.fileList[0] ? (
                                                                        <img
                                                                                src={`http://localhost:9991/static/uploads/${item.fileList[0].filename}.${item.fileList[0].extname}`}
                                                                                alt={item.pname}
                                                                                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                                                        />
                                                                ) : (
                                                                        <div style={{ width: '100px', height: '100px', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#999' }}>이미지 없음</div>
                                                                )}
                                                        </div>
                                                        <div className="item-info">
                                                                <span className="brand-name">{item.brand || "브랜드"}</span>
                                                                <h3 className="product-name">{item.pname}</h3>
                                                                <p className="product-price">{Number(item.price).toLocaleString()}원</p>
                                                        </div>
                                                        <div className="btn-group">
                                                                <button className="btn-dark" onClick={() => window.location.href = `/product/${item.pid}`}>
                                                                        구매하기
                                                                </button>
                                                                <button className="btn-light" onClick={() => onDelete(item.pid)}>
                                                                        삭제
                                                                </button>
                                                        </div>
                                                </div>
                                        ))}
                                </div>
                        )}
                </div>
        );
};

// 일반 사용자 : 문의하기
const InquiryList = ({ inquiries, isCorp }) => {
        const [expandedId, setExpandedId] = useState(null);
        const toggleInquiry = (id) => setExpandedId(expandedId === id ? null : id);

        return (
                <div className="inquiry-list-wrapper">
                        <table className="management-table">
                                <thead>
                                        <tr>
                                                <th style={{ width: '8%' }}>번호</th>
                                                <th style={{ width: '12%' }}>카테고리</th>
                                                <th>제목</th>
                                                <th style={{ width: '12%' }}>작성자</th>
                                                <th style={{ width: '15%' }}>작성일</th>
                                                <th style={{ width: '12%', textAlign: 'center' }}>상태</th>
                                        </tr>
                                </thead>
                                {inquiries.length === 0 ? (
                                        <tbody><tr><td colSpan="6" className="empty-row">문의 내역이 없습니다.</td></tr></tbody>
                                ) : (
                                        inquiries.map((inquiry, index) => (
                                                <tbody key={inquiry.sid || index}>
                                                        <tr onClick={() => toggleInquiry(inquiry.sid)} style={{ cursor: 'pointer' }}>
                                                                <td>{inquiry.s_id}</td>
                                                                <td><span className="category-tag">{inquiry.category}</span></td>
                                                                <td className="inquiry-title-cell">{inquiry.subject}</td>
                                                                <td>{inquiry.writer}</td>
                                                                <td>{inquiry.writedate ? inquiry.writedate.split('T')[0] : "-"}</td>
                                                                <td className="text-center">
                                                                        <span className={`status-badge ${inquiry.answer ? 'complete' : 'waiting'}`}>
                                                                                {inquiry.answer ? "답변완료" : "답변대기"}
                                                                        </span>
                                                                </td>
                                                        </tr>
                                                        {expandedId === inquiry.sid && (
                                                                <tr className="inquiry-detail-row">
                                                                        <td colSpan="6">
                                                                                <div className="my-detail-content">
                                                                                        <div className="question-box">
                                                                                                <strong>Q. 문의 내용</strong>
                                                                                                <p style={{ whiteSpace: 'pre-wrap' }}>{inquiry.context}</p>
                                                                                        </div>
                                                                                        {inquiry.answer ? (
                                                                                                <div className="answer-box">
                                                                                                        <strong>A. 답변 내용</strong>
                                                                                                        <p style={{ whiteSpace: 'pre-wrap' }}>{inquiry.answer}</p>
                                                                                                        {inquiry.answerdate && <small>답변일: {inquiry.answerdate.split('T')[0]}</small>}
                                                                                                </div>
                                                                                        ) : (
                                                                                                <div className="waiting-box"><small>답변 준비 중입니다.</small></div>
                                                                                        )}
                                                                                </div>
                                                                        </td>
                                                                </tr>
                                                        )}
                                                </tbody>
                                        ))
                                )}
                        </table>
                </div>
        );
};


// 일반 사용자 : 주문내역
const OrderHistory = ({ orders }) => {
        if (!orders || orders.length === 0) {
                return <div className="empty-state">주문한 상품이 없습니다.</div>;
        }

        const [selectedOrder, setSelectedOrder] = useState(null);
        const [selectedDelivery, setSelectedDelivery] = useState(null);

        const closeModal = () => setSelectedOrder(null);
        const closeDeliveryModal = () => setSelectedDelivery(null);

        return (
                <>
                        <div className="search-bar">
                                <input type="text" placeholder="검색할 상품을 입력해주세요." />
                                <button className="search-icon"></button>
                        </div>
                        <hr />
                        {orders.map((item, index) => (
                                <div className="order-item" key={item.dId || index}>
                                        <div className="item-img">
                                                {item.product?.fileList?.[0] && (
                                                        <img src={`http://localhost:9991/static/uploads/${item.product.fileList[0].filename}.${item.product.fileList[0].extname}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                )}
                                        </div>
                                        <div className="item-info">
                                                <span className="brand-name">{item.product?.brand || "CANVAS"}</span>
                                                <h3 className="product-name">{item.product?.pname || "상품명 없음"}</h3>
                                                <p className="product-price">{item.product?.price ? Number(item.product.price).toLocaleString() : 0}원</p>
                                        </div>
                                        <div className="btn-group">
                                                <span style={{ color: '#ffc107' }}>★★★☆☆</span>
                                                <button className="btn-light" onClick={() => window.location.href = `/productDetail/${item.product?.pId}`}>후기작성</button>
                                        </div>
                                        <div className="btn-group">
                                                <span className="status-text">{item.status || "배송 준비중"}</span>
                                                <button className="btn-light" onClick={() => setSelectedDelivery(item)}>배송조회</button>
                                        </div>
                                        <div className="btn-group">
                                                <span style={{ fontSize: '12px', textAlign: 'center' }}>
                                                        {item.deliveryDate || "기한 미정"}<br />{item.deliveryStatus || ""}
                                                </span>
                                                <button className="btn-dark" onClick={() => setSelectedOrder(item)}>
                                                        상세보기
                                                </button>
                                        </div>
                                </div>
                        ))}

                        {/* 주문 상세보기 모달 */}
                        {selectedOrder && (
                                <div className="modal-overlay" onClick={closeModal}>
                                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                                <div className="modal-header">
                                                        <h2>주문 상세 내역</h2>
                                                        <button className="close-btn" onClick={closeModal}>&times;</button>
                                                </div>
                                                <div className="modal-body">
                                                        <section>
                                                                <h4>결제 정보</h4>
                                                                <p>결제수단: {selectedOrder.paymentMethod || '신용카드'}</p>
                                                                <p>결제금액: {selectedOrder.price}원</p>
                                                                <p>결제일시: {selectedOrder.orderDate || '2026-05-08'}</p>
                                                        </section>
                                                        <hr />
                                                        <section>
                                                                <h4>배송지 정보</h4>
                                                                <p>수령인: {selectedOrder.name || "본인"}</p>
                                                                <p>연락처: {selectedOrder.tel}</p>
                                                                <p>배송주소: {selectedOrder.address}</p>
                                                                <p>배송메모: {selectedOrder.memo || "없음"}</p>
                                                        </section>
                                                </div>
                                        </div>
                                </div>
                        )}

                        {/* 배송조회 모달 */}
                        {selectedDelivery && (
                                <div className="modal-overlay" onClick={closeDeliveryModal}>
                                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                                <div className="modal-header">
                                                        <h2>배송 조회 ({selectedDelivery.product?.pname})</h2>
                                                        <button className="close-btn" onClick={closeDeliveryModal}>&times;</button>
                                                </div>
                                                <div className="modal-body">
                                                        <section style={{ marginBottom: '15px' }}>
                                                                <h4>기본 배송 정보</h4>
                                                                <p>택배사: 캔버스 로지스틱스</p>
                                                                <p>운송장번호: {selectedDelivery.trackingNo || '등록 대기중'}</p>
                                                                <p>현재상태: <strong style={{ color: '#2196F3' }}>{selectedDelivery.status || "배송 준비중"}</strong></p>
                                                        </section>
                                                        <hr />
                                                        <section style={{ marginTop: '15px' }}>
                                                                <h4>배송 진행 상황</h4>
                                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '10px 5px' }}>
                                                                        <div style={{ display: 'flex', gap: '15px', color: '#2196F3', fontWeight: 'bold' }}>
                                                                                <span style={{ fontSize: '13px', minWidth: '70px' }}>실시간</span>
                                                                                <div>
                                                                                        <strong style={{ fontSize: '14px' }}>{selectedDelivery.status || "배송 준비중"}</strong>
                                                                                        <p style={{ margin: '3px 0 0 0', fontSize: '12px', color: '#2196F3' }}>
                                                                                                {selectedDelivery.status === '배송 완료' ? '고객님께 배송이 완료되었습니다.' : '상품을 신속하게 배송해 드리기 위해 준비 중입니다.'}
                                                                                        </p>
                                                                                </div>
                                                                        </div>
                                                                </div>
                                                        </section>
                                                </div>
                                        </div>
                                </div>
                        )}
                </>
        );
};
// ----------------------------------------- 일반 사용자 -------------------------------------------


/* 취소/반품/ 교환 내역 */
const CancelHistory = ({ cancelItems }) => {
        const [selectedCancel, setSelectedCancel] = useState(null);
        const closeModal = () => setSelectedCancel(null);

        if (!cancelItems || cancelItems.length === 0) {
                return <div className="empty-state">취소/반품/교환 내역이 없습니다.</div>;
        }

        return (
                <>
                        <div className="search-bar">
                                <input type="text" placeholder="검색할 상품을 입력해주세요." />
                                <button className="search-icon"></button>
                        </div>
                        <hr />
                        {cancelItems.map((item) => (
                                <div className="order-item" key={item.id}>
                                        <div className="item-img" ></div>
                                        <div className="item-info">
                                                <span className="brand-name">{item.brand}</span>
                                                <h3 className="product-name">{item.name}</h3>
                                                <p style={{ fontSize: '13px', color: '#888', margin: '4px 0' }}>{item.option}</p>
                                                <p className="product-price">{item.price}원</p>
                                        </div>
                                        <div className="btn-group">
                                                <span className="status-text" style={{ fontWeight: 'bold' }}>{item.status}</span>
                                                {item.status === '교환 신청' && <button className="btn-light">배송조회</button>}
                                        </div>
                                        <div className="btn-group">
                                                <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{item.date}</span>
                                                <button className="btn-light" style={{ border: '1px solid #333' }} onClick={() => setSelectedCancel(item)}>
                                                        {item.status.split(' ')[0]} 상세보기
                                                </button>
                                        </div>
                                </div>
                        ))}

                        {/* 취소 상세 내역 모달 */}
                        {selectedCancel && (
                                <div className="modal-overlay" onClick={closeModal}>
                                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                                <div className="modal-header">
                                                        <h2>{selectedCancel.status} 상세 내역</h2>
                                                        <button className="close-btn" onClick={closeModal}>&times;</button>
                                                </div>
                                                <div className="modal-body">
                                                        <section>
                                                                <h4>{selectedCancel.status} 정보</h4>
                                                                <p>접수일시: {selectedCancel.date}</p>
                                                                <p>접수사유: {selectedCancel.reason || '단순 변심'}</p>
                                                                <p>처리상태: <span style={{ color: '#d9534f' }}>{selectedCancel.status}</span></p>
                                                        </section>
                                                        <hr />
                                                        <section>
                                                                <h4>환불 예상 정보</h4>
                                                                <p>환불수단: {selectedCancel.paymentMethod || '신용카드 취소'}</p>
                                                                <p>환불금액: <strong>{selectedCancel.price}원</strong></p>
                                                        </section>
                                                </div>
                                        </div>
                                </div>
                        )}
                </>
        );
};

// ----------------------------------------- 기업 -------------------------------------------
/* 판매 현황  */
const SalesStatus = () => {
        const [salesSummary] = useState({
                todaySales: "1,150,000",
                monthlySales: "28,400,000",
                pendingDelivery: 3,
                returnRequests: 1
        });

        return (
                <div className="sales-status-container">
                        <div className="corp-status-cards" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                                <div className="corp-status-card" >
                                        <p>오늘의 매출</p>
                                        <h3 style={{ fontSize: '20px', margin: '10px 0' }}>{salesSummary.todaySales}원</h3>
                                </div>
                                <div className="corp-status-card">
                                        <p >이달의 누적 매출</p>
                                        <h3 style={{ fontSize: '20px', margin: '10px 0' }}>{salesSummary.monthlySales}원</h3>
                                </div>
                                <div className="corp-status-card" >
                                        <p>배송 준비 중</p>
                                        <h3 style={{ fontSize: '20px', margin: '10px 0', color: '#2196F3' }}>{salesSummary.pendingDelivery}건</h3>
                                </div>
                                <div className="corp-status-card" >
                                        <p>반품/교환 요청</p>
                                        <h3 style={{ fontSize: '20px', margin: '10px 0', color: '#f44336' }}>{salesSummary.returnRequests}건</h3>
                                </div>
                        </div>

                        <div>
                                <h4 style={{ marginBottom: '15px' }}>최근 주문 내역</h4>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                                        <thead>
                                                <tr style={{ borderBottom: '2px solid #333', textAlign: 'left' }}>
                                                        <th style={{ padding: '12px' }}>주문번호</th>
                                                        <th>상품명</th>
                                                        <th>주문자</th>
                                                        <th>결제금액</th>
                                                        <th>상태</th>
                                                </tr>
                                        </thead>
                                        <tbody>
                                                <tr style={{ borderBottom: '1px solid #eee' }}>
                                                        <td style={{ padding: '12px' }}>20260506-001</td>
                                                        <td>크로켓 2000 거실장</td>
                                                        <td>김*호</td>
                                                        <td>230,000원</td>
                                                        <td><span className="corp-status-badge">결제완료</span></td>
                                                </tr>
                                        </tbody>
                                </table>
                        </div>
                </div>
        );
};

/* 상품 등록/관리 */
const ProductManagement = () => {
        const [products, setProducts] = useState([
                { id: 1, name: "canvas 의자", price: "250,000", stock: 5, status: "판매중", date: "2026-05-01" },
                { id: 2, name: "canvan 책상", price: "480,000", stock: 2, status: "판매중", date: "2026-04-28" },
                { id: 3, name: "canvas 침대", price: "180,000", stock: 0, status: "품절", date: "2026-04-25" },
        ]);

        const [editingId, setEditingId] = useState(null);
        const [editFormData, setEditFormData] = useState({});

        // 수정 버튼 클릭 시
        const handleEditClick = (product) => {
                setEditingId(product.id);
                setEditFormData({ ...product });
        };

        // 입력 값 변경 시
        const handleInputChange = (e) => {
                const { name, value } = e.target;
                setEditFormData({ ...editFormData, [name]: value });
        };

        // 저장 버튼 클릭 시
        const handleSaveClick = () => {
                setProducts(products.map(p => p.id === editingId ? editFormData : p));
                setEditingId(null);
        };

        return (
                <div className="sales-status-container">
                        <div className="corp-status-cards" >
                                <div className="corp-status-card" >
                                        <p style={{ fontSize: '13px', color: '#666' }}>전체 상품</p>
                                        <h3 style={{ fontSize: '20px', margin: '10px 0' }}>{products.length}건</h3>
                                </div>
                                <div className="corp-status-card" >
                                        <p style={{ fontSize: '13px', color: '#666' }}>판매 중</p>
                                        <h3 style={{ fontSize: '20px', margin: '10px 0', color: '#2196F3' }}>2건</h3>
                                </div>
                                <div className="corp-status-card">
                                        <p style={{ fontSize: '13px', color: '#666' }}>품절/중지</p>
                                        <h3 style={{ fontSize: '20px', margin: '10px 0', color: '#f44336' }}>1건</h3>
                                </div>
                        </div>

                        {/* 검색 및 등록 버튼 */}
                        <div className="recent-orders">
                                <div className="filter-group" style={{ display: 'flex', gap: '8px' }}>
                                        {['전체', '판매중', '품절'].map((label) => (
                                                <button
                                                        key={label}
                                                        style={{
                                                                padding: '6px 12px',
                                                                fontSize: '13px',
                                                                borderRadius: '4px',
                                                                border: '1px solid #ddd',
                                                                background: label === '전체' ? '#333' : '#fff',
                                                                color: label === '전체' ? '#fff' : '#333',
                                                                cursor: 'pointer'
                                                        }}
                                                >
                                                        {label}
                                                </button>
                                        ))}
                                </div>
                                <button className="btn-dark" style={{ padding: '8px 20px', borderRadius: '4px' }}
                                        onClick={() => { location.href = "/mypage/addproduct" }}>+ 새 상품 등록
                                </button>
                        </div>

                        <div className="recent-orders">
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                                        <thead>
                                                <tr style={{ borderBottom: '2px solid #333', textAlign: 'left' }}>
                                                        <th style={{ padding: '12px' }}>상품 정보</th>
                                                        <th>판매가</th>
                                                        <th>재고</th>
                                                        <th>상태</th>
                                                        <th style={{ textAlign: 'center' }}>관리</th>
                                                </tr>
                                        </thead>
                                        <tbody>
                                                {products.map(product => (
                                                        <tr key={product.id} style={{ borderBottom: '1px solid #eee' }}>
                                                                <td style={{ padding: '12px' }}>
                                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                                                <div style={{ width: '40px', height: '40px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}></div>
                                                                                {editingId === product.id ? (
                                                                                        <input className="product-edit"
                                                                                                name="name"
                                                                                                value={editFormData.name}
                                                                                                onChange={handleInputChange}
                                                                                        />
                                                                                ) : (
                                                                                        <span style={{ fontWeight: '500' }}>{product.name}</span>
                                                                                )}
                                                                        </div>
                                                                </td>

                                                                {/* 판매가 */}
                                                                <td>
                                                                        {editingId === product.id ? (
                                                                                <input className="product-edit"
                                                                                        name="price"
                                                                                        value={editFormData.price}
                                                                                        onChange={handleInputChange}
                                                                                />
                                                                        ) : (
                                                                                `${product.price}원`
                                                                        )}
                                                                </td>

                                                                {/* 재고 */}
                                                                <td>
                                                                        {editingId === product.id ? (
                                                                                <input className="product-edit"
                                                                                        type="number"
                                                                                        name="stock"
                                                                                        value={editFormData.stock}
                                                                                        onChange={handleInputChange}
                                                                                />
                                                                        ) : (
                                                                                `${product.stock}개`
                                                                        )}
                                                                </td>

                                                                {/* 상태 */}
                                                                <td>
                                                                        {editingId === product.id ? (
                                                                                <select className="product-edit"
                                                                                        name="status"
                                                                                        value={editFormData.status}
                                                                                        onChange={handleInputChange}
                                                                                >
                                                                                        <option value="판매중">판매중</option>
                                                                                        <option value="품절">품절</option>
                                                                                </select>
                                                                        ) : (
                                                                                <span style={{
                                                                                        background: product.status === '품절' ? '#ffebee' : '#e3f2fd',
                                                                                        color: product.status === '품절' ? '#c62828' : '#1976d2',
                                                                                        padding: '2px 6px', borderRadius: '4px', fontSize: '12px'
                                                                                }}>{product.status}</span>
                                                                        )}
                                                                </td>

                                                                {/* 관리 버튼 영역 */}
                                                                <td style={{ textAlign: 'center' }}>
                                                                        {editingId === product.id ? (
                                                                                <>
                                                                                        <button onClick={handleSaveClick} style={{ color: '#2196F3', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold', marginRight: '8px' }}>저장</button>
                                                                                        <button onClick={() => setEditingId(null)} style={{ color: '#666', background: 'none', border: 'none', cursor: 'pointer' }}>취소</button>
                                                                                </>
                                                                        ) : (
                                                                                <>
                                                                                        <button onClick={() => handleEditClick(product)} style={{ background: 'none', border: 'none', color: '#666', fontSize: '12px', cursor: 'pointer', marginRight: '8px' }}>수정</button>
                                                                                        <button style={{ background: 'none', border: 'none', color: '#f44336', fontSize: '12px', cursor: 'pointer' }}>삭제</button>
                                                                                </>
                                                                        )}
                                                                </td>
                                                        </tr>
                                                ))}
                                        </tbody>
                                </table>
                        </div>
                </div>
        );
};

const SettlementHistory = ({ products }) => {
        // 실제 서비스 시에는 백엔드에서 정산 데이터를 따로 가져오겠지만, 
        // 현재는 '판매완료' 상태인 상품을 기준으로 로직을 구성했습니다.
        const settledItems = products.filter(p => p.status === '판매완료' || p.status === '정산완료');

        // 통계 계산 로직 (숫자 포맷팅 포함)
        const totalSales = settledItems.reduce((sum, item) => {
                const price = typeof item.price === 'string'
                        ? Number(item.price.replace(/[^0-9]/g, ''))
                        : item.price;
                return sum + price;
        }, 0);

        const feeRate = 0.1; // 플랫폼 수수료 10%
        const totalFee = Math.floor(totalSales * feeRate);
        const expectedAmount = totalSales - totalFee;

        return (
                <div className="content-area">

                        {/* 상단 통계 카드 섹션 */}
                        <div className="corp-status-cards">
                                <div className="corp-status-card highlight">
                                        <p>정산 예정 금액</p>
                                        <div className="stat-value">{expectedAmount.toLocaleString()}원</div>
                                </div>
                                <div className="corp-status-card">
                                        <p>이번 달 판매 총액</p>
                                        <div className="stat-value">{totalSales.toLocaleString()}원</div>
                                </div>
                                <div className="corp-status-card">
                                        <p>판매 수수료 (10%)</p>
                                        <div className="stat-value fee">-{totalFee.toLocaleString()}원</div>
                                </div>
                        </div>

                        {/* 정산 필터 탭 */}
                        <div className="filter-tab-group">
                                <button className="filter-btn active">전체 내역</button>
                                <button className="filter-btn">정산 예정</button>
                                <button className="filter-btn">정산 완료</button>
                        </div>

                        {/* 정산 상세 테이블 */}
                        <table className="management-table">
                                <thead>
                                        <tr>
                                                <th>거래 일시/번호</th>
                                                <th>상품 정보</th>
                                                <th>판매가</th>
                                                <th>수수료</th>
                                                <th>정산액</th>
                                                <th className="text-center">상태</th>
                                        </tr>
                                </thead>
                                <tbody>
                                        {settledItems.length > 0 ? (
                                                settledItems.map((item) => {
                                                        const price = typeof item.price === 'string'
                                                                ? Number(item.price.replace(/[^0-9]/g, ''))
                                                                : item.price;
                                                        const fee = Math.floor(price * feeRate);

                                                        return (
                                                                <tr key={item.id}>
                                                                        <td className="order-date">
                                                                                <span className="id-text">NO.{item.id}2026</span><br />
                                                                                <small>2026-05-07</small>
                                                                        </td>
                                                                        <td>
                                                                                <strong>{item.name}</strong>
                                                                        </td>
                                                                        <td>{price.toLocaleString()}원</td>
                                                                        <td className="fee-text">-{fee.toLocaleString()}원</td>
                                                                        <td className="settle-price">{(price - fee).toLocaleString()}원</td>
                                                                        <td className="text-center">
                                                                                <span className="corp-status-badge">정산예정</span>
                                                                        </td>
                                                                </tr>
                                                        );
                                                })
                                        ) : (
                                                <tr>
                                                        <td colSpan="6" className="empty-row">데이터가 존재하지 않습니다.</td>
                                                </tr>
                                        )}
                                </tbody>
                        </table>
                </div>
        );
};



export default MyPage;