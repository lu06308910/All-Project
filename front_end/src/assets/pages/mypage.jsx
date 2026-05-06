import React, { useState } from 'react';
import './../css/kdh.css';

// ----------------------------------------- 일반 사용자 -------------------------------------------
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
                                                {item.status === '교환 신청' && <button className="btn-light">배송조회</button>}
                                        </div>

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
                        <div className="status-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '30px' }}>
                                <div className="status-card" style={{ padding: '20px', border: '1px solid #eee', borderRadius: '8px', textAlign: 'center' }}>
                                        <p style={{ fontSize: '13px', color: '#666' }}>오늘의 매출</p>
                                        <h3 style={{ fontSize: '20px', margin: '10px 0' }}>{salesSummary.todaySales}원</h3>
                                </div>
                                <div className="status-card" style={{ padding: '20px', border: '1px solid #eee', borderRadius: '8px', textAlign: 'center' }}>
                                        <p style={{ fontSize: '13px', color: '#666' }}>이달의 누적 매출</p>
                                        <h3 style={{ fontSize: '20px', margin: '10px 0' }}>{salesSummary.monthlySales}원</h3>
                                </div>
                                <div className="status-card" style={{ padding: '20px', border: '1px solid #eee', borderRadius: '8px', textAlign: 'center' }}>
                                        <p style={{ fontSize: '13px', color: '#666' }}>배송 준비 중</p>
                                        <h3 style={{ fontSize: '20px', margin: '10px 0', color: '#2196F3' }}>{salesSummary.pendingDelivery}건</h3>
                                </div>
                                <div className="status-card" style={{ padding: '20px', border: '1px solid #eee', borderRadius: '8px', textAlign: 'center' }}>
                                        <p style={{ fontSize: '13px', color: '#666' }}>반품/교환 요청</p>
                                        <h3 style={{ fontSize: '20px', margin: '10px 0', color: '#f44336' }}>{salesSummary.returnRequests}건</h3>
                                </div>
                        </div>

                        <div className="recent-orders">
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
                                                        <td><span className="status-badge" style={{ background: '#e3f2fd', color: '#1976d2', padding: '2px 6px', borderRadius: '4px', fontSize: '12px' }}>결제완료</span></td>
                                                </tr>
                                                {/* 추가 데이터 반복 */}
                                        </tbody>
                                </table>
                        </div>
                </div>
        );
};

/* 상품 등록/관리 */
const ProductManagement = () => {
        const [products, setProducts] = useState([
                { id: 1, name: "감성 스테이 제주 A동", price: "250,000", stock: 5, status: "판매중", date: "2026-05-01" },
                { id: 2, name: "오션뷰 프라이빗 풀빌라", price: "480,000", stock: 2, status: "판매중", date: "2026-04-28" },
                { id: 3, name: "숲속 작은 오두막", price: "180,000", stock: 0, status: "품절", date: "2026-04-25" },
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
                        <div className="status-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '30px' }}>
                                <div className="status-card" style={{ padding: '20px', border: '1px solid #eee', borderRadius: '8px', textAlign: 'center' }}>
                                        <p style={{ fontSize: '13px', color: '#666' }}>전체 상품</p>
                                        <h3 style={{ fontSize: '20px', margin: '10px 0' }}>{products.length}건</h3>
                                </div>
                                <div className="status-card" style={{ padding: '20px', border: '1px solid #eee', borderRadius: '8px', textAlign: 'center' }}>
                                        <p style={{ fontSize: '13px', color: '#666' }}>판매 중</p>
                                        <h3 style={{ fontSize: '20px', margin: '10px 0', color: '#2196F3' }}>2건</h3>
                                </div>
                                <div className="status-card" style={{ padding: '20px', border: '1px solid #eee', borderRadius: '8px', textAlign: 'center' }}>
                                        <p style={{ fontSize: '13px', color: '#666' }}>품절/중지</p>
                                        <h3 style={{ fontSize: '20px', margin: '10px 0', color: '#f44336' }}>1건</h3>
                                </div>
                        </div>

                        {/* 검색 및 등록 버튼 */}
                        <div className="recent-orders" style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
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
                                 onClick={()=>{location.href="/mypage/addproduct"}}>+ 새 상품 등록
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
                                                                                        <input
                                                                                                name="name"
                                                                                                value={editFormData.name}
                                                                                                onChange={handleInputChange}
                                                                                                style={{ padding: '4px', border: '1px solid #ccc', borderRadius: '4px', width: '150px' }}
                                                                                        />
                                                                                ) : (
                                                                                        <span style={{ fontWeight: '500' }}>{product.name}</span>
                                                                                )}
                                                                        </div>
                                                                </td>

                                                                {/* 판매가 */}
                                                                <td>
                                                                        {editingId === product.id ? (
                                                                                <input
                                                                                        name="price"
                                                                                        value={editFormData.price}
                                                                                        onChange={handleInputChange}
                                                                                        style={{ padding: '4px', border: '1px solid #ccc', borderRadius: '4px', width: '80px' }}
                                                                                />
                                                                        ) : (
                                                                                `${product.price}원`
                                                                        )}
                                                                </td>

                                                                {/* 재고 */}
                                                                <td>
                                                                        {editingId === product.id ? (
                                                                                <input
                                                                                        type="number"
                                                                                        name="stock"
                                                                                        value={editFormData.stock}
                                                                                        onChange={handleInputChange}
                                                                                        style={{ padding: '4px', border: '1px solid #ccc', borderRadius: '4px', width: '50px' }}
                                                                                />
                                                                        ) : (
                                                                                `${product.stock}개`
                                                                        )}
                                                                </td>

                                                                {/* 상태 */}
                                                                <td>
                                                                        {editingId === product.id ? (
                                                                                <select
                                                                                        name="status"
                                                                                        value={editFormData.status}
                                                                                        onChange={handleInputChange}
                                                                                        style={{ padding: '4px', border: '1px solid #ccc', borderRadius: '4px' }}
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

const SettlementHistory = () => {
        const settlementData = [
                { id: 1, date: "2026-05-01", amount: "1,250,000", fee: "37,500", net: "1,212,500", status: "입금완료" },
                { id: 2, date: "2026-04-15", amount: "890,000", fee: "26,700", net: "863,300", status: "입금완료" },
                { id: 3, date: "2026-05-15", amount: "2,100,000", fee: "63,000", net: "2,037,000", status: "입금대기" },
        ];

        return (
                <div className="sales-status-container">
                        {/* 정산 요약 카드 */}
                        <div className="status-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '30px' }}>
                                <div className="status-card" style={{ padding: '20px', border: '1px solid #eee', borderRadius: '8px', textAlign: 'center', backgroundColor: '#f8f9fa' }}>
                                        <p style={{ fontSize: '13px', color: '#666' }}>이번 달 정산 예정액</p>
                                        <h3 style={{ fontSize: '20px', margin: '10px 0', color: '#333' }}>2,037,000원</h3>
                                </div>
                                <div className="status-card" style={{ padding: '20px', border: '1px solid #eee', borderRadius: '8px', textAlign: 'center' }}>
                                        <p style={{ fontSize: '13px', color: '#666' }}>올해 누적 정산액</p>
                                        <h3 style={{ fontSize: '20px', margin: '10px 0' }}>15,420,000원</h3>
                                </div>
                                <div className="status-card" style={{ padding: '20px', border: '1px solid #eee', borderRadius: '8px', textAlign: 'center' }}>
                                        <p style={{ fontSize: '13px', color: '#666' }}>적용 수수료율</p>
                                        <h3 style={{ fontSize: '20px', margin: '10px 0', color: '#666' }}>3%</h3>
                                </div>
                        </div>

                        {/* 필터 및 엑셀 다운로드 영역 */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                        <input type="month" style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ddd' }} />
                                        <button className="btn-dark" style={{ padding: '6px 12px', fontSize: '13px', borderRadius: '4px' }}>조회</button>
                                </div>
                                <button style={{ padding: '6px 12px', fontSize: '13px', borderRadius: '4px', border: '1px solid #2e7d32', color: '#2e7d32', background: 'none', cursor: 'pointer' }}>
                                        Excel 다운로드
                                </button>
                        </div>

                        {/* 정산 상세 테이블 */}
                        <div className="recent-orders">
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                                        <thead>
                                                <tr style={{ borderBottom: '2px solid #333', textAlign: 'left', backgroundColor: '#fafafa' }}>
                                                        <th style={{ padding: '12px' }}>정산일(예정)</th>
                                                        <th>총 매출액</th>
                                                        <th>서비스 수수료</th>
                                                        <th style={{ color: '#d32f2f' }}>실지급액</th>
                                                        <th style={{ textAlign: 'center' }}>지급 상태</th>
                                                </tr>
                                        </thead>
                                        <tbody>
                                                {settlementData.map(item => (
                                                        <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                                                                <td style={{ padding: '15px 12px' }}>{item.date}</td>
                                                                <td>{item.amount}원</td>
                                                                <td style={{ color: '#999' }}>- {item.fee}원</td>
                                                                <td style={{ fontWeight: 'bold' }}>{item.net}원</td>
                                                                <td style={{ textAlign: 'center' }}>
                                                                        <span style={{
                                                                                background: item.status === '입금대기' ? '#fff3e0' : '#e8f5e9',
                                                                                color: item.status === '입금대기' ? '#ef6c00' : '#2e7d32',
                                                                                padding: '4px 8px',
                                                                                borderRadius: '4px',
                                                                                fontSize: '12px',
                                                                                fontWeight: '500'
                                                                        }}>
                                                                                {item.status}
                                                                        </span>
                                                                </td>
                                                        </tr>
                                                ))}
                                        </tbody>
                                </table>
                        </div>

                        {/* 안내 문구 */}
                        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '6px', fontSize: '12px', color: '#777' }}>
                                <p>• 정산은 매월 15일과 말일에 진행됩니다.</p>
                                <p>• 실지급액은 총 매출액에서 플랫폼 수수료(3%)를 제외한 금액입니다.</p>
                                <p>• 정산 관련 문의는 고객센터를 이용해 주세요.</p>
                        </div>
                </div>
        );
};


const MyPage = () => {

        // 로그인 조건 : true - 기업 / false - 일반
        const [isCorporate] = useState(true);
        const [userName] = useState(isCorporate ? "DB(기업)" : "DB(일반)"); //

        const [activeMenu, setActiveMenu] = useState(isCorporate ? '판매 현황' : '주문내역');

        /* 마이페이지 컴포넌트 */
        const renderContent = () => {
                // 기업용 메뉴
                if (isCorporate) {
                        switch (activeMenu) {
                                case '판매 현황':
                                        return <SalesStatus />;
                                case '상품 등록/관리':
                                        return <ProductManagement />;
                                case '정산내역' :
                                        return <SettlementHistory />;
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
                        case '찜': return <WishList wishItems={wishItems} onDelete={handleDeleteWish} onDeleteAll={handleDeleteAllWish} />;
                        case '문의 내역': return <InquiryList inquiries={inquiries} />;
                        default: return <div className="empty-state">준비 중인 페이지입니다.</div>;
                }
        };

        const userMenus = ['주문내역', '취소/반품/교환 내역', '찜', '이벤트', '문의 내역'];
        const corpMenus = ['판매 현황', '상품 등록/관리', '정산 내역', '고객 문의 관리'];

        const sideMenus = isCorporate ? corpMenus : userMenus;

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

        // --------------------------------------------------마이스토어 공통 ---------------------------------------
        return (
                <div className="mypage-container">
                        <h1 className="mypage-title">마이스토어({userName} 님)</h1>

                        <section className="info-box">
                                <div className="profile-header">
                                        <div className="nickname-link">db데이터_로그인닉네임 님 〉</div>
                                        <div className="settings-icon"><a href="">⚙️</a></div>
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
                                                                <div className="stat-label">미답변 문의 〉</div>
                                                                <div className="stat-value" style={{ color: 'red' }}>2건</div>
                                                        </div>
                                                </>
                                        ) : (
                                                <>
                                                        <div className="stat-item">
                                                                <div className="stat-label">총구매 금액 〉</div>
                                                                <div className="stat-value">--원</div>
                                                        </div>
                                                        <div className="stat-item">
                                                                <div className="stat-label">쿠폰 〉</div>
                                                                <div className="stat-value">보유쿠폰 : --장</div>
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

export default MyPage;