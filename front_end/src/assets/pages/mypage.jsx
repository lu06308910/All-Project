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
                                        // 주문목록 가져올때 필요한 id
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
                                // 기업사용자 목록
                                if (logId && isCorporate) {
                                        const salesRes = await axios.get(`http://localhost:9991/buy/seller/saleslist?sellerId=${logId}`);
                                        setSalesList(salesRes.data); // 판매목록

                                        const prodRes = await axios.get(`http://localhost:9991/product/seller/list?sellerId=${logId}`);
                                        console.log("백엔드에서 받아온 데이터:", prodRes.data);
                                        console.log("현재 로그인된 기업 ID (logId):", logId);
                                        setProducts(prodRes.data); // 상품 목록, 수정

                                        const corpInqRes = await axios.get(`http://localhost:9991/question/seller/list?sellerId=${logId}`);
                                        setInquiries(corpInqRes.data); // 문의내역
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
                ? ['판매 현황', '상품 등록/관리', '정산내역', '고객문의 관리']
                : ['주문내역', '취소/반품/교환 내역', '찜', '상품문의 내역'];


        // 대시보드
        // 미답변 상품문의 카운트 (기업용 공통)
        const unansweredCount = inquiries ? inquiries.filter(inq => !inq.reply).length : 0;

        // 기업 사용자용: 오늘 들어온 주문 건수 계산
        const todayStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const todaySalesCount = salesList ? salesList.filter(item => item.writedate && item.writedate.startsWith(todayStr)).length : 0;

        //기업 사용자용: 현재 정상 판매 중인 상품 수 (재고 > 0)
        const safeProducts = Array.isArray(products) ? products : [];
        const activeProductsCount = safeProducts.filter(p => (p.count || 0) > 0).length;

        // 일반 사용자용: 총 구매 금액 합산
        const totalAmount = orders ? orders.reduce((sum, order) => {
                const priceValue = order.price || 0;
                const price = typeof priceValue === 'string'
                        ? parseInt(priceValue.replace(/[^0-9]/g, ""), 10)
                        : Number(priceValue);
                return sum + (price || 0);
        }, 0) : 0;

        // 일반 사용자용: 배송 중 및 결제 완료 상태를 묶은 배송/거래 프로세스 카운트
        const activeDeliveryCount = orders ? orders.filter(order => order.status === "배송 중" || order.status === "결제완료").length : 0;

        // 일반 사용자용: 내가 찜한 상품 카운트
        const totalWishCount = wishItems ? wishItems.length : 0;


        /* 마이페이지 컴포넌트 */
        const renderContent = () => {
                // 기업용 메뉴
                if (isCorporate) {
                        switch (activeMenu) {
                                case '판매 현황': return <SalesStatus sales={salesList} />;
                                case '상품 등록/관리': return <ProductManagement products={products} setProducts={setProducts} />;
                                case '정산내역': return <SettlementHistory sales={salesList} />
                                case '고객문의 관리': return <CorpInquiryList inquiries={inquiries} />;
                                default:
                                        return <div className="empty-state">준비 중인 기업 기능입니다.</div>;
                        }
                }

                // 일반 사용자용 메뉴
                switch (activeMenu) {
                        case '주문내역': return <OrderHistory orders={orders} setOrders={setOrders} setCancelItems={setCancelItems} />;
                        case '취소/반품/교환 내역': return <CancelHistory cancelItems={cancelItems} />;
                        case '찜': return <WishList wishItems={wishItems} onDelete={handleWishDelete} />;
                        case '상품문의 내역': return <InquiryList inquiries={inquiries} />;
                        default: return <div className="empty-state">준비 중인 페이지입니다.</div>;
                }
        };

        // 찜 삭제 함수
        const handleWishDelete = async (pid) => {
                const mId = sessionStorage.getItem("mId"); // 회원 번호 고유값

                if (!window.confirm("정말 찜 목록에서 삭제하시겠습니까?")) return;

                try {
                        // 아까 통합한 백엔드 LikeController 주소(/like/toggle)로 요청을 보냅니다.
                        const response = await axios.post("http://localhost:9991/like/toggle", {
                                userid: logId,
                                memberId: mId ? Number(mId) : null,
                                productId: Number(pid),
                                pid: Number(pid) // 컨트롤러에서 어떤 이름으로 받든 작동하도록 둘 다 전송
                        });

                        // 서버에서 처리가 잘 끝났다면 (성공 응답을 받으면)
                        if (response.status === 200) {
                                alert("찜 삭제가 완료되었습니다.");

                                // 새로고침 없이 화면에서 즉시 지워지도록 상태(State) 업데이트!
                                // 데이터 구조를 확인하여 item.product?.pId 또는 item.pid 둘 다 대응하도록 필터링합니다.
                                setWishItems(prev => prev.filter(item => {
                                        const currentPid = item.product?.pid || item.product?.pId || item.pid || item.p_id;
                                        return Number(currentPid) !== Number(pid);
                                }));
                        }
                } catch (error) {
                        console.error("찜 삭제 요청 중 오류 발생:", error);
                        alert("찜 삭제 처리에 실패했습니다.");
                }
        };

        // --------------------------------------------------마이스토어 공통 ---------------------------------------
        return (
                <div className="mypage-container">
                        <h1 className="mypage-title">마이스토어 {`(${userName}) 님`}</h1>

                        {/*  수정된 대시보드 스탯 섹션 */}
                        <section className="info-box">
                                <div className="profile-header">
                                        <div className="nickname-link">
                                                <a href={`/member/memberEdit?userid=${logId}&usertype=${usertype}`}>
                                                        {userName}님 개인정보 관리 〉
                                                </a>
                                        </div>
                                </div>
                                <div className="info-stats">
                                        {isCorporate ? (
                                                //  기업 사용자용 전용 대시보드 레이아웃
                                                <>
                                                        <div className="stat-item" onClick={() => setActiveMenu('판매 현황')} style={{ cursor: 'pointer' }}>
                                                                <div className="stat-label">오늘의 신규 주문 〉</div>
                                                                <div className="stat-value" style={{ color: todaySalesCount > 0 ? '#1976d2' : 'inherit' }}>
                                                                        {todaySalesCount}건
                                                                </div>
                                                        </div>
                                                        <div className="stat-item" onClick={() => setActiveMenu('상품 등록/관리')} style={{ cursor: 'pointer' }}>
                                                                <div className="stat-label">정상 판매중 상품 〉</div>
                                                                <div className="stat-value">{activeProductsCount}종</div>
                                                        </div>
                                                        <div className="stat-item" onClick={() => setActiveMenu('고객문의 관리')} style={{ cursor: 'pointer' }}>
                                                                <div className="stat-label">미답변 상품 문의 〉</div>
                                                                <div className="stat-value" style={{ color: unansweredCount > 0 ? '#d32f2f' : 'inherit', fontWeight: unansweredCount > 0 ? 'bold' : 'normal' }}>
                                                                        {unansweredCount}건
                                                                </div>
                                                        </div>
                                                </>
                                        ) : (
                                                // 🧑‍💻 일반 사용자용 전용 대시보드 레이아웃
                                                <>
                                                        <div className="stat-item" onClick={() => setActiveMenu('주문내역')} style={{ cursor: 'pointer' }}>
                                                                <div className="stat-label">총 누적 구매 금액 〉</div>
                                                                <div className="stat-value" style={{ fontSize: '18px' }}>
                                                                        {totalAmount.toLocaleString()}원
                                                                </div>
                                                        </div>
                                                        <div className="stat-item" onClick={() => setActiveMenu('주문내역')} style={{ cursor: 'pointer' }}>
                                                                <div className="stat-label">진행중인 주문/배송 〉</div>
                                                                <div className="stat-value">
                                                                        <span style={{ color: activeDeliveryCount > 0 ? '#2c2c2e' : '#ccc', fontWeight: activeDeliveryCount > 0 ? 'bold' : 'normal' }}>
                                                                                {activeDeliveryCount}건
                                                                        </span>
                                                                </div>
                                                        </div>
                                                        <div className="stat-item" onClick={() => setActiveMenu('찜')} style={{ cursor: 'pointer' }}>
                                                                <div className="stat-label">나의 찜 목록 〉</div>
                                                                <div className="stat-value" style={{ color: totalWishCount > 0 ? '#ffc107' : '#ccc' }}>
                                                                        {totalWishCount}개
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
        const validOrders = orders ? orders.filter(item =>
                item.status !== "취소완료" &&
                item.status !== "반품신청" &&
                item.status !== "교환신청"
        ) : [];

        if (validOrders.length === 0) {
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
        const handleOrderAction = async (item, actionType, actionLabel) => {

                console.log("전달받은 bId 값:", item);
                const bid = item.bid;

                if (!bid) {
                        console.error("주문 번호(bid)를 찾을 수 없습니다:", item);
                        alert("데이터 오류: 주문 번호를 확인해주세요.");
                        return;
                }

                if (!window.confirm(`정말 이 상품을 ${actionLabel} 하시겠습니까?`)) return;

                try {
                        // 2. 경로에 bid를 넣습니다.
                        await axios.post(`http://localhost:9991/buy/status/${bid}?action=${actionType}`);

                        alert(`${actionLabel} 처리가 완료되었습니다.`);

                        setOrders(prev => prev.filter(i => i.bid !== bid));

                } catch (error) {
                        console.error("요청 중 오류 발생:", error);
                        alert("처리에 실패했습니다.");
                }
        };

        return (
                <>
                        <div className="search-bar">
                                <input type="text" placeholder="검색할 상품을 입력해주세요." />
                                <button className="search-icon"></button>
                        </div>
                        <hr />
                        {validOrders.map((item, index) => (
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
                                        <div className="btn-group" style={{ minWidth: '110px', gap: '4px' }}>
                                                <span style={{ fontSize: '12px', textAlign: 'center', marginBottom: '2px' }}>
                                                        {item.writedate ? item.writedate.split("T")[0] : "날짜 없음"}
                                                </span>
                                                <button className="btn-dark" style={{ padding: '4px 8px', fontSize: '12px' }} onClick={() => setSelectedOrder(item)}>
                                                        상세보기
                                                </button>

                                                {item.status !== "배송완료" && item.status !== "배송 완료" && item.status !== "배송중" && item.status !== "배송 중" ? (
                                                        <button
                                                                className="btn-light"
                                                                style={{ color: '#d9534f', borderColor: '#d9534f', padding: '4px 8px', fontSize: '12px' }}
                                                                onClick={() => handleOrderAction(item, "CANCEL", "주문취소")}
                                                        >
                                                                주문취소
                                                        </button>
                                                ) : (
                                                        <>
                                                                <button
                                                                        className="btn-light"
                                                                        style={{ color: '#f0ad4e', borderColor: '#f0ad4e', padding: '4px 8px', fontSize: '12px' }}
                                                                        onClick={() => handleOrderAction(item.bId, "RETURN", "반품신청")}
                                                                >
                                                                        반품신청
                                                                </button>
                                                                <button
                                                                        className="btn-light"
                                                                        style={{ color: '#5bc0de', borderColor: '#5bc0de', padding: '4px 8px', fontSize: '12px' }}
                                                                        onClick={() => handleOrderAction(item.bId, "EXCHANGE", "교환신청")}
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
                                        {wishItems.map((item) => {
                                                // 백엔드 반환 구조에 맞춰 id 및 정보 추출 가공
                                                const currentPid = item.product?.pId || item.pid || item.p_id;
                                                const productName = item.product?.name || item.name || "상품명 없음";
                                                const productPrice = item.product?.price || item.price || 0;

                                                return (
                                                        <div className="order-item" key={currentPid}>
                                                                <div className="item-img-box">
                                                                        {item.product?.fileList && item.product.fileList.length > 0 && item.product.fileList[0] ? (
                                                                                <img
                                                                                        src={`http://localhost:9991/static/uploads/${item.product.fileList[0].filename}.${item.product.fileList[0].extname}`}
                                                                                        alt={productName}
                                                                                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                                                                />
                                                                        ) : item.fileList && item.fileList.length > 0 && item.fileList[0] ? (
                                                                                <img
                                                                                        src={`http://localhost:9991/static/uploads/${item.fileList[0].filename}.${item.fileList[0].extname}`}
                                                                                        alt={productName}
                                                                                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                                                                />
                                                                        ) : (
                                                                                <div style={{ width: '100px', height: '100px', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#999' }}>이미지 없음</div>
                                                                        )}
                                                                </div>
                                                                <div className="item-info">
                                                                        <span className="brand-name">CANVAS</span>
                                                                        <h3 className="product-name">{productName}</h3>
                                                                        <p className="product-price">{Number(productPrice).toLocaleString()}원</p>
                                                                </div>
                                                                <div className="btn-group">
                                                                        <button className="btn-dark" onClick={() => window.location.href = `/productDetail/${currentPid}`}>
                                                                                구매하기
                                                                        </button>
                                                                        <button className="btn-light" onClick={() => onDelete(currentPid)}>
                                                                                삭제
                                                                        </button>
                                                                </div>
                                                        </div>
                                                );
                                        })}
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

        const [prodFilter, setProdFilter] = React.useState('전체');

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

        // 대시보드 통계 계산 0이면 품절 됨
        const totalCount = safeProducts.length;
        const activeCount = safeProducts.filter(p => (p.count || 0) > 0).length;
        const soldOutCount = totalCount - activeCount;

        // 선택된 문자열 필터에 따라 실제 데이터 필터링
        const filteredProducts = safeProducts.filter(product => {
                const stock = product.count || 0;
                if (prodFilter === '판매중') return stock > 0;
                if (prodFilter === '품절') return stock <= 0;
                return true; // '전체'
        });

        // 각 버튼 옆에 보여줄 동적 카운트
        const getButtonCount = (label) => {
                if (label === '판매중') return activeCount;
                if (label === '품절') return soldOutCount;
                return totalCount;
        };

        return (
                <div className="sales-status-container">
                        <div className="corp-status-cards">
                                <div className="corp-status-card" onClick={() => setProdFilter('전체')} style={{ cursor: 'pointer' }}>
                                        <p style={{ fontSize: '13px', color: '#666' }}>전체 상품</p>
                                        <h3 style={{ fontSize: '20px', margin: '10px 0' }}>{totalCount}건</h3>
                                </div>
                                <div className="corp-status-card" onClick={() => setProdFilter('전체')} style={{ cursor: 'pointer' }}>
                                        <p style={{ fontSize: '13px', color: '#666' }}>판매 중</p>
                                        <h3 style={{ fontSize: '20px', margin: '10px 0', color: '#2196F3' }}>{activeCount}건</h3>
                                </div>
                                <div className="corp-status-card" onClick={() => setProdFilter('전체')} style={{ cursor: 'pointer' }}>
                                        <p style={{ fontSize: '13px', color: '#666' }}>품절/중지</p>
                                        <h3 style={{ fontSize: '20px', margin: '10px 0', color: '#f44336' }}>{soldOutCount}건</h3>
                                </div>
                        </div>

                        <div className="recent-orders">
                                <div className="filter-group" style={{ display: 'flex', gap: '8px' }}>
                                        {['전체', '판매중', '품절'].map((label) => (
                                                <button
                                                        key={label}
                                                        className={`filter-btn ${prodFilter === label ? 'active' : ''}`}
                                                        onClick={() => setProdFilter(label)}
                                                        style={{ padding: '6px 12px', fontSize: '13px', borderRadius: '4px', cursor: 'pointer' }}
                                                >
                                                        {label} ({getButtonCount(label)})
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
                                                {filteredProducts.length === 0 ? (
                                                        <tr><td colSpan="5" className="empty-row" style={{ textAlign: 'center', padding: '30px', color: '#888' }}>조회 내역이 존재하지 않습니다.</td></tr>
                                                ) : (
                                                        filteredProducts.map((product, index) => {
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

// 기업 사용자 : 정산내역
const SettlementHistory = ({ sales }) => {

        const safeSales = Array.isArray(sales) ? sales : [];

        // 필터 상태 관리 ('ALL': 전체, 'WAITING': 정산예정, 'COMPLETE': 정산완료)
        const [filterStatus, setFilterStatus] = React.useState('ALL')

        // 정산 완료 총액 계산
        const totalCompletedAmount = safeSales
                .filter(item => item.settleStatus === 'COMPLETE')
                .reduce((sum, item) => {
                        const price = item.price ? Number(item.price.toString().replace(/[^0-9]/g, "")) : 0;
                        const total = price * (item.count || 1);
                        return sum + (total - Math.floor(total * 0.1));
                }, 0);

        // 정산 예정 총액 계산
        const totalWaitingAmount = safeSales
                .filter(item => item.settleStatus !== 'COMPLETE') // COMPLETE가 아닌 것들 (WAITING 포함)
                .reduce((sum, item) => {
                        const price = item.price ? Number(item.price.toString().replace(/[^0-9]/g, "")) : 0;
                        const total = price * (item.count || 1);
                        return sum + (total - Math.floor(total * 0.1));
                }, 0);

        // 선택된 필터 버튼에 따라 데이터 나누기
        const filteredSales = safeSales.filter(item => {
                if (filterStatus === '정산완료') return item.settleStatus === 'COMPLETE';
                if (filterStatus === '정산예정') return item.settleStatus !== 'COMPLETE';
                return true; // '전체'
        });

        // 각 정산 버튼 옆에 카운트 매핑
        const getButtonCount = (label) => {
                if (label === '정산완료') return safeSales.filter(item => item.settleStatus === 'COMPLETE').length;
                if (label === '정산예정') return safeSales.filter(item => item.settleStatus !== 'COMPLETE').length;
                return safeSales.length;
        };

        return (
                <div className="sales-status-container">
                        {/* 정산 대시보드 */}
                        <div className="corp-status-cards">
                                <div className="corp-status-card" onClick={() => setFilterStatus('전체')} style={{ cursor: 'pointer' }}>
                                        <p style={{ fontSize: '13px', color: '#666' }}>정산 대상 건수</p>
                                        <h3 style={{ fontSize: '20px', margin: '10px 0' }}>{safeSales.length}건</h3>
                                </div>
                                <div className="corp-status-card" onClick={() => setFilterStatus('전체')} style={{ cursor: 'pointer' }}>
                                        <p style={{ fontSize: '13px', color: '#666' }}>정산 완료 금액</p>
                                        <h3 style={{ fontSize: '20px', margin: '10px 0', color: '#4CAF50' }}>
                                                {totalCompletedAmount.toLocaleString()}원
                                        </h3>
                                </div>
                                <div className="corp-status-card" onClick={() => setFilterStatus('전체')} style={{ cursor: 'pointer' }}>
                                        <p style={{ fontSize: '13px', color: '#666' }}>정산 예정 금액</p>
                                        <h3 style={{ fontSize: '20px', margin: '10px 0', color: '#FF9800' }}>
                                                {totalWaitingAmount.toLocaleString()}원
                                        </h3>
                                </div>
                        </div>

                        {/* 탭/필터 버튼 영역 (css는 기존 filter-btn 그룹 스타일 활용) */}
                        <div className="recent-orders" style={{ marginTop: '25px', marginBottom: '10px' }}>
                                <div className="filter-group" style={{ display: 'flex', gap: '8px' }}>
                                        {['전체', '정산예정', '정산완료'].map((label) => (
                                                <button
                                                        key={label}
                                                        className={`filter-btn ${filterStatus === label ? 'active' : ''}`}
                                                        onClick={() => setFilterStatus(label)}
                                                        style={{ padding: '6px 12px', fontSize: '13px', borderRadius: '4px', cursor: 'pointer' }}
                                                >
                                                        {label} ({getButtonCount(label)})
                                                </button>
                                        ))}
                                </div>
                        </div>

                        {/* 정산 상세 내역 테이블 */}
                        <div className="recent-orders" style={{ marginTop: '20px' }}>
                                <table className="management-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                                        <thead>
                                                <tr style={{ borderBottom: '2px solid #333', textAlign: 'left' }}>
                                                        <th style={{ padding: '12px', width: '35%' }}>판매 상품명</th>
                                                        <th style={{ width: '10%' }}>수량</th>
                                                        <th style={{ width: '15%' }}>총 판매금액</th>
                                                        <th style={{ width: '15%' }}>수수료(10%)</th>
                                                        <th style={{ width: '15%' }}>정산 예정금액</th>
                                                        <th style={{ width: '10%', textAlign: 'center' }}>상태</th>
                                                </tr>
                                        </thead>
                                        <tbody>
                                                {filteredSales.length > 0 ? (
                                                        filteredSales.map((item, index) => {
                                                                const currentId = item.bId || index;

                                                                const price = item.price ? Number(item.price.toString().replace(/[^0-9]/g, "")) : 0;
                                                                const buyCount = item.count || 1;
                                                                const totalOrderPrice = price * buyCount;

                                                                const fee = Math.floor(totalOrderPrice * 0.1);
                                                                const settlePrice = totalOrderPrice - fee;

                                                                const isPaid = item.settleStatus === 'COMPLETE';

                                                                return (
                                                                        <tr key={currentId} style={{ borderBottom: '1px solid #eee' }}>
                                                                                <td style={{ padding: '12px' }}>
                                                                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                                                                <strong style={{ color: '#333' }}>{item.product?.name || "상품명 정보 없음"}</strong>
                                                                                                <span style={{ fontSize: '11px', color: '#999', marginTop: '2px' }}>
                                                                                                        주문일: {item.writedate ? item.writedate.split("T")[0] : "-"}
                                                                                                </span>
                                                                                        </div>
                                                                                </td>
                                                                                <td>{buyCount}개</td>
                                                                                <td>{totalOrderPrice.toLocaleString()}원</td>
                                                                                <td className="fee-text" style={{ color: '#f44336' }}>-{fee.toLocaleString()}원</td>
                                                                                <td className="settle-price" style={{ fontWeight: 'bold', color: isPaid ? '#4CAF50' : '#2196F3' }}>
                                                                                        {settlePrice.toLocaleString()}원
                                                                                </td>
                                                                                <td className="text-center">
                                                                                        {isPaid ? (
                                                                                                <span className="status-badge complete" style={{ backgroundColor: '#e8f5e9', color: '#4caf50', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>
                                                                                                        정산완료
                                                                                                </span>
                                                                                        ) : (
                                                                                                <span className="status-badge waiting" style={{ backgroundColor: '#fff3e0', color: '#ff9800', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>
                                                                                                        정산예정
                                                                                                </span>
                                                                                        )}
                                                                                </td>
                                                                        </tr>
                                                                );
                                                        })
                                                ) : (
                                                        <tr>
                                                                <td colSpan="6" className="empty-row" style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                                                                        판매 완료 내역이 없어 정산 대상 데이터가 존재하지 않습니다.
                                                                </td>
                                                        </tr>
                                                )}
                                        </tbody>
                                </table>
                        </div>
                </div>
        );
};

// 기업사용자 : 상품 문의 관리
const CorpInquiryList = ({ inquiries }) => {
        const [expandedId, setExpandedId] = useState(null);
        const [replyText, setReplyText] = useState(""); // 기업 답변 입력 상태

        // 문의 열고 닫기 토글
        const toggleInquiry = (id, currentReply) => {
                if (expandedId === id) {
                        setExpandedId(null);
                        setReplyText("");
                } else {
                        setExpandedId(id);
                        setReplyText(currentReply || ""); // 기존 답변이 있으면 로드
                }
        };

        // 백엔드로 답변 등록 요청 전송
        const handleReplySubmit = async (id) => {
                if (!replyText.trim()) {
                        alert("답변 내용을 입력해 주세요.");
                        return;
                }
                try {
                        // 백엔드 /question 컨트롤러의 PUT 주소로 데이터 전송
                        await axios.put(`http://localhost:9991/question/seller/reply/${id}`, {
                                reply: replyText
                        });
                        alert("상품 문의 답변이 성공적으로 등록되었습니다.");
                        window.location.reload(); // 등록 후 리스트 새로고침
                } catch (error) {
                        console.error("답변 등록 중 에러 발생:", error);
                        alert("답변을 저장하지 못했습니다.");
                }
        };

        return (
                <div className="inquiry-list-wrapper">
                        <table className="management-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                                <thead>
                                        <tr style={{ borderBottom: '2px solid #333', textAlign: 'left' }}>
                                                <th style={{ padding: '12px', width: '8%' }}>번호</th>
                                                <th style={{ width: '25%' }}>문의 상품명</th>
                                                <th>문의 제목</th>
                                                <th style={{ width: '12%' }}>작성자</th>
                                                <th style={{ width: '15%' }}>등록일</th>
                                                <th style={{ width: '12%', textAlign: 'center' }}>상태</th>
                                        </tr>
                                </thead>
                                <tbody>
                                        {inquiries.length === 0 ? (
                                                <tr><td colSpan="6" className="empty-row" style={{ textAlign: 'center', padding: '30px', color: '#888' }}>접수된 상품 문의가 존재하지 않습니다.</td></tr>
                                        ) : (
                                                inquiries.map((item, index) => {
                                                        const currentId = item.id; // PaskEntity의 id
                                                        const isReplied = !!item.reply; // reply 필드가 있으면 답변완료
                                                        const writerName = item.member?.userid;
                                                        const productName = item.product?.name;

                                                        return (
                                                                <React.Fragment key={currentId || index}>
                                                                        <tr onClick={() => toggleInquiry(currentId, item.reply)} style={{ borderBottom: '1px solid #eee', cursor: 'pointer' }}>
                                                                                <td style={{ padding: '12px' }}>{currentId}</td>
                                                                                <td style={{ fontWeight: '500', color: '#0d47a1' }}>{productName}</td>
                                                                                <td className="inquiry-title-cell">{item.subject}</td>
                                                                                <td>{writerName}</td>
                                                                                <td>{item.writedate ? item.writedate.split('T')[0] : "-"}</td>
                                                                                <td className="text-center">
                                                                                        <span className={`status-badge ${isReplied ? 'complete' : 'waiting'}`}
                                                                                                style={{ backgroundColor: isReplied ? '#e8f5e9' : '#fff3e0', color: isReplied ? '#4caf50' : '#ff9800', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>
                                                                                                {isReplied ? "답변완료" : "답변대기"}
                                                                                        </span>
                                                                                </td>
                                                                        </tr>

                                                                        {/* 클릭 시 활성화되는 상세 답변 영역 */}
                                                                        {expandedId === currentId && (
                                                                                <tr className="inquiry-detail-row" style={{ backgroundColor: '#fafafa' }}>
                                                                                        <td colSpan="6" style={{ padding: '20px' }}>
                                                                                                <div className="question-box" style={{ marginBottom: '15px' }}>
                                                                                                        <strong style={{ color: '#e64a19', display: 'block', marginBottom: '6px' }}>Q. 고객 문의 내용</strong>
                                                                                                        <p style={{ whiteSpace: 'pre-wrap', color: '#333', margin: 0 }}>{item.context}</p>
                                                                                                </div>

                                                                                                <div className="reply-admin-box" style={{ marginTop: '15px', borderTop: '1px dashed #ccc', paddingTop: '15px' }}>
                                                                                                        <strong style={{ color: '#1976d2', display: 'block', marginBottom: '6px' }}>A. 판매자 답변 작성</strong>
                                                                                                        <div style={{ display: 'flex', gap: '10px' }}>
                                                                                                                <textarea
                                                                                                                        style={{ flex: 1, minHeight: '80px', padding: '10px', borderRadius: '4px', border: '1px solid #ddd', resize: 'vertical' }}
                                                                                                                        placeholder="고객님께 노출될 답변 내용을 친절하게 작성해 주세요."
                                                                                                                        value={replyText}
                                                                                                                        onChange={(e) => setReplyText(e.target.value)}
                                                                                                                />
                                                                                                                <button
                                                                                                                        className="btn-dark"
                                                                                                                        style={{ width: '100px', backgroundColor: '#333', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                                                                                                                        onClick={() => handleReplySubmit(currentId)}
                                                                                                                >
                                                                                                                        답변등록
                                                                                                                </button>
                                                                                                        </div>
                                                                                                </div>
                                                                                        </td>
                                                                                </tr>
                                                                        )}
                                                                </React.Fragment>
                                                        );
                                                })
                                        )}
                                </tbody>
                        </table>
                </div>
        );
};


export default MyPage;