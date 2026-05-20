import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './../css/kdh.css';

const MyPage = () => {

        // 상태 관리: 사용자 데이터 및 타입
        const [userInfo, setUserInfo] = useState(null);
        const [loading, setLoading] = useState(true);
        const [orders, setOrders] = useState([]); // DB-> 주문목록
        const [cancelItems, setCancelItems] = useState([]); // DB -> 취소목록
        const [wishItems, setWishItems] = useState([]); // DB-> 찜목록
        const [inquiries, setInquiries] = useState([]); // DB-> 문의 목록

        const [salesList, setSalesList] = useState([]); // DB -> 판매목록(기업)
        const [products, setProducts] = useState([]); // DB -> 상품 목록 조회 및 수정(기업)
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
                                let ordersMemberId = null;

                                // 유저 정보 가져오기
                                if (logId) {
                                        const userRes = await axios.get(`http://localhost:9991/member/edit?userid=${logId}&usertype=${usertype}`);
                                        setUserInfo(userRes.data);
                                        // 주문목록 가져올때 필요한 기업 id
                                        ordersMemberId = userRes.data?.mid;
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

                                        const orderRes = await axios.get(`http://localhost:9991/buy/list/${ordersMemberId}`);
                                        setOrders(orderRes.data); // 주문목록

                                        const cancelRes = await axios.get(`http://localhost:9991/buy/cancel/list/${ordersMemberId}`);
                                        setCancelItems(cancelRes.data); // 취소목록              

                                }
                                if (logId && isCorporate) {
                                        const salesRes = await axios.get(`http://localhost:9991/buy/seller/saleslist?sellerId=${logId}`);
                                        setSalesList(salesRes.data); // 판매목록

                                        const prodRes = await axios.get(`http://localhost:9991/product/seller/list?sellerId=${logId}`);
                                        console.log("백엔드에서 받아온 데이터:", prodRes.data);
                                        console.log("현재 로그인된 기업 ID (logId):", logId);
                                        setProducts(prodRes.data); // 상품 목록, 수정
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

        const sideMenus = isCorporate
                ? ['판매 현황', '상품 등록/관리', '정산내역', '고객 문의 관리']
                : ['주문내역', '취소/반품/교환 내역', '찜', '문의 내역'];


        // 통계 (문의내역은 실제 DB 데이터 기준)
        const unansweredCount = inquiries.filter(inq => !inq.answer).length;

        const totalAmount = orders ? orders.reduce((sum, order) => {
                // BuyEntity의 price 필드를 직접 참조하되 없으면 0 처리
                const priceValue = order.price || 0;
                const price = typeof priceValue === 'string'
                        ? parseInt(priceValue.replace(/[^0-9]/g, ""), 10)
                        : Number(priceValue);
                return sum + (price || 0);
        }, 0) : 0;

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
                                case '판매 현황': return <SalesStatus sales={salesList} />;
                                case '상품 등록/관리': return <ProductManagement products={products} setProducts={setProducts} />;
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
                        case '주문내역': return <OrderHistory orders={orders} setOrders={setOrders} setCancelItems={setCancelItems} />;
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

// 일반 사용자 : 주문내역
const OrderHistory = ({ orders, setOrders, setCancleItems }) => {
        if (!orders || orders.length === 0) {
                return <div className="empty-state">주문한 상품이 없습니다.</div>;
        }

        const [selectedOrder, setSelectedOrder] = useState(null);
        const [selectedDelivery, setSelectedDelivery] = useState(null);

        const closeModal = () => setSelectedOrder(null);
        const closeDeliveryModal = () => setSelectedDelivery(null);

        // 숫자로 된 별점(1~5)을 노란색 별 문자열로 바꿔주는 함수
        const renderStars = (starCount) => {
                if (!starCount) return "☆☆☆☆☆";
                return "★".repeat(starCount) + "☆".repeat(5 - starCount);
        };

        // 취소 / 반품 / 교환 신청 처리 핸들러
        const handleOrderAction = async (bId, actionType, actionLabel) => {
                if (!window.confirm(`정말 이 상품을 ${actionLabel} 하시겠습니까?`)) return;

                try {
                        // 백엔드로 상태 변경 요청 전송 (QueryString 파라미터 방식)
                        await axios.post(`http://localhost:9991/buy/status/${bId}?action=${actionType}`);
                        alert(`${actionLabel} 처리가 완료되었습니다.`);

                        // 화면 반영을 위한 상태 텍스트 매핑 변수
                        let nextStatus = "취소완료";
                        if (actionType === "RETURN") nextStatus = "반품신청";
                        if (actionType === "EXCHANGE") nextStatus = "교환신청";

                        // 취소/반품/교환 내역 탭에 실시간 추가 데이터 구성
                        const targetItem = orders.find(item => item.bId === bId);
                        if (targetItem) {
                                const updatedItem = { ...targetItem, status: nextStatus };
                                setCancelItems(prev => [updatedItem, ...prev]);
                        }

                        // 현재 주문내역 리스트에서 즉각 삭제 처리 하여 화면에서 지우기
                        setOrders(prev => prev.filter(item => item.bId !== bId));

                } catch (error) {
                        console.error(`${actionLabel} 요청 중 오류 발생:`, error);
                        alert(`${actionLabel} 처리에 실패했습니다.`);
                }
        };

        return (
                <>
                        <div className="search-bar">
                                <input type="text" placeholder="검색할 상품을 입력해주세요." />
                                <button className="search-icon"></button>
                        </div>
                        <hr />
                        {orders.map((item, index) => (
                                <div className="order-item" key={item.bId || index}>
                                        <div className="item-img">
                                                {item.product?.fileList && item.product.fileList[0] ? (
                                                        <img src={`http://localhost:9991/static/uploads/${item.product.fileList[0].filename}.${item.product.fileList[0].extname}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                        <div style={{ width: '100%', height: '100%', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#aaa' }}>이미지 준비중</div>
                                                )}
                                        </div>
                                        <div className="item-info">
                                                <span className="brand-name">
                                                        {item.product?.company?.businessName || "CANVAS"}
                                                </span>
                                                <h3 className="product-name">{item.product?.name || "상품명 정보 없음"}</h3>
                                                <p style={{ fontSize: '13px', color: '#888', margin: '4px 0' }}>수량: {item.count || 1}개</p>
                                                <p className="product-price">
                                                        {item.price ? Number(item.price.toString().replace(/[^0-9]/g, "")).toLocaleString() : 0}원

                                                </p>
                                        </div>
                                        <div className="btn-group">
                                                <span style={{ color: '#ffc107', letterSpacing: '2px' }}>
                                                        {renderStars(item.star || item.review?.star)}
                                                </span>

                                                <button className="btn-light" onClick={() => window.location.href = `/productDetail/${item.product?.pId || item.p_id}`}>
                                                        {item.star || item.review?.star ? "후기수정" : "후기작성"}
                                                </button>
                                        </div>
                                        <div className="btn-group">
                                                <span className="status-text">{item.status || "결제완료"}</span>
                                                <button className="btn-light" onClick={() => setSelectedDelivery(item)}>배송조회</button>
                                        </div>
                                        {/* 상세조회 / 주문취소 / 반품 / 교환 버튼 */}
                                        <div className="btn-group" style={{ minWidth: '110px', gap: '4px' }}>
                                                <span style={{ fontSize: '12px', textAlign: 'center', marginBottom: '2px' }}>
                                                        {item.writedate ? item.writedate.split("T")[0] : "날짜 없음"}
                                                </span>
                                                <button className="btn-dark" style={{ padding: '4px 8px', fontSize: '12px' }} onClick={() => setSelectedOrder(item)}>
                                                        상세보기
                                                </button>

                                                {/* 배송 상태에 버튼 제어 조건문 */}
                                                {item.status !== "배송완료" && item.status !== "배송 완료" && item.status !== "배송중" && item.status !== "배송 중" ? (
                                                        <button
                                                                className="btn-light"
                                                                style={{ color: '#d9534f', borderColor: '#d9534f', padding: '4px 8px', fontSize: '12px' }}
                                                                onClick={() => handleOrderAction(item.bid, "CANCEL", "주문취소")}
                                                        >
                                                                주문취소
                                                        </button>
                                                ) : (
                                                        //배송중이거나 배송완료 상태일 때는 [반품신청] 및 [교환신청] 으로 변경
                                                        <>
                                                                <button
                                                                        className="btn-light"
                                                                        style={{ color: '#f0ad4e', borderColor: '#f0ad4e', padding: '4px 8px', fontSize: '12px' }}
                                                                        onClick={() => handleOrderAction(item.bid, "RETURN", "반품신청")}
                                                                >
                                                                        반품신청
                                                                </button>
                                                                <button
                                                                        className="btn-light"
                                                                        style={{ color: '#5bc0de', borderColor: '#5bc0de', padding: '4px 8px', fontSize: '12px' }}
                                                                        onClick={() => handleOrderAction(item.bid, "EXCHANGE", "교환신청")}
                                                                >
                                                                        교환신청
                                                                </button>
                                                        </>
                                                )}
                                        </div>
                                </div>

                        ))}

                        {/* 주문 상세보기 모달 */}
                        {
                                selectedOrder && (
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
                                                                        <p>
                                                                                결제금액: {selectedOrder.price ?
                                                                                        Number(selectedOrder.price.toString().replace(/[^0-9]/g, "")).toLocaleString() : 0}원
                                                                        </p>
                                                                        <p>
                                                                                주문일시: {selectedOrder.writedate ? selectedOrder.writedate.replace("T", " ") : "정보 없음"}
                                                                        </p>
                                                                </section>
                                                                <hr />
                                                                <section>
                                                                        <h4>배송지 정보</h4>
                                                                        <p>수령인: {selectedOrder.delivery?.n_name || "정보 없음"}</p>
                                                                        <p>연락처: {selectedOrder.delivery?.n_tel || "정보 없음"}</p>
                                                                        <p>배송주소: {selectedOrder.delivery?.n_address || "정보 없음"}</p>
                                                                        <p>배송메모: {selectedOrder.delivery?.request || "없음"}</p>
                                                                </section>
                                                        </div>
                                                </div>
                                        </div>
                                )
                        }

                        {/* 배송조회 모달 */}
                        {
                                selectedDelivery && (
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
                                )
                        }
                </>
        );
};

// 일반사용자 : 취소목록
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
                        {cancelItems.map((item, index) => (
                                <div className="order-item" key={item.bId || index}>
                                        {/* 상품 이미지 출력 */}
                                        <div className="item-img">
                                                {item.product?.fileList && item.product.fileList[0] ? (
                                                        <img src={`http://localhost:9991/static/uploads/${item.product.fileList[0].filename}.${item.product.fileList[0].extname}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                        <div style={{ width: '100%', height: '100%', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#aaa' }}>이미지 준비중</div>
                                                )}
                                        </div>

                                        <div className="item-info">
                                                <span className="brand-name">{item.product?.company?.businessName || "CANVAS"}</span>
                                                <h3 className="product-name">{item.product?.name || "상품명 정보 없음"}</h3>
                                                <p style={{ fontSize: '13px', color: '#888', margin: '4px 0' }}>수량: {item.count || 1}개</p>
                                                <p className="product-price">
                                                        {item.price ? Number(item.price.toString().replace(/[^0-9]/g, "")).toLocaleString() : 0}원
                                                </p>
                                        </div>

                                        <div className="btn-group">
                                                <span className="status-text" style={{ fontWeight: 'bold', color: '#d9534f' }}>{item.status}</span>
                                                {item.status.replace(/\s/g, "") === '교환신청' && <button className="btn-light">배송조회</button>}
                                        </div>

                                        <div className="btn-group">
                                                <span style={{ fontSize: '13px', textAlign: 'center' }}>
                                                        {item.writedate ? item.writedate.split("T")[0] : "날짜 없음"}
                                                </span>
                                                <button className="btn-light" style={{ border: '1px solid #333' }} onClick={() => setSelectedCancel(item)}>
                                                        상세보기
                                                </button>
                                        </div>
                                </div>
                        ))}

                        {/* 취소/반품/교환 상세 내역 모달 */}
                        {selectedCancel && (
                                <div className="modal-overlay" onClick={closeModal}>
                                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                                <div className="modal-header">
                                                        <h2>{selectedCancel.status} 상세 내역</h2>
                                                        <button className="close-btn" onClick={closeModal}>&times;</button>
                                                </div>
                                                <div className="modal-body">
                                                        <section>
                                                                <h4>요청 정보</h4>
                                                                <p>접수일시: {selectedCancel.writedate ? selectedCancel.writedate.replace("T", " ") : "정보 없음"}</p>
                                                                <p>접수사유: {selectedCancel.cancelReason || '단순 변심 / 서비스 기준 접수'}</p>
                                                                <p>처리상태: <span style={{ color: '#d9534f', fontWeight: 'bold' }}>{selectedCancel.status}</span></p>
                                                        </section>
                                                        <hr />
                                                        <section>
                                                                <h4>환불/금액 정보</h4>
                                                                <p>환불수단: {selectedCancel.paymentMethod || '신용카드 취소'}</p>
                                                                <p>환불 예상 금액: <strong>{selectedCancel.price ? Number(selectedCancel.price.toString().replace(/[^0-9]/g, "")).toLocaleString() : 0}원</strong></p>
                                                        </section>
                                                </div>
                                        </div>
                                </div>
                        )}
                </>
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
                                                                <span className="brand-name">{item.p_id || "CANVAS"}</span>
                                                                <h3 className="product-name">{item.name}</h3>
                                                                <p className="product-price">{item.price ? Number(item.price).toLocaleString() : 0}원</p>
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

// 기업 사용자 : 판매현황
const SalesStatus = ({ sales }) => {
        if (!sales || sales.length === 0) {
                return (
                        <div className="recent-orders">
                                <table className="management-table">
                                        <tbody>
                                                <tr>
                                                        <td className="empty-row" style={{ textAlign: 'center', padding: '50px', color: '#888' }}>
                                                                현재 접수된 판매/주문 현황이 없습니다.
                                                        </td>
                                                </tr>
                                        </tbody>
                                </table>
                        </div>
                );
        }

        return (
                <div className="recent-orders">
                        <table className="management-table">
                                <thead>
                                        <tr>
                                                <th style={{ width: '15%' }}>주문일시</th>
                                                <th>상품정보</th>
                                                <th style={{ width: '10%' }}>수량</th>
                                                <th style={{ width: '18%' }}>결제금액</th>
                                                <th style={{ width: '15%' }}>주문자 ID</th>
                                                <th style={{ width: '12%', textAlign: 'center' }}>상태</th>
                                        </tr>
                                </thead>
                                <tbody>
                                        {sales.map((item, index) => {
                                                const price = item.price ? Number(item.price.toString().replace(/[^0-9]/g, "")) : 0;
                                                return (
                                                        <tr key={item.bId || index}>
                                                                {/* 주문일시 */}
                                                                <td className="order-date">
                                                                        {item.writedate ? item.writedate.split("T")[0] : "날짜 없음"}
                                                                </td>
                                                                {/* 상품명 */}
                                                                <td>
                                                                        <strong>{item.product?.name || "상품명 없음"}</strong>
                                                                </td>
                                                                {/* 수량 */}
                                                                <td>{item.count || 1}개</td>
                                                                {/* 결제금액 */}
                                                                <td className="settle-price">{price.toLocaleString()}원</td>
                                                                {/* 주문자 ID */}
                                                                <td>{item.member?.userid || `회원(${item.mId || '정보없음'})`}</td>
                                                                {/* 주문상태 뱃지 */}
                                                                <td className="text-center">
                                                                        <span className={`status-badge ${item.status === '결제완료' ? 'complete' : 'waiting'}`}>
                                                                                {item.status || "결제완료"}
                                                                        </span>
                                                                </td>
                                                        </tr>
                                                );
                                        })}
                                </tbody>
                        </table>
                </div>
        );
};

// 기업 사용자 : 상품 등록/수정
const ProductManagement = ({ products, setProducts }) => {
        const [editingId, setEditingId] = useState(null);
        const [editFormData, setEditFormData] = useState({});

        // 안전한 배열 변환 가드
        const safeProducts = Array.isArray(products) ? products : [];

        // 수정 모드 진입
        const handleEditClick = (product) => {
                setEditingId(product.pId || product.pid);
                setEditFormData({ ...product });
        };

        // 입력 데이터 체인지 핸들러
        const handleInputChange = (e) => {
                const { name, value } = e.target;
                setEditFormData({ ...editFormData, [name]: value });
        };

        // DB 수정 요청
        const handleSaveClick = async () => {
                const targetId = editingId;
                try {
                        // 백엔드로 수정 데이터 전송
                        await axios.put(`http://localhost:9991/product/seller/update/${targetId}`, editFormData);

                        // 프론트 UI 실시간 업데이트 반영
                        setProducts(products.map(p => (p.pId === targetId || p.pid === targetId) ? editFormData : p));
                        setEditingId(null);
                        alert("상품 정보가 성공적으로 수정되었습니다.");
                } catch (error) {
                        console.error("상품 수정 실패:", error);
                        alert("수정 중 오류가 발생했습니다.");
                }
        };

        // DB 삭제 요청
        const handleDeleteClick = async (pId) => {
                if (!window.confirm("정말 이 상품을 완전히 삭제하시겠습니까?\n삭제된 상품은 복구할 수 없습니다.")) return;
                try {
                        // 백엔드로 삭제 요청 보내기
                        await axios.delete(`http://localhost:9991/product/seller/delete/${pId}`);

                        // 프론트 UI에서 제외하기
                        setProducts(prev => prev.filter(p => (p.pId !== pId && p.pid !== pId)));
                        alert("상품이 삭제되었습니다.");
                } catch (error) {
                        console.error("상품 삭제 실패:", error);
                        alert("삭제 중 오류가 발생했습니다.");
                }
        };

        // 대시보드 통계 count 가 0 이하면 품절
        const totalCount = safeProducts.length;
        const activeCount = safeProducts.filter(p => (p.count || 0) > 0).length;
        const soldOutCount = totalCount - activeCount;

        return (
                <div className="sales-status-container">
                        <div className="corp-status-cards">
                                <div className="corp-status-card">
                                        <p style={{ fontSize: '13px', color: '#666' }}>전체 상품</p>
                                        <h3 style={{ fontSize: '20px', margin: '10px 0' }}>{totalCount}건</h3>
                                </div>
                                <div className="corp-status-card">
                                        <p style={{ fontSize: '13px', color: '#666' }}>판매 중</p>
                                        <h3 style={{ fontSize: '20px', margin: '10px 0', color: '#2196F3' }}>{activeCount}건</h3>
                                </div>
                                <div className="corp-status-card">
                                        <p style={{ fontSize: '13px', color: '#666' }}>품절/중지</p>
                                        <h3 style={{ fontSize: '20px', margin: '10px 0', color: '#f44336' }}>{soldOutCount}건</h3>
                                </div>
                        </div>

                        <div className="recent-orders">
                                <div className="filter-group" style={{ display: 'flex', gap: '8px' }}>
                                        {['전체', '판매중', '품절'].map((label) => (
                                                <button
                                                        key={label}
                                                        className={`filter-btn ${label === '전체' ? 'active' : ''}`}
                                                        style={{ padding: '6px 12px', fontSize: '13px', borderRadius: '4px', cursor: 'pointer' }}
                                                >
                                                        {label}
                                                </button>
                                        ))}
                                </div>
                                <button className="btn-dark" style={{ padding: '8px 20px', borderRadius: '4px' }}
                                        onClick={() => { window.location.href = "/mypage/addproduct" }}>+ 새 상품 등록
                                </button>
                        </div>

                        <div className="recent-orders">
                                <table className="management-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                                        <thead>
                                                <tr style={{ borderBottom: '2px solid #333', textAlign: 'left' }}>
                                                        <th style={{ padding: '12px' }}>상품 정보</th>
                                                        <th>판매가</th>
                                                        <th>재고</th>
                                                        <th style={{ textAlign: 'center' }}>상태</th>
                                                        <th style={{ textAlign: 'center' }}>관리</th>
                                                </tr>
                                        </thead>
                                        <tbody>
                                                {totalCount === 0 ? (
                                                        <tr><td colSpan="5" className="empty-row" style={{ textAlign: 'center', padding: '30px' }}>등록된 상품이 없습니다.</td></tr>
                                                ) : (
                                                        safeProducts.map((product, index) => {
                                                                const currentId = product.pid || product.pId || index;
                                                                const price = product.price ? Number(product.price.toString().replace(/[^0-9]/g, "")) : 0;

                                                                return (
                                                                        <tr key={currentId} style={{ borderBottom: '1px solid #eee' }}>
                                                                                {/* 상품명 및 이미지 */}
                                                                                <td style={{ padding: '12px' }}>
                                                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                                                                <div style={{ width: '40px', height: '40px', backgroundColor: '#f5f5f5', borderRadius: '4px', overflow: 'hidden' }}>
                                                                                                        {product.fileList && product.fileList[0] && (
                                                                                                                <img src={`http://localhost:9991/static/uploads/${product.fileList[0].filename}.${product.fileList[0].extname}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                                                                        )}
                                                                                                </div>

                                                                                                {editingId === currentId ? (
                                                                                                        <input className="product-edit" name="name" value={editFormData.name || ''} onChange={handleInputChange} style={{ border: '1px solid #ccc', padding: '4px' }} />
                                                                                                ) : (
                                                                                                        <span style={{ fontWeight: '500' }}>{product.name}</span>
                                                                                                )}
                                                                                        </div>
                                                                                </td>
                                                                                {/* 판매가 */}
                                                                                <td>                                                          
                                                                                                {price.toLocaleString()}원                                                  
                                                                                </td>
                                                                                {/* 재고수량 */}
                                                                                <td>
                                                                                        {editingId === currentId ? (
                                                                                                <input className="product-edit" type="number" name="count" value={editFormData.count || 0} onChange={handleInputChange} style={{ border: '1px solid #ccc', padding: '4px', width: '60px' }} />
                                                                                        ) : (
                                                                                                `${product.count || 0}개`
                                                                                        )}
                                                                                </td>
                                                                                {/* 상태 표시 (재고 기반 동적 세팅) */}
                                                                                <td className="text-center">
                                                                                        <span className={`status-badge ${(product.count || 0) <= 0 ? 'waiting' : 'complete'}`}>
                                                                                                {(product.count || 0) <= 0 ? "품절" : "판매중"}
                                                                                        </span>
                                                                                </td>
                                                                                {/* 관리 조작 버튼 */}
                                                                                <td style={{ textAlign: 'center' }}>
                                                                                        {editingId === currentId ? (
                                                                                                <>
                                                                                                        <button onClick={handleSaveClick} style={{ color: '#2196F3', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold', marginRight: '8px' }}>저장</button>
                                                                                                        <button onClick={() => setEditingId(null)} style={{ color: '#666', background: 'none', border: 'none', cursor: 'pointer' }}>취소</button>
                                                                                                </>
                                                                                        ) : (
                                                                                                <>
                                                                                                        <button onClick={() => handleEditClick(product)} style={{ background: 'none', border: 'none', color: '#666', fontSize: '12px', cursor: 'pointer', marginRight: '8px' }}>수정</button>
                                                                                                        <button onClick={() => handleDeleteClick(currentId)} style={{ background: 'none', border: 'none', color: '#f44336', fontSize: '12px', cursor: 'pointer' }}>삭제</button>
                                                                                                </>
                                                                                        )}
                                                                                </td>
                                                                        </tr>
                                                                );
                                                        })
                                                )}
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