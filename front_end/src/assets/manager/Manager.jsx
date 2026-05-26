import { useEffect, useState } from 'react'
import './../css/gayoung.css'
import './../css/top.css'
import './../css/kdh.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
        Chart as ChartJS,
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend,
        BarElement,
        ArcElement
} from 'chart.js';
import axios from 'axios';
ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        ArcElement,
        Title,
        BarElement,
        Tooltip,
        Legend
);

// ──────────────────────────────────────────────
// Reservation 컴포넌트 (Manager 바깥으로 분리)
// ──────────────────────────────────────────────
function Reservation({ reservedEvents, selectedEventIds, handleEventCheck, handleBulkEventDelete, handleEventDelete, handleEventEditClick, setEventModalOpen }) {
        return (
                <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                        <h4 style={{ textAlign: 'left', fontWeight: '600' }}>예약 게시글 목록</h4>
                        <hr />
                        <button className='button' style={{ border: '1px solid blue', backgroundColor: 'blue', marginLeft: '10px' }} onClick={handleBulkEventDelete}>선택삭제</button>
                        <table className="table table-bordered" style={{ width: '100%', textAlign: 'center', border: '1px solid #787878', marginTop: '20px' }}>
                                <thead>
                                        <tr style={{ fontSize: '0.8em' }}>
                                                <th style={{ backgroundColor: '#eeeeee' }}>일괄삭제</th>
                                                <th style={{ backgroundColor: '#eeeeee' }}>카테고리</th>
                                                <th style={{ backgroundColor: '#eeeeee' }}>이벤트명</th>
                                                <th style={{ backgroundColor: '#eeeeee' }}>등록시간</th>
                                                <th style={{ backgroundColor: '#eeeeee' }}>예약시간</th>
                                                <th style={{ backgroundColor: '#eeeeee' }}>발행상태</th>
                                                <th style={{ backgroundColor: '#eeeeee' }}>목록 수정/삭제</th>
                                        </tr>
                                </thead>
                                <tbody>
                                {reservedEvents.map((item) => (
                                        <tr key={item.e_id}>
                                                <td style={{ fontSize: '0.8em', textAlign: 'center', verticalAlign: 'middle' }}>
                                                        <input type="checkbox"
                                                                checked={selectedEventIds.includes(item.e_id)}
                                                                onChange={() => handleEventCheck(item.e_id)}
                                                        />
                                                </td>
                                                <td style={{ fontSize: '0.8em', textAlign: 'center', verticalAlign: 'middle' }}>{item.product?.b_category}〉{item.product?.scategory}</td>
                                                <td style={{ fontSize: '0.8em', textAlign: 'center', verticalAlign: 'middle' }}>
                                                        <div style={{ width: '90%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                                {item.subject}
                                                        </div>
                                                </td>
                                                <td style={{ fontSize: '0.8em', textAlign: 'center', verticalAlign: 'middle' }}>{item.writedate?.slice(0, 10)}</td>
                                                <td style={{ fontSize: '0.8em', textAlign: 'center', verticalAlign: 'middle' }}>{item.updatedate?.slice(0, 10)}</td>
                                                <td>
                                                        <span style={{
                                                                background: item.upload == "N" ? '#ffebee' : '#e3f2fd',
                                                                color: item.upload == "N" ? '#c62828' : '#1976d2',
                                                                padding: '2px 6px', borderRadius: '4px', fontSize: '12px',
                                                                textAlign: 'center', verticalAlign: 'middle'
                                                        }}>
                                                                {item.upload == "N" ? '미공개' : '공개'}
                                                        </span>
                                                </td>
                                                <td>
                                                        <button className='button2' style={{ marginRight: '10px' }} onClick={() => handleEventEditClick(item)}>수정</button>
                                                        <button className='button2' onClick={() => handleEventDelete(item.e_id)}>삭제</button>
                                                </td>
                                        </tr>
                                ))}
                                </tbody>
                        </table>
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                <button style={{ backgroundColor: 'white', border: '0px', textDecoration: 'underline', textAlign: 'left', fontSize: '0.8em' }}>
                                        더보기
                                </button>
                                <button className='button' style={{ border: '1px solid blue', backgroundColor: 'blue' }}
                                        onClick={() => setEventModalOpen(true)}
                                >
                                        게시글등록
                                </button>
                        </div>
                </div>
        );
}

// ──────────────────────────────────────────────
// Event 컴포넌트 (Manager 바깥으로 분리)
// ──────────────────────────────────────────────
function EventList({ activeMenu, events, endedEvents, selectedEventIds, handleEventCheck, handleBulkEventDelete, handleEventDelete, handleEventEditClick, setEventModalOpen }) {
        return (
                <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                        <h4 style={{
                                textAlign: 'left', fontWeight: '600',
                                marginTop: activeMenu === '-이벤트 관리' ? '0px' : '20px',
                        }}>
                                진행 중인 이벤트
                        </h4>
                        <hr />
                        <button className='button' style={{ border: '1px solid blue', backgroundColor: 'blue', marginLeft: '10px' }} onClick={handleBulkEventDelete}>선택삭제</button>
                        <table className="table table-bordered" style={{ width: '100%', textAlign: 'center', border: '1px solid #787878', marginTop: '20px' }}>
                                <thead>
                                        <tr style={{ fontSize: '0.8em' }}>
                                                <th style={{ backgroundColor: '#eeeeee' }}>일괄삭제</th>
                                                <th style={{ backgroundColor: '#eeeeee' }}>카테고리</th>
                                                <th style={{ backgroundColor: '#eeeeee' }}>이벤트명</th>
                                                <th style={{ backgroundColor: '#eeeeee' }}>시작기간</th>
                                                <th style={{ backgroundColor: '#eeeeee' }}>종료기간</th>
                                                <th style={{ backgroundColor: '#eeeeee' }}>발행상태</th>
                                                <th style={{ backgroundColor: '#eeeeee' }}>목록 수정/삭제</th>
                                        </tr>
                                </thead>
                                <tbody>
                                {events
                                        .filter((item) => item.upload == 'Y')
                                        .map((item) => (
                                                <tr key={item.e_id}>
                                                        <td style={{ fontSize: '0.8em', textAlign: 'center', verticalAlign: 'middle' }}>
                                                                <input type="checkbox"
                                                                        aria-label="항목 선택"
                                                                        checked={selectedEventIds.includes(item.e_id)}
                                                                        onChange={() => handleEventCheck(item.e_id)}
                                                                />
                                                        </td>
                                                        <td style={{ fontSize: '0.8em', textAlign: 'center', verticalAlign: 'middle' }}>{item.product?.b_category}〉{item.product?.scategory}</td>
                                                        <td style={{ fontSize: '0.8em', textAlign: 'center', verticalAlign: 'middle' }}>
                                                                <div style={{ width: '90%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                                        {item.subject}
                                                                </div>
                                                        </td>
                                                        <td style={{ fontSize: '0.8em', textAlign: 'center', verticalAlign: 'middle' }}>{item.updatedate?.slice(0, 10)}</td>
                                                        <td style={{ fontSize: '0.8em', textAlign: 'center', verticalAlign: 'middle' }}>{item.enddate?.slice(0, 10)}</td>
                                                        <td>
                                                                <span style={{
                                                                        background: item.upload == 'N' ? '#ffebee' : '#e3f2fd',
                                                                        color: item.upload == 'N' ? '#c62828' : '#1976d2',
                                                                        padding: '2px 6px', borderRadius: '4px', fontSize: '12px',
                                                                        textAlign: 'center', verticalAlign: 'middle'
                                                                }}>
                                                                        {item.upload == 'N' ? '비공개' : '공개'}
                                                                </span>
                                                        </td>
                                                        <td>
                                                                <button className='button2' style={{ marginRight: '10px' }} onClick={() => handleEventEditClick(item)}>수정</button>
                                                                <button className='button2' onClick={() => handleEventDelete(item.e_id)}>삭제</button>
                                                        </td>
                                                </tr>
                                        ))}
                                </tbody>
                        </table>
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                <button style={{ backgroundColor: 'white', border: '0px', textDecoration: 'underline', textAlign: 'left', fontSize: '0.8em' }}>
                                        더보기
                                </button>
                                <button className='button' style={{ border: '1px solid blue', backgroundColor: 'blue' }}
                                        onClick={() => setEventModalOpen(true)}
                                >
                                        게시글등록
                                </button>
                        </div>
                        <h4 style={{ textAlign: 'left', fontWeight: '600', marginTop: '20px' }}>마무리 된 이벤트</h4>
                        <hr />
                        <button className='button' style={{ border: '1px solid blue', backgroundColor: 'blue', marginLeft: '10px' }}
                                onClick={handleBulkEventDelete}
                        >
                                선택삭제
                        </button>
                        <table className="table table-bordered" style={{ width: '100%', textAlign: 'center', border: '1px solid #787878', marginTop: '20px' }}>
                                <thead>
                                        <tr style={{ fontSize: '0.8em' }}>
                                                <th style={{ backgroundColor: '#eeeeee' }}>일괄삭제</th>
                                                <th style={{ backgroundColor: '#eeeeee' }}>카테고리</th>
                                                <th style={{ backgroundColor: '#eeeeee' }}>이벤트명</th>
                                                <th style={{ backgroundColor: '#eeeeee' }}>시작기간</th>
                                                <th style={{ backgroundColor: '#eeeeee' }}>종료기간</th>
                                                <th style={{ backgroundColor: '#eeeeee' }}>발행상태</th>
                                                <th style={{ backgroundColor: '#eeeeee' }}>목록 수정/삭제</th>
                                        </tr>
                                </thead>
                                <tbody>
                                {endedEvents.map((item) => (
                                        <tr key={item.e_id}>
                                                <td style={{ fontSize: '0.8em', textAlign: 'center', verticalAlign: 'middle' }}>
                                                        <input type="checkbox"
                                                                checked={selectedEventIds.includes(item.e_id)}
                                                                onChange={() => handleEventCheck(item.e_id)}
                                                        />
                                                </td>
                                                <td style={{ fontSize: '0.8em', textAlign: 'center', verticalAlign: 'middle' }}>{item.product?.b_category}〉{item.product?.scategory}</td>
                                                <td style={{ fontSize: '0.8em', textAlign: 'center', verticalAlign: 'middle' }}>
                                                        <div style={{ width: '90%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                                {item.subject}
                                                        </div>
                                                </td>
                                                <td style={{ fontSize: '0.8em', textAlign: 'center', verticalAlign: 'middle' }}>{item.updatedate?.slice(0, 10)}</td>
                                                <td style={{ fontSize: '0.8em', textAlign: 'center', verticalAlign: 'middle' }}>{item.enddate?.slice(0, 10)}</td>
                                                <td>
                                                        <span style={{
                                                                background: item.upload == 'N' ? '#ffebee' : '#e3f2fd',
                                                                color: item.upload == 'N' ? '#c62828' : '#1976d2',
                                                                padding: '2px 6px', borderRadius: '4px', fontSize: '12px',
                                                                textAlign: 'center', verticalAlign: 'middle'
                                                        }}>
                                                                {item.upload == 'N' ? '비공개' : '공개'}
                                                        </span>
                                                </td>
                                                <td>
                                                        <button className='button2' style={{ marginRight: '10px' }} onClick={() => handleEventEditClick(item)}>수정</button>
                                                        <button className='button2' onClick={() => handleEventDelete(item.e_id)}>삭제</button>
                                                </td>
                                        </tr>
                                ))}
                                </tbody>
                        </table>
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                <button style={{ backgroundColor: 'white', border: '0px', textDecoration: 'underline', textAlign: 'left', fontSize: '0.8em' }}>
                                        더보기
                                </button>
                                <button className='button' style={{ border: '1px solid blue', backgroundColor: 'blue' }}
                                        onClick={() => setEventModalOpen(true)}
                                >
                                        게시글등록
                                </button>
                        </div>
                </div>
        );
}

function Manager() {
        //게시글관리
        const [events, setEvents] = useState([]);
        useEffect(() => {
                axios.get('http://192.168.4.60:9991/event/all')
                        .then(res => setEvents(res.data))
                        .catch(err => console.log(err));
        }, []);
        const today = new Date();
        today.setHours(0, 0, 0, 0); //자정 기준

        //예약
        const reservedEvents = events.filter((item) => {
                const updatedate = item.updatedate ? new Date(item.updatedate) : null;
                return updatedate && updatedate > today;
        })
        //기간 후 종료 전환
        const endedEvents = events.filter((item) => {
                const enddate = item.enddate ? new Date(item.enddate) : null;
                return enddate && enddate < today && item.upload == 'N';
        })

        //회원 업데이트
        const [users, setUsers] = useState([]);
        useEffect(() => {
                axios.get('http://192.168.4.60:9991/member/all/member')
                        .then(res => setUsers(res.data))
                        .catch(err => console.log(err));
        }, []);


        //상품관리
        const [products, setProducts] = useState([]);
        useEffect(() => {
                axios.get('http://192.168.4.60:9991/all/product')
                        .then(res => setProducts(res.data))
                        .catch(err => console.log(err));
        }, []);

        //문의
        const [asks, setAsks] = useState([]);
        const [selectedInquiry, setSelectedInquiry] = useState(null); // 답변 작성용 선택된 문의
        const [replyText, setReplyText] = useState("");              // 관리자가 작성하는 답변 내용

        // 문의 목록 함수-------------------------------------------------------------------------- 대호수정
        const getAdminInquiries = () => {
                axios.get('http://192.168.4.60:9991/support/list/all')
                        .then(res => setAsks(res.data || []))
                        .catch(err => console.log("문의 목록 갱신 에러:", err));
        };

        useEffect(() => {
                getAdminInquiries();
        }, []);

        // 관리자가 작성한 답변 서버로 전송하기 - 대호
        const handleAdminReplySubmit = (sId) => {
                if (!replyText.trim()) {
                        alert("답변 내용을 입력해주세요.");
                        return;
                }

                // 마이페이지 데이터 구조Entity에 맞게 파라미터 맵핑해서 전송
                const formData = new FormData();
                formData.append("s_id", sId);
                formData.append("answer", replyText);

                axios.post("http://192.168.4.60:9991/support/reply", formData)
                        .then((res) => {
                                if (res.data === "success") {
                                        alert("답변이 성공적으로 등록되었습니다.");
                                        setReplyText("");
                                        setSelectedInquiry(null); // 모달 팝업 닫기
                                        getAdminInquiries();      // 문의 목록 실시간 새로고침
                                }
                        })
                        .catch(err => {
                                console.log("관리자 답변 등록 에러:", err);
                                alert("답변 저장에 실패했습니다. 백엔드 서버 콘솔을 확인해 보세요.");
                        });
        };

        //통계용 buy테이블 연결
        const [buys, setBuys] = useState([]);
        useEffect(() => {
                axios.get('http://192.168.4.60:9991/buy/list/all')
                        .then(res => setBuys(res.data))
                        .catch(err => console.log(err));
        }, []);
        //통계 서치 키워드
        const [buySearchKey, setBuySearchKey] = useState('name');
        const [buySearchWord, setBuySearchWord] = useState('');
        const [selectedBuyItem, setSelectedBuyItem] = useState(null);
        // 통계 내용 분석 및 가져오기 (pId 별로만 묶기)
        const dateGrouped = buys.reduce((acc, item) => {
                const resolvedPId = item.pid ?? item.pId ?? item.p_id; // pid 우선
                const key = resolvedPId;
                const date = item.writedate?.slice(0, 10) || '';
                if (!acc[key]) {
                        acc[key] = {
                                pId: resolvedPId,
                                product: item.product,
                                writedate: date,
                                latestDate: date,
                                totalCount: 0,
                                totalPrice: 0,
                                totalDiscount: 0,
                                rawItems: [],
                        };
                }
                // 가장 최근 날짜로 갱신
                if (date > acc[key].latestDate) acc[key].latestDate = date;
                acc[key].totalCount += item.count || 0;
                acc[key].totalPrice += parseInt(item.price || 0) * (item.count || 0);
                acc[key].totalDiscount += item.discount || 0;
                acc[key].rawItems.push(item);
                return acc;
        }, {});
        const groupedList = Object.values(dateGrouped).sort((a, b) => b.latestDate.localeCompare(a.latestDate));
        const [activeMenu, setActiveMenu] = useState('대시보드');
        const [isPostOpen, setIsPostOpen] = useState(false);
        const [modalOpen, setModalOpen] = useState(false);
        const [chartOpen, setChartOpen] = useState(false);
        const [currentPage, setCurrentPage] = useState(1);
        const [currentPage2, setCurrentPage2] = useState(1);
        const [currentPage3, setCurrentPage3] = useState(1);
        // 상품 관리 인라인 수정 전용 state
        const [proEditingId, setProEditingId] = useState(null);
        const [proEditForm, setProEditForm] = useState({});
        const [openId, setOpenId] = useState(null); // 현재 열려있는 게시글의 ID 저장
        //선택 변수 저장
        const [selectedItems, setSelectedItems] = useState({});
        const [selectedProIds, setSelectedProIds] = useState([]);

        const [companys, setCompanys] = useState([]);
        useEffect(() => {
                axios.get('http://192.168.4.60:9991/member/all/business')
                        .then(res => setCompanys(res.data))
                        .catch(err => console.log(err));
        }, []);

        //회원 집계 변수
        const memberDateGrouped = [...users, ...companys].reduce((acc, member) => {
                const date = member.writedate?.slice(0, 10) || '';
                if (!acc[date]) {
                        acc[date] = { date, normalCount: 0, companyCount: 0 };
                }
                if (member.usertype === 'BUSINESS') {
                        acc[date].companyCount += 1;
                } else {
                        acc[date].normalCount += 1;
                }
                return acc;
        }, {});
        const memberDateList = Object.values(memberDateGrouped)
                .sort((a, b) => b.date.localeCompare(a.date));




        //체크박스 변경 핸들러
        const handleCheck = (menu, id) => {
                setSelectedItems(prev => {
                        const currentSet = new Set(prev[menu] || []);
                        if (currentSet.has(id)) currentSet.delete(id);
                        else currentSet.add(id);
                        return { ...prev, [menu]: Array.from(currentSet) };
                });
        };

        const handleProCheck = (pid) => {
                setSelectedProIds(prev =>
                        prev.includes(pid) ? prev.filter(id => id !== pid) : [...prev, pid]
                );
        };

        //날짜 변수
        const [startDate, setStartDate] = useState('');
        const [endDate, setEndDate] = useState('');
        const [productStartDate, setProductStartDate] = useState('');
        const [productEndDate, setProductEndDate] = useState('');
        const [statsStartDate, setStatsStartDate] = useState('');
        const [statsEndDate, setStatsEndDate] = useState('');

        //통계 날짜 선택 프리셋
        const handleDateStatsPreset = (period, value) => {
                const today = new Date();
                const start = new Date();
                setStatsEndDate(formatDate(today));
                if (period === 'day') {
                        setStatsStartDate(formatDate(today));
                } else if (period === 'week') {
                        start.setDate(today.getDate() - 7);
                        setStatsStartDate(formatDate(start));
                } else if (period === 'month') {
                        start.setMonth(today.getMonth() - value);
                        setStatsStartDate(formatDate(start));
                } else if (period === 'year') {
                        start.setFullYear(today.getFullYear() - 1);
                        setStatsStartDate(formatDate(start));
                }
        }
        // 통계 테이블: 날짜/검색어 필터 없으면 pId 오름차순 전체 표시
        const filteredGroupedList = groupedList
                .filter(item => {
                        if (statsStartDate || statsEndDate) {
                                const hasMatch = item.rawItems.some(buy => {
                                        const d = buy.writedate?.slice(0, 10) || '';
                                        if (statsStartDate && d < statsStartDate) return false;
                                        if (statsEndDate && d > statsEndDate) return false;
                                        return true;
                                });
                                if (!hasMatch) return false;
                        }
                        if (!buySearchWord || !buySearchKey) return true;
                        if (buySearchKey === 'name')
                                return item.product?.name?.includes(buySearchWord);
                        if (buySearchKey === 'businessName')
                                return item.product?.company?.businessName?.includes(buySearchWord);
                        return true;
                })
                .sort((a, b) => a.pId - b.pId);

        // 일자별 전체 매출 집계
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);
        const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().slice(0, 10);

        const dailySalesMap = buys.reduce((acc, item) => {
                const date = item.writedate?.slice(0, 10) || '';
                if (!date) return acc;
                if (date < thirtyDaysAgoStr) return acc; //30일 이전은 안 나오게
                const cleanPrice = parseInt((item.price || '0').toString().replace(/,/g, ''));
                acc[date] = (acc[date] || 0) + cleanPrice * (item.count || 0);
                return acc;
        }, {});
        const allDates = Array.from({ length: 31 }, (_, i) => {
                const d = new Date(thirtyDaysAgo);
                d.setDate(thirtyDaysAgo.getDate() + i);
                return d.toISOString().slice(0, 10);
        });

        // 상세보기 모달용: 통계 전용 날짜 기준
        const filteredRawItems = (item) => {
                if (!item) return [];
                if (!statsStartDate && !statsEndDate) return item.rawItems;
                return item.rawItems.filter(buy => {
                        const d = buy.writedate?.slice(0, 10) || '';
                        if (statsStartDate && d < statsStartDate) return false;
                        if (statsEndDate && d > statsEndDate) return false;
                        return true;
                });
        };

        // 기업별 총매출 TOP5 (buys 기반)
        const top5Companies = Object.values(
                buys.reduce((acc, item) => {
                        const cid = item.product?.company?.cid ?? item.product?.company?.c_id;
                        const bizName = item.product?.company?.businessName;
                        if (!cid) return acc;

                        if (!acc[cid]) {
                                acc[cid] = { cid, businessName: bizName, totalPrice: 0, totalCount: 0 };
                        }
                        acc[cid].totalPrice += parseInt(item.price || 0) * (item.count || 0);
                        acc[cid].totalCount += item.count || 0;
                        return acc;
                }, {})
        )
                .sort((a, b) => b.totalPrice - a.totalPrice)
                .slice(0, 5);
        //카테고리 별 판매량 집계
        const top5Categories = Object.values(
                buys.reduce((acc, item) => {
                        const bCat = item.product?.b_category;
                        const sCat = item.product?.scategory;
                        if (!bCat) return acc;

                        const key = `${bCat}〉${sCat}`;
                        if (!acc[key]) {
                                acc[key] = { key, bCat, sCat, totalCount: 0, totalPrice: 0 };
                        } const cleanPrice = parseInt((item.price || '0').toString().replace(/,/g, ''));
                        acc[key].totalCount += item.count || 0;
                        acc[key].totalPrice += cleanPrice * (item.count || 0);
                        return acc;
                }, {})
        )
                .sort((a, b) => b.totalCount - a.totalCount)
                .slice(0, 5);

        // ────────────────────────────────────────────────────────────────
        // [매출 통계 연결] 다른 메뉴에서 검색 후 "매출 통계" 버튼을 눌렀을 때
        // 어떤 컨텍스트(기업명 / 상품명)로 넘어왔는지 저장하는 상태
        // type: 'company' | 'product' | null
        // value: 실제 검색어 문자열
        // ────────────────────────────────────────────────────────────────
        const [salesStatContext, setSalesStatContext] = useState({ type: null, value: '' });

        // 매출 통계 모달의 일별 검색 날짜 범위 (없으면 오늘 기준)
        const [salesChartStart, setSalesChartStart] = useState('');
        const [salesChartEnd, setSalesChartEnd] = useState('');

        // 오늘 날짜 문자열 (YYYY-MM-DD)
        const todayStr = new Date().toISOString().slice(0, 10);

        // ── 매출 통계 모달에서 사용할 "유효 날짜 범위" ──────────────────
        // 날짜를 선택하지 않으면 오늘 하루만 보여줌
        const salesEffectiveStart = salesChartStart || todayStr;
        const salesEffectiveEnd = salesChartEnd || todayStr;

        // ── 날짜 범위 안에 해당하는 buy 항목만 필터 ─────────────────────
        const buysInRange = buys.filter(item => {
                const d = item.writedate?.slice(0, 10) || '';
                return d >= salesEffectiveStart && d <= salesEffectiveEnd;
        });

        // ── 기업별 집계 (날짜 범위 기준) ─────────────────────────────────
        const companyDailySales = Object.values(
                buysInRange.reduce((acc, item) => {
                        const bizName = item.product?.company?.businessName || '(미상)';
                        const cid = item.product?.company?.cid ?? item.product?.company?.c_id ?? bizName;
                        if (!acc[cid]) {
                                acc[cid] = { cid, businessName: bizName, totalPrice: 0, totalCount: 0 };
                        }
                        const cleanPrice = parseInt((item.price || '0').toString().replace(/,/g, ''));
                        acc[cid].totalPrice += cleanPrice * (item.count || 0);
                        acc[cid].totalCount += item.count || 0;
                        return acc;
                }, {})
        ).sort((a, b) => b.totalPrice - a.totalPrice);

        // ── 컨텍스트 필터가 있을 때: 해당 기업 or 상품의 일별 매출 라인 ──
        // 날짜별 합산 (컨텍스트 기업 또는 상품명 기준)
        const buildContextDailyLine = () => {
                if (!salesStatContext.type || !salesStatContext.value) return { labels: [], data: [] };

                // 범위 내 날짜 목록 생성
                const labels = [];
                const cur = new Date(salesEffectiveStart);
                const end = new Date(salesEffectiveEnd);
                while (cur <= end) {
                        labels.push(cur.toISOString().slice(0, 10));
                        cur.setDate(cur.getDate() + 1);
                }

                const dataMap = buysInRange.reduce((acc, item) => {
                        const d = item.writedate?.slice(0, 10) || '';
                        let match = false;
                        if (salesStatContext.type === 'company') {
                                match = item.product?.company?.businessName?.includes(salesStatContext.value);
                        } else if (salesStatContext.type === 'product') {
                                match = item.product?.name?.includes(salesStatContext.value);
                        }
                        if (!match) return acc;
                        const cleanPrice = parseInt((item.price || '0').toString().replace(/,/g, ''));
                        acc[d] = (acc[d] || 0) + cleanPrice * (item.count || 0);
                        return acc;
                }, {});

                return { labels, data: labels.map(d => dataMap[d] || 0) };
        };

        // 전체 일별 매출 라인 (컨텍스트 비교용)
        const buildTotalDailyLine = () => {
                const labels = [];
                const cur = new Date(salesEffectiveStart);
                const end = new Date(salesEffectiveEnd);
                while (cur <= end) {
                        labels.push(cur.toISOString().slice(0, 10));
                        cur.setDate(cur.getDate() + 1);
                }
                const dataMap = buysInRange.reduce((acc, item) => {
                        const d = item.writedate?.slice(0, 10) || '';
                        const cleanPrice = parseInt((item.price || '0').toString().replace(/,/g, ''));
                        acc[d] = (acc[d] || 0) + cleanPrice * (item.count || 0);
                        return acc;
                }, {});
                return { labels, data: labels.map(d => dataMap[d] || 0) };
        };

        // ── 매출 통계 버튼 핸들러 (기업 관리 / 상품 관리 검색 컨텍스트 전달) ──
        const handleOpenSalesChart = (type, value) => {
                setSalesStatContext({ type: type || null, value: value || '' });
                setChartOpen(true);
        };

        //회원 삭제 명령어
        const handleBulkUnregister = () => {
                const targets = selectedItems['회원관리'] || [];
                if (targets.length === 0) return alert("탈퇴처리할 회원을 선택해주세요.");
                if (!window.confirm(`선택한 ${targets.length}명을 탈퇴처리 하시겠습니까?`)) return;

                Promise.all(
                        targets.map(mid =>
                                axios.patch(`http://192.168.4.60:9991/member/unregister/${mid}`)
                        )
                )
                        .then(() => {
                                alert("탈퇴처리 완료");
                                axios.get('http://192.168.4.60:9991/member/all/member')
                                        .then(res => setUsers(res.data));
                                setSelectedItems(prev => ({ ...prev, '회원관리': [] }));
                        })
                        .catch(err => console.log(err));
        }

        const handleProDelete = (pid) => {
                if (!window.confirm('상품을 삭제하시겠습니까?')) return;
                axios.delete(`http://192.168.4.60:9991/product/${pid}`)
                        .then(() => {
                                alert('삭제 완료');
                                axios.get('http://192.168.4.60:9991/all/product').then(res => setProducts(res.data));
                        })
                        .catch(err => console.log(err));
        };

        // 상품 수정 모드 진입
        const handleProEditClick = (pd) => {
                setProEditingId(pd.pid);
                setProEditForm({ ...pd });
        };

        // 수정 입력 핸들러
        const handleProEditChange = (e) => {
                const { name, value } = e.target;
                setProEditForm(prev => ({ ...prev, [name]: value }));
        };

        // 수정 저장 (DB 반영)
        const handleProSaveClick = async () => {
                const targetId = proEditingId;
                try {
                        await axios.put(`http://192.168.4.60:9991/product/seller/update/${targetId}`, proEditForm);
                        setProducts(products.map(p => (p.pid === targetId) ? { ...p, ...proEditForm } : p));
                        setProEditingId(null);
                        alert('수정 완료되었습니다.');
                } catch (err) {
                        console.error(err);
                        alert('수정 중 오류가 발생했습니다.');
                }
        };

        const handleBulkProDelete = () => {
                if (selectedProIds.length == 0) return alert('삭제할 제품을 선택해 주세요.');
                if (!window.confirm(`선택한 ${selectedProIds.length}개의 글을 삭제하시겠습니까?`)) return;
                Promise.all(selectedProIds.map(id => axios.delete(`http://192.168.4.60:9991/product/${id}`)))
                        .then(() => {
                                setSelectedProIds([]);
                                axios.get('http://192.168.4.60:9991/all/product').then(res => setProducts(res.data));
                        })
                        .catch(err => console.log(err));
        };

        const [selectedEventIds, setSelectedEventIds] = useState([]);
        const handleEventCheck = (eId) => {
                setSelectedEventIds(prev =>
                        prev.includes(eId) ? prev.filter(id => id !== eId) : [...prev, eId]
                );
        };

        const handleEventDelete = (eId) => {
                if (!window.confirm('삭제하시겠습니까?')) return;
                axios.delete(`http://192.168.4.60:9991/event/delete/${eId}`)
                        .then(() => {
                                alert('삭제 완료');
                                axios.get('http://192.168.4.60:9991/event/all').then(res => setEvents(res.data));
                        })
                        .catch(err => console.log(err));
        };

        const handleBulkEventDelete = () => {
                if (selectedEventIds.length === 0) return alert('삭제할 항목을 선택해주세요.');
                if (!window.confirm(`선택한 ${selectedEventIds.length}개를 삭제하시겠습니까?`)) return;
                axios.delete('http://192.168.4.60:9991/event/delete', { data: selectedEventIds })
                        .then(() => {
                                alert('삭제 완료');
                                setSelectedEventIds([]);
                                axios.get('http://192.168.4.60:9991/event/all').then(res => setEvents(res.data));
                        })
                        .catch(err => console.log(err));
        };

        //검색 함수
        const [userSearchKey, setUserSearchKey] = useState('userid');
        const [userSearchWord, setUserSearchWord] = useState('');
        const [companySearchKey, setCompanySearchKey] = useState('userid');
        const [companySearchWord, setCompanySearchWord] = useState('');
        const [productSearchKey, setProductSearchKey] = useState('name');
        const [productSearchWord, setProductSearchWord] = useState('');
        const [productBCategory, setProductBCategory] = useState('');
        const [productSCategory, setProductSCategory] = useState('');

        const [userOutSearchKey, setUserOutSearchKey] = useState('userid');
        const [userOutSearchWord, setUserOutSearchWord] = useState('');
        const [companyOutSearchKey, setCompanyOutSearchKey] = useState('userid');
        const [companyOutSearchWord, setCompanyOutSearchWord] = useState('');

        const handleUserSearch = () => {
                axios.post('http://192.168.4.60:9991/member/search', {
                        searchKey: userSearchKey,
                        searchWord: userSearchWord
                })
                        .then(res => setUsers(res.data))
                        .catch(err => console.log(err));
        }

        const handleCompanySearch = () => {
                axios.post('http://192.168.4.60:9991/member/search/business', {
                        searchKey: companySearchKey,
                        searchWord: companySearchWord
                })
                        .then(res => setCompanys(res.data))
                        .catch(err => console.log(err));
        }

        const handleProductSearch = () => {
                axios.post('http://192.168.4.60:9991/search/product', {
                        searchKey: productSearchKey,
                        searchWord: productSearchWord
                })
                        .then(res => setProducts(res.data))
                        .catch(err => console.log(err));
        }

        // 더보기
        const [showMore, setShowMore] = useState(false);
        const [showMoreOut, setShowMoreOut] = useState(false);
        const [cshowMore, setCShowMore] = useState(false);
        const [cshowMoreOut, setCShowMoreOut] = useState(false);
        // 활동 중 회원
        const activeUsers = users
                .filter(u => u.isOut === 'N')
                .filter(u => !userSearchWord || u[userSearchKey]?.includes(userSearchWord));
        const visibleUsers = showMore ? activeUsers : activeUsers.slice(0, 5);

        // 탈퇴 회원
        const outUsers = users
                .filter(u => u.isOut !== 'N')
                .filter(u => !userOutSearchWord || u[userOutSearchKey]?.includes(userOutSearchWord));
        const invisibleUsers = showMoreOut ? outUsers : outUsers.slice(0, 5);

        // 활동 중 기업
        const activeCompanys = companys
                .filter(c => c.isOut === 'N')
                .filter(c => !companySearchWord || c[companySearchKey]?.includes(companySearchWord));
        const visibleCompanys = cshowMore ? activeCompanys : activeCompanys.slice(0, 5);

        // 탈퇴 기업
        const outCompanys = companys
                .filter(c => c.isOut !== 'N')
                .filter(c => !companyOutSearchWord || c[companyOutSearchKey]?.includes(companyOutSearchWord));
        const invisibleCompanys = cshowMoreOut ? outCompanys : outCompanys.slice(0, 5);

        const menus = ['대시보드', '회원 관리', '기업 관리', '상품 관리', '세일 관리', '문의 관리', '통계', '정산'];
        const submenus = ['-예약', '-이벤트 관리']

        const handleDateProductPreset = (period, value) => {
                const today = new Date();
                const start = new Date();
                setProductEndDate(formatDate(today));
                if (period === 'day') {
                        setProductStartDate(formatDate(today));
                } else if (period === 'week') {
                        start.setDate(today.getDate() - 7);
                        setProductStartDate(formatDate(start));
                } else if (period === 'month') {
                        start.setMonth(today.getMonth() - value);
                        setProductStartDate(formatDate(start));
                } else if (period === 'year') {
                        start.setFullYear(today.getFullYear() - 1);
                        setProductStartDate(formatDate(start));
                }
        };

        const filteredProducts = products
                .filter(pd => {
                        // 1. 카테고리 필터
                        if (productBCategory && pd.b_category !== productBCategory) return false;
                        if (productSCategory && pd.scategory !== productSCategory) return false;
                        return true;
                })
                .filter(pd => {
                        // 2. 날짜 필터
                        if (!productStartDate && !productEndDate) return true;
                        const writedate = pd.writedate?.split('T')[0];
                        if (productStartDate && writedate < productStartDate) return false;
                        if (productEndDate && writedate > productEndDate) return false;
                        return true;
                })
                .filter(pd => {
                        // 3. 검색어 필터
                        if (!productSearchWord) return true;
                        if (productSearchKey === 'name') return pd.name?.includes(productSearchWord);
                        if (productSearchKey === 'businessName') return pd.company?.businessName?.includes(productSearchWord);
                        return true;
                });

        //페이징 함수
        const postsPerPage = 10;
        const totalPages = Math.ceil(asks.length / postsPerPage);

        const postsPerPage3 = 10;
        const totalPages3 = Math.ceil(filteredProducts.length / postsPerPage3);

        // 페이지 이동 함수
        const paginate = (pageNumber, e) => {
                e.preventDefault(); // 클릭 시 페이지 새로고침 방지
                if (pageNumber >= 1 && pageNumber <= totalPages) {
                        setCurrentPage(pageNumber);
                }
        };

        //상품관리 페이지네이션
        const paginate3 = (pageNumber3, e) => {
                e.preventDefault(); // 클릭 시 페이지 새로고침 방지
                if (pageNumber3 >= 1 && pageNumber3 <= totalPages3) {
                        setCurrentPage3(pageNumber3);
                }
        };

        // 날짜를 YYYY-MM-DD 형식으로 변환하는 보조 함수
        const formatDate = (date) => {
                return date.toISOString().split('T')[0];
        };

        //이벤트 페이지 게시글 등록
        const [eventModalOpen, setEventModalOpen] = useState(false);
        const [newEvent, setNewEvent] = useState({
                subject: '',
                context: '',
                updatedate: '',
                enddate: '',
                pId: ''
        });
        // 이벤트 수정용 state
        const [editEventModalOpen, setEditEventModalOpen] = useState(false);
        const [editEvent, setEditEvent] = useState({
                e_id: null,
                subject: '',
                context: '',
                updatedate: '',
                enddate: '',
                pId: ''
        });
        //수정 버튼 클릭 시 등장 핸들러
        const handleEventEditClick = (item) => {
                setEditEvent({
                        e_id: item.e_id,
                        subject: item.subject || '',
                        context: item.context || '',
                        updatedate: item.updatedate ? item.updatedate.slice(0, 10) : '',
                        enddate: item.enddate ? item.enddate.slice(0, 10) : '',
                        pId: item.product?.pid || item.product?.p_id || ''
                });
                setEditEventModalOpen(true);
        };
        const handleEventEditSubmit = () => {
        if (!editEvent.subject) return alert('제목을 입력해주세요.');
        if (!editEvent.context) return alert('내용을 입력해주세요.');

        axios.put(`http://192.168.4.60:9991/event/update/${editEvent.e_id}`, {
                subject: editEvent.subject,
                context: editEvent.context,
                updatedate: editEvent.updatedate ? editEvent.updatedate + 'T00:00:00' : null,
                enddate: editEvent.enddate ? editEvent.enddate + 'T00:00:00' : null,
                p_id: Number(editEvent.pId)
        })
                .then(() => {
                        alert('수정 완료');
                        setEditEventModalOpen(false);
                        axios.get('http://192.168.4.60:9991/event/all').then(res => setEvents(res.data));
                })
                .catch(err => {
                        console.log(err);
                        alert('수정 중 오류가 발생했습니다.');
                });
        };

        const handleEventSubmit = () => {
                if (!newEvent.pId) return alert('상품을 선택해주세요.');
                if (!newEvent.subject) return alert('제목을 입력해주세요.');
                if (!newEvent.context) return alert('내용을 입력해주세요.');

                console.log('보내는테이터:', newEvent);
                axios.post('http://192.168.4.60:9991/event/add', {
                        subject: newEvent.subject,
                        context: newEvent.context,
                        updatedate: newEvent.updatedate ? newEvent.updatedate + 'T00:00:00' : null,
                        enddate: newEvent.enddate ? newEvent.enddate + 'T00:00:00' : null,
                        p_id: Number(newEvent.pId)
                })
                        .then(() => {
                                alert('등록 완료');
                                setEventModalOpen(false);
                                setNewEvent({ subject: '', context: '', updatedate: '', enddate: '', pId: '' });
                                axios.get('http://192.168.4.60:9991/event/all')
                                        .then(res => setEvents(res.data));
                        })
                        .catch(err => console.log(err));
        };

        const handleToggle = (id) => {
                setOpenId(prev => prev === id ? null : id);
        }

        // 정산
        const [openSettleModal, setOpenSettleModal] = useState(false);
        const [selectedItem, setSelectedItem] = useState(null);
        const parsePrice = (value) => {
                if (!value) return 0;
                return Number(String(value).replace(/[^0-9]/g, ""));
        };


        const BuyTag = () => {
                // 날짜 범위 있으면 그 범위만, 없으면 해당 pId 전체 주문
                const items = filteredRawItems(selectedBuyItem);

                const postsPerPage2 = 5;
                const totalPages2 = Math.ceil(items.length / postsPerPage2);

                const paginate2 = (pageNumber2, e) => {
                        e.preventDefault(); // 클릭 시 페이지 새로고침 방지
                        if (pageNumber2 >= 1 && pageNumber2 <= totalPages2) {
                                setCurrentPage2(pageNumber2);
                        }
                };

                return (
                        <div style={{
                                position: 'fixed',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                backgroundColor: 'white',
                                padding: '20px',
                                zIndex: 1000,
                                borderRadius: '8px',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                        }}>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        {/* 선택된 상품명 + 최근날짜 표시 */}
                                        <div className='light-but'>
                                                {selectedBuyItem?.latestDate} · {selectedBuyItem?.product?.name}
                                        </div>
                                        <button style={{ background: "white", border: "1px solid white", color: "black" }} onClick={() => setModalOpen(false)}>X</button>
                                </div>
                                <table className="table table-bordered" style={{ width: '600px', textAlign: 'center', border: '1px solid #787878', marginTop: '20px' }}>
                                        <thead>
                                                <tr>
                                                        <th style={{ backgroundColor: '#eeeeee' }}>주문번호</th>
                                                        <th style={{ backgroundColor: '#eeeeee' }}>상품명</th>
                                                        <th style={{ backgroundColor: '#eeeeee' }}>회원아이디</th>
                                                        <th style={{ backgroundColor: '#eeeeee' }}>회원명</th>
                                                        <th style={{ backgroundColor: '#eeeeee' }}>결제금액</th>
                                                </tr>
                                        </thead>
                                        <tbody>
                                                {/* 해당 pId의 rawItems만 출력 */}
                                                {items.map((buy) => (
                                                        <tr key={buy.bid}>
                                                                <td>{buy.bid}</td>
                                                                <td>{buy.product?.name}</td>
                                                                <td>{buy.member?.userid}</td>
                                                                <td>{buy.member?.username}</td>
                                                                <td>{(parseInt(buy.price || 0) * buy.count).toLocaleString()}</td>
                                                        </tr>
                                                ))}
                                        </tbody>
                                </table>
                                <nav>
                                        <ul className="pagination" style={{ marginTop: '20px' }}>
                                                <li>
                                                        <a className='paging-text' href="#" onClick={(e) => paginate2(currentPage2 - 1, e)}
                                                                style={{ textDecoration: 'none', color: currentPage2 === 1 ? '#ccc' : '#333' }}>
                                                                ≪
                                                        </a>
                                                </li>
                                                {Array.from({ length: totalPages2 }, (_, i) => i + 1).map((num) => (
                                                        <li key={num}>
                                                                <a
                                                                        href="#"
                                                                        onClick={(e) => paginate2(num, e)}
                                                                        className={currentPage2 === num ? 'paging-active-text' : 'paging-text'}
                                                                        style={{
                                                                                textDecoration: 'none',
                                                                                fontWeight: currentPage2 === num ? 'bold' : 'normal',
                                                                                color: currentPage2 === num ? '#000' : '#888'
                                                                        }}
                                                                >
                                                                        {num}
                                                                </a>
                                                        </li>
                                                ))}
                                                <li>
                                                        <a className='paging-text' href="#" onClick={(e) => paginate(currentPage2 + 1, e)}
                                                                style={{ textDecoration: 'none', color: currentPage2 === totalPages2 ? '#ccc' : '#333' }}>
                                                                ≫
                                                        </a>
                                                </li>
                                        </ul>
                                </nav>
                        </div>
                )
        }
        const data = {
                labels: [
                        'A기업',
                        'B기업',
                        'C기업'
                ],
                datasets: [{
                        label: 'My First Dataset',
                        data: [300, 50, 100],
                        backgroundColor: [
                                'rgb(255, 99, 132)',
                                'rgb(54, 162, 235)',
                                'rgb(255, 205, 86)'
                        ],
                        hoverOffset: 4
                }]
        };
        const data2 = {
                labels: allDates,
                datasets: [
                        {
                                label: '날짜별 매출',
                                data: allDates.map(d => dailySalesMap[d] || 0),
                                borderColor: 'rgb(255, 99, 132)',
                                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                                yAxisID: 'y',
                        }
                ],
        };
        const barData = {
                labels: ['회원 수'],  // X축은 하나
                datasets: [
                        {
                                label: '일반회원',   // 범례 1
                                data: [users.length],
                                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                                borderColor: 'rgb(255, 99, 132)',
                                borderWidth: 1
                        },
                        {
                                label: '기업회원',   // 범례 2
                                data: [companys.length],
                                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                                borderColor: 'rgb(255, 159, 64)',
                                borderWidth: 1
                        }
                ]
        };

        const COLORS = [
                'rgb(255, 173, 191)',
                'rgb(175, 223, 255)',
                'rgb(255, 240, 206)',
                'rgb(199, 255, 204)',
                'rgb(253, 207, 255)'
        ];
        const COLORS_LIGHT = [
                'rgb(255, 173, 191)',
                'rgb(175, 223, 255)',
                'rgb(255, 240, 206)',
                'rgb(199, 255, 204)',
                'rgb(253, 207, 255)'
        ];
        const dounutData = {
                labels: top5Companies.map(c => c.businessName),
                datasets: [{
                        label: '총 매출',
                        data: top5Companies.map(c => c.totalPrice),
                        backgroundColor: COLORS,
                        hoverOffset: 4
                }]
        };
        const doughnutData = {
                labels: top5Categories.map(c => c.key),
                datasets: [{
                        label: '판매수량',
                        data: top5Categories.map(c => c.totalCount),
                        backgroundColor: COLORS_LIGHT,
                        hoverOffset: 4
                }]
        };

        const ChartData = {
                type: 'doughnut',
                data: data
        };
        const ChartData2 = {
                type: 'line',
                data: data2,
                options: {
                        responsive: true,
                        interaction: {
                                mode: 'index',
                                intersect: false,
                        },
                        stacked: false,
                        scales: {
                                y: {
                                        type: 'linear',
                                        display: true,
                                        position: 'left',
                                },
                                y1: {
                                        type: 'linear',
                                        display: true,
                                        position: 'right',

                                        //
                                        grid: {
                                                drawOnChartArea: false,
                                        },
                                },
                        }
                },
        };
        const ChartModel = () => {
                const contextLine = buildContextDailyLine();
                const totalLine = buildTotalDailyLine();
                const hasContext = salesStatContext.type && salesStatContext.value;

                // ── 일별 라인 차트 데이터 ──────────────────────────────────
                const lineChartData = {
                        labels: totalLine.labels,
                        datasets: [
                                {
                                        label: '전체 일별 매출',
                                        data: totalLine.data,
                                        borderColor: 'rgb(54, 162, 235)',
                                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                                        tension: 0.3,
                                        yAxisID: 'y',
                                },
                                ...(hasContext ? [{
                                        label: salesStatContext.type === 'company'
                                                ? `[기업] ${salesStatContext.value}`
                                                : `[상품] ${salesStatContext.value}`,
                                        data: contextLine.data,
                                        borderColor: 'rgb(255, 99, 132)',
                                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                                        tension: 0.3,
                                        yAxisID: 'y',
                                }] : []),
                        ],
                };

                const lineOptions = {
                        responsive: true,
                        plugins: { legend: { position: 'top' } },
                        scales: { y: { beginAtZero: true } },
                };

                // ── 기업별 바 차트 데이터 ──────────────────────────────────
                const barChartData = {
                        labels: companyDailySales.map(c => c.businessName),
                        datasets: [{
                                label: `기간 내 기업별 총 매출 (${salesEffectiveStart} ~ ${salesEffectiveEnd})`,
                                data: companyDailySales.map(c => c.totalPrice),
                                backgroundColor: COLORS.concat([
                                        'rgb(150, 220, 180)', 'rgb(200, 160, 255)',
                                        'rgb(255, 210, 120)', 'rgb(130, 200, 255)',
                                ]),
                                borderWidth: 1,
                        }],
                };
                const barOptions = {
                        responsive: true,
                        plugins: { legend: { display: false } },
                        scales: { y: { beginAtZero: true } },
                };

                return (
                        <div style={{
                                position: 'fixed', top: '50%', left: '50%',
                                transform: 'translate(-50%, -50%)',
                                backgroundColor: 'white', padding: '28px',
                                zIndex: 1000, borderRadius: '12px',
                                boxShadow: '0 6px 24px rgba(0,0,0,0.25)',
                                width: '820px', maxHeight: '90vh', overflowY: 'auto',
                        }}>
                                {/* 헤더 */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                        <h4 style={{ margin: 0, fontWeight: '700' }}>
                                                매출 통계
                                                {hasContext && (
                                                        <span style={{ fontSize: '0.75em', marginLeft: '10px', color: '#555', fontWeight: '400' }}>
                                                                ({salesStatContext.type === 'company' ? '기업' : '상품'}: {salesStatContext.value})
                                                        </span>
                                                )}
                                        </h4>
                                        <button style={{ background: 'white', border: '1px solid #ddd', borderRadius: '6px', padding: '4px 10px', cursor: 'pointer' }} onClick={() => setChartOpen(false)}>✕</button>
                                </div>

                                {/* 날짜 범위 선택 */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', padding: '12px', backgroundColor: '#f5f7ff', borderRadius: '8px', fontSize: '0.85em' }}>
                                        <span style={{ fontWeight: '600', whiteSpace: 'nowrap' }}>일별 조회</span>
                                        <input type='date' className='calendar' value={salesChartStart}
                                                onChange={(e) => setSalesChartStart(e.target.value)} />
                                        <b>~</b>
                                        <input type='date' className='calendar' value={salesChartEnd}
                                                onChange={(e) => setSalesChartEnd(e.target.value)} />
                                        <button className='button2' onClick={() => { setSalesChartStart(''); setSalesChartEnd(''); }}
                                                style={{ whiteSpace: 'nowrap', backgroundColor: '#85bdeb', color: 'white' }}>초기화</button>
                                        <span style={{ color: '#888', fontSize: '0.9em' }}>
                                                ※ 미선택 시 오늘({todayStr}) 기준
                                        </span>
                                </div>

                                {/* 기업별 총 매출 테이블 */}
                                <h5 style={{ fontWeight: '600', marginBottom: '8px' }}>
                                        기업별 판매 현황 ({salesEffectiveStart} ~ {salesEffectiveEnd})
                                </h5>
                                <table className="table table-bordered" style={{ width: '100%', fontSize: '0.83em', textAlign: 'center', marginBottom: '24px' }}>
                                        <thead>
                                                <tr style={{ backgroundColor: '#eeeeee' }}>
                                                        <th>순위</th>
                                                        <th>기업명</th>
                                                        <th>주문건수</th>
                                                        <th>총 판매금액</th>
                                                        <th>수수료(10%)</th>
                                                        {hasContext && salesStatContext.type === 'company' && <th>검색 기업 여부</th>}
                                                </tr>
                                        </thead>
                                        <tbody>
                                                {companyDailySales.length === 0 ? (
                                                        <tr><td colSpan="6" style={{ color: '#aaa', padding: '16px' }}>해당 기간에 판매 데이터가 없습니다.</td></tr>
                                                ) : (
                                                        companyDailySales.map((c, idx) => {
                                                                const isHighlight = hasContext && salesStatContext.type === 'company'
                                                                        && c.businessName?.includes(salesStatContext.value);
                                                                return (
                                                                        <tr key={c.cid} style={{ backgroundColor: isHighlight ? '#fff8e1' : 'white' }}>
                                                                                <td>{idx + 1}</td>
                                                                                <td style={{ fontWeight: isHighlight ? '700' : 'normal' }}>{c.businessName}</td>
                                                                                <td>{c.totalCount.toLocaleString()}</td>
                                                                                <td style={{ color: '#2d7df4', fontWeight: '600' }}>{c.totalPrice.toLocaleString()}원</td>
                                                                                <td style={{ color: '#e74c3c' }}>{Math.floor(c.totalPrice * 0.1).toLocaleString()}원</td>
                                                                                {hasContext && salesStatContext.type === 'company' && (
                                                                                        <td>{isHighlight ? <span style={{ color: '#e74c3c', fontWeight: '700' }}>★ 검색 기업</span> : '-'}</td>
                                                                                )}
                                                                        </tr>
                                                                );
                                                        })
                                                )}
                                        </tbody>
                                </table>

                                {/* 기업별 바 차트 */}
                                <h5 style={{ fontWeight: '600', marginBottom: '8px' }}>기업별 매출 비교 차트</h5>
                                <div style={{ marginBottom: '28px' }}>
                                        <Bar data={barChartData} options={barOptions} />
                                </div>

                                {/* 일별 라인 차트 */}
                                <h5 style={{ fontWeight: '600', marginBottom: '8px' }}>
                                        일별 매출 추이
                                        {hasContext && <span style={{ fontSize: '0.8em', color: '#888', marginLeft: '8px' }}>
                                                (전체 vs {salesStatContext.type === 'company' ? '기업' : '상품'}: {salesStatContext.value})
                                        </span>}
                                </h5>
                                <Line data={lineChartData} options={lineOptions} />
                        </div>
                );
        }

        return (
                <div className='manager-container'>
                        <div className='category-mana'>
                                <Link to="/" style={{ textDecoration: "none" }}>
                                        <h1 className="canvas">CANVAS</h1>
                                </Link>
                                <div className='sub-mana'>
                                        {menus.map((menu) => (
                                                <div key={menu}>
                                                        <div
                                                                style={{
                                                                        cursor: 'pointer',
                                                                        backgroundColor: activeMenu === menu ? '#3a4ca8' : '#333333',
                                                                        padding: '0px 15px',
                                                                        paddingLeft: '40px',
                                                                        margin: 0
                                                                }}
                                                                onClick={() => {
                                                                        setActiveMenu(menu);
                                                                        if (menu == '세일 관리') setIsPostOpen(!isPostOpen);
                                                                }}
                                                        >
                                                                {menu}
                                                        </div>

                                                        {/* 서브메뉴 조건부 렌더링 */}
                                                        {menu === '세일 관리' && (isPostOpen || submenus.includes(activeMenu)) && (
                                                                <div style={{ backgroundColor: '#222222' }}>
                                                                        {submenus.map((sub) => (
                                                                                <p
                                                                                        key={sub}
                                                                                        onClick={() => setActiveMenu(sub)}
                                                                                        style={{
                                                                                                cursor: 'pointer',
                                                                                                padding: '8px 30px',
                                                                                                fontSize: '0.9em',
                                                                                                color: '#ffffff',
                                                                                                paddingLeft: '60px',
                                                                                                backgroundColor: activeMenu === sub ? '#4a5cb8' : 'transparent',
                                                                                                margin: 0
                                                                                        }}
                                                                                >
                                                                                        {sub}
                                                                                </p>
                                                                        ))}
                                                                </div>
                                                        )}
                                                </div>
                                        ))}
                                </div>
                        </div>
                        {/* 대시보드 페이지 */}
                        {activeMenu == '대시보드' && (
                                <div className='category-content'>
                                        <h4 style={{ fontWeight: '600', textAlign: 'center' }}>CANVAS 총 매출</h4>
                                        <hr />
                                        <h5 style={{ textAlign: 'center', marginTop: '60px' }}>오늘의 매출 : {(dailySalesMap[todayStr] || 0).toLocaleString()}원</h5>
                                        <div style={{ fontSize: '0.8em', textAlign: 'center', color: '#ccc' }}>수수료는 정산 시 10%씩 차감됩니다.</div>
                                        <div className='dash-board' style={{ width: '80%', scrollbarWidth: 'none', margin: '0 auto', height: '400px', margin: '50px auto 100px auto' }}>
                                                <Line
                                                        data={data2}
                                                        options={{
                                                                ...ChartData.options2,
                                                                maintainAspectRatio: false
                                                        }}
                                                />
                                        </div>
                                        <hr />
                                        <h4 style={{ textAlign: 'left', fontWeight: '600', marginTop: '50px', margin: '30px 0px 30px 50px' }}>유저수 현황</h4>
                                        <div style={{ display: 'flex', gap: '20px', justifyContent: 'space-evenly' }}>
                                                <div className='dash-board' style={{ overflowX: 'auto' }}>
                                                        <h6 style={{ textAlign: 'center' }}>일별 신규 가입자(기업/일반)</h6>
                                                        <table style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse' }}>
                                                                <thead>
                                                                        <tr style={{ fontSize: '0.8em', borderBottom: '2px solid #333333' }}>
                                                                                <th style={{ textAlign: 'center', verticalAlign: 'middle', padding: '8px' }}>날짜</th>
                                                                                <th style={{ textAlign: 'center', verticalAlign: 'middle', padding: '8px' }}>일반가입자</th>
                                                                                <th style={{ textAlign: 'center', verticalAlign: 'middle', padding: '8px' }}>기업가입자</th>
                                                                                <th style={{ textAlign: 'center', verticalAlign: 'middle', padding: '8px' }}>합계</th>
                                                                        </tr>
                                                                </thead>
                                                                <tbody>
                                                                        {memberDateList.map((row) => (
                                                                                <tr key={row.date} style={{ borderBottom: '1px solid #eeeeee', fontSize: '0.8em' }}>
                                                                                        <td style={{ textAlign: 'center', verticalAlign: 'middle', padding: '8px' }}>
                                                                                                {row.date}
                                                                                        </td>
                                                                                        <td style={{ textAlign: 'center', verticalAlign: 'middle', padding: '8px' }}>
                                                                                                {row.normalCount}
                                                                                        </td>
                                                                                        <td style={{ textAlign: 'center', verticalAlign: 'middle', padding: '8px' }}>
                                                                                                {row.companyCount}
                                                                                        </td>
                                                                                        <td style={{ textAlign: 'center', verticalAlign: 'middle', padding: '8px' }}>
                                                                                                {row.normalCount + row.companyCount}
                                                                                        </td>
                                                                                </tr>
                                                                        ))}
                                                                </tbody>
                                                        </table>
                                                </div>
                                                <div className='dash-board' style={{ overflowX: 'auto', height: '400px', scrollbarWidth: 'none' }}>
                                                        <h6 style={{ textAlign: 'center' }}>활동 사용자 비율(기업/일반)</h6>
                                                        <Bar
                                                                style={{ height: '350px', padding: '20px' }}
                                                                data={barData}
                                                                options={{ maintainAspectRatio: false }}
                                                        />
                                                </div>
                                        </div>
                                        <hr />
                                        <h4 style={{ textAlign: 'left', fontWeight: '600', marginTop: '50px', margin: '30px 0px 30px 50px' }}>기업별 상위 매출 정산</h4>
                                        <div style={{ display: 'flex', gap: '20px', justifyContent: 'space-evenly' }}>
                                                <div className='dash-board' style={{ overflowX: 'auto' }}>
                                                        <h6 style={{ textAlign: 'center' }}>상위 매출 기업 TOP5</h6>
                                                        <table style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse' }}>
                                                                <thead>
                                                                        <tr style={{ fontSize: '0.8em', borderBottom: '2px solid #333333' }}>
                                                                                <th style={{ textAlign: 'center', verticalAlign: 'middle', padding: '8px' }}>순위</th>
                                                                                <th style={{ textAlign: 'center', verticalAlign: 'middle', padding: '8px' }}>기업명</th>
                                                                                <th style={{ textAlign: 'center', verticalAlign: 'middle', padding: '8px' }}>판매수량</th>
                                                                                <th style={{ textAlign: 'center', verticalAlign: 'middle', padding: '8px' }}>판매가</th>
                                                                        </tr>
                                                                </thead>
                                                                <tbody>
                                                                        {top5Companies.map((company, index) => (
                                                                                <tr key={company.cid} style={{ borderBottom: '1px solid #eeeeee', fontSize: '0.8em' }}>
                                                                                        <td style={{ textAlign: 'center', verticalAlign: 'middle', padding: '8px' }}>
                                                                                                {index + 1}위
                                                                                        </td>
                                                                                        <td style={{ textAlign: 'center', verticalAlign: 'middle', padding: '8px' }}>{company.businessName}</td>
                                                                                        <td style={{ textAlign: 'center', verticalAlign: 'middle', padding: '8px' }}>{company.totalCount}개</td>
                                                                                        <td style={{ textAlign: 'center', verticalAlign: 'middle', padding: '8px' }}>{company.totalPrice.toLocaleString()}원</td>
                                                                                </tr>
                                                                        ))}
                                                                </tbody>
                                                        </table>
                                                </div>
                                                <div className='dash-board' style={{ overflowX: 'auto', height: '400px', scrollbarWidth: 'none' }}>
                                                        <h6 style={{ textAlign: 'center' }}>상위 매출 기업 TOP5</h6>
                                                        <Doughnut
                                                                style={{ height: '350px', padding: '20px' }}
                                                                data={dounutData}
                                                                options={{ maintainAspectRatio: false }}
                                                        />
                                                </div>
                                        </div>
                                        <hr />
                                        <h4 style={{ textAlign: 'left', fontWeight: '600', marginTop: '50px', margin: '30px 0px 30px 50px' }}>카테고리별 매출 현황</h4>
                                        <div style={{ display: 'flex', gap: '20px', justifyContent: 'space-evenly' }}>
                                                <div className='dash-board' style={{ overflowX: 'auto' }}>
                                                        <h6 style={{ textAlign: 'center' }}>카테고리 판매량 순위</h6>
                                                        <table style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse' }}>
                                                                <thead>
                                                                        <tr style={{ fontSize: '0.8em', borderBottom: '2px solid #333333' }}>
                                                                                <th style={{ textAlign: 'center', verticalAlign: 'middle', padding: '8px' }}>카테고리</th>
                                                                                <th style={{ textAlign: 'center', verticalAlign: 'middle', padding: '8px' }}>상품명</th>
                                                                                <th style={{ textAlign: 'center', verticalAlign: 'middle', padding: '8px' }}>총 판매가</th>
                                                                        </tr>
                                                                </thead>
                                                                <tbody>
                                                                        {top5Categories.map((cat) => (
                                                                                <tr key={cat.key} style={{ borderBottom: '1px solid #eeeeee', fontSize: '0.8em' }}>
                                                                                        <td style={{ textAlign: 'center', verticalAlign: 'middle', padding: '8px' }}>{cat.key}</td>
                                                                                        <td style={{ textAlign: 'center', verticalAlign: 'middle', padding: '8px' }}>{cat.totalCount}개</td>
                                                                                        <td style={{ textAlign: 'center', verticalAlign: 'middle', padding: '8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cat.totalPrice.toLocaleString()}원</td>
                                                                                </tr>
                                                                        ))}
                                                                </tbody>
                                                        </table>
                                                </div>
                                                <div className='dash-board' style={{ overflowX: 'auto', height: '400px', scrollbarWidth: 'none' }}>
                                                        <h6 style={{ textAlign: 'center' }}>카테고리 판매량 순위</h6>
                                                        <Doughnut
                                                                style={{ height: '350px', padding: '20px' }}
                                                                data={doughnutData}
                                                                options={{ maintainAspectRatio: false }}
                                                        />
                                                </div>
                                        </div>
                                </div>
                        )}
                        {/* 회원관리 페이지 */}
                        {activeMenu == '회원 관리' && (
                                <div style={{ display: 'flex', flexDirection: 'column', width: '80%' }}>
                                        <div className='category-content'>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                                        <h4 style={{ textAlign: 'left', fontWeight: '600' }}>회원 검색</h4>
                                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                <select
                                                                        value={userSearchKey}
                                                                        onChange={(e) => setUserSearchKey(e.target.value)}
                                                                        className="cat1" style={{
                                                                                width: '80px', padding: '3px', borderRadius: '10px',
                                                                                fontSize: '0.8em', height: '30px', marginTop: '5PX'
                                                                        }}
                                                                >
                                                                        <option value="username">이름</option>
                                                                        <option value="userid">아이디</option>
                                                                        <option value="email">이메일</option>
                                                                        <option value="tel">전화번호</option>
                                                                </select>
                                                                <div className="search-bar">
                                                                        <input type="text" placeholder="검색어를 입력해주세요."
                                                                                value={userSearchWord}
                                                                                onChange={(e) => setUserSearchWord(e.target.value)}
                                                                                onKeyDown={(e) => e.key === 'Enter' && handleUserSearch()}
                                                                        />
                                                                        <button className="search-icon" onClick={handleUserSearch}></button>
                                                                </div>
                                                        </div>
                                                </div>
                                                <hr />
                                                <div className="row border real-dark-border mx-0" style={{ backgroundColor: '#eeeeee', fontSize: '0.8em', textAlign: 'center', padding: '5px' }}>
                                                        <div className="col-1 border-start">일괄탈퇴</div>
                                                        <div className="col-2 border-start">아이디</div>
                                                        <div className="col-2 border-start">성명</div>
                                                        <div className="col-2 border-start">이메일</div>
                                                        <div className="col-2 border-start">연락처</div>
                                                        <div className="col-2 border-start">가입일</div>
                                                        <div className="col-1 border-start">관리</div>
                                                </div>
                                                {visibleUsers
                                                        .map((user) => (
                                                                <div key={user.mid} className="row border real-dark-border mx-0" style={{ fontSize: '0.8em', textAlign: 'center', padding: '5px' }}>
                                                                        <div className="col-1 border-start" style={{ fontSize: '0.8em', textAlign: 'center', verticalAlign: 'middle' }}>
                                                                                <input
                                                                                        type="checkbox"
                                                                                        checked={selectedItems['회원관리']?.includes(user.mid) || false}
                                                                                        onChange={() => handleCheck('회원관리', user.mid)}
                                                                                />
                                                                        </div>
                                                                        <div className="col-2 border-start">{user.userid}</div>
                                                                        <div className="col-2 border-start">{user.username}</div>
                                                                        <div className="col-2 border-start">{user.email}</div>
                                                                        <div className="col-2 border-start">{user.tel}</div>
                                                                        <div className="col-2 border-start">{user.writedate.slice(0, 10)}</div>
                                                                        <div className="col-1 border-start" style={{
                                                                                background: user.isOut == "Y" ? '#ffebee' : '#e3f2fd',
                                                                                color: user.isOut == "Y" ? '#c62828' : '#1976d2',
                                                                                padding: '2px 6px', borderRadius: '4px', fontSize: '12px'
                                                                        }}>{user.isOut == "Y" ? '탈퇴' : '활동 중'}</div>
                                                                </div>
                                                        ))}
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <button style={{ backgroundColor: 'white', border: '0px', textDecoration: 'underline', textAlign: 'left', fontSize: '0.8em' }} onClick={() => setShowMore(!showMore)}>
                                                                {showMore ? "접기" : "더보기"}
                                                        </button>
                                                        <button
                                                                className='button'
                                                                style={{ marginTop: '20px', border: '1px solid blue', backgroundColor: 'blue' }}
                                                                onClick={handleBulkUnregister}>
                                                                탈퇴처리
                                                        </button>
                                                </div>
                                        </div>
                                        <div className='category-content'>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                                        <h4 style={{ textAlign: 'left', fontWeight: '600' }}>탈퇴회원 검색</h4>
                                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                <select
                                                                        value={userSearchKey}
                                                                        onChange={(e) => setUserOutSearchKey(e.target.value)}
                                                                        className="cat1" style={{
                                                                                width: '80px', padding: '3px', borderRadius: '10px',
                                                                                fontSize: '0.8em', height: '30px', marginTop: '5PX'
                                                                        }}
                                                                >
                                                                        <option value="username">이름</option>
                                                                        <option value="userid">아이디</option>
                                                                        <option value="email">이메일</option>
                                                                        <option value="tel">전화번호</option>
                                                                </select>
                                                                <div className="search-bar">
                                                                        <input type="text" placeholder="검색어를 입력해주세요."
                                                                                value={userOutSearchWord}
                                                                                onChange={(e) => setUserOutSearchWord(e.target.value)}
                                                                                onKeyDown={(e) => e.key === 'Enter' && handleUserSearch()}
                                                                        />
                                                                        <button className="search-icon" onClick={handleUserSearch}></button>
                                                                </div>
                                                        </div>
                                                </div>
                                                <hr />
                                                <div className="row border real-dark-border mx-0" style={{ backgroundColor: '#eeeeee', fontSize: '0.8em', textAlign: 'center', padding: '5px' }}>
                                                        <div className="col-1 border-start">번호</div>
                                                        <div className="col-2 border-start">아이디</div>
                                                        <div className="col-2 border-start">성명</div>
                                                        <div className="col-2 border-start">이메일</div>
                                                        <div className="col-2 border-start">연락처</div>
                                                        <div className="col-2 border-start">가입일</div>
                                                        <div className="col-1 border-start">관리</div>
                                                </div>
                                                {invisibleUsers
                                                        .filter(user => user.isOut !== "N")
                                                        .map((user) => (
                                                                <div key={user.mid} className="row border real-dark-border mx-0" style={{ fontSize: '0.8em', textAlign: 'center', padding: '5px' }}>
                                                                        <div className="col-1 border-start">{user.mid}</div>
                                                                        <div className="col-2 border-start">{user.userid}</div>
                                                                        <div className="col-2 border-start">{user.username}</div>
                                                                        <div className="col-2 border-start">{user.email}</div>
                                                                        <div className="col-2 border-start">{user.tel}</div>
                                                                        <div className="col-2 border-start">{user.writedate.slice(0, 10)}</div>
                                                                        <div className="col-1 border-start" style={{
                                                                                background: user.isOut == "Y" ? '#ffebee' : '#e3f2fd',
                                                                                color: user.isOut == "Y" ? '#c62828' : '#1976d2',
                                                                                padding: '2px 6px', borderRadius: '4px', fontSize: '12px'
                                                                        }}>{user.isOut == "Y" ? '탈퇴' : '활동 중'}</div>
                                                                </div>
                                                        ))}
                                                <button style={{ backgroundColor: 'white', border: '0px', textDecoration: 'underline', textAlign: 'left', fontSize: '0.8em' }} onClick={() => setShowMoreOut(!showMoreOut)}>
                                                        {showMoreOut ? "접기" : "더보기"}
                                                </button>
                                        </div>
                                </div>
                        )}

                        {/* 기업관리 페이지 */}
                        {activeMenu == '기업 관리' && (
                                <div style={{ display: 'flex', flexDirection: 'column', width: '80%' }}>
                                        <div className='category-content'>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                                        <h4 style={{ textAlign: 'left', fontWeight: '600' }}>기업 검색</h4>
                                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                <select
                                                                        value={companySearchKey}
                                                                        onChange={(e) => setCompanySearchKey(e.target.value)}
                                                                        className="cat1" style={{
                                                                                width: '80px', padding: '3px', borderRadius: '10px',
                                                                                fontSize: '0.8em', height: '30px', marginTop: '5PX'
                                                                        }}
                                                                >
                                                                        <option value="businessName">이름</option>
                                                                        <option value="userid">아이디</option>
                                                                        <option value="email">이메일</option>
                                                                        <option value="tel">전화번호</option>
                                                                </select>
                                                                <div className="search-bar">
                                                                        <input type="text" placeholder="검색어를 입력해주세요."
                                                                                value={companySearchWord}
                                                                                onChange={(e) => setCompanySearchWord(e.target.value)}
                                                                                onKeyDown={(e) => e.key === 'Enter' && handleCompanySearch()}
                                                                        />
                                                                        <button className="search-icon" onClick={handleCompanySearch}></button>
                                                                </div>
                                                        </div>
                                                </div>
                                                <hr />
                                                <div className="row border real-dark-border mx-0" style={{ backgroundColor: '#eeeeee', fontSize: '0.8em', textAlign: 'center', padding: '5px' }}>
                                                        <div className="col-1 border-start">번호</div>
                                                        <div className="col-2 border-start">아이디</div>
                                                        <div className="col-2 border-start">성명</div>
                                                        <div className="col-2 border-start">이메일</div>
                                                        <div className="col-2 border-start">연락처</div>
                                                        <div className="col-2 border-start">가입일</div>
                                                        <div className="col-1 border-start">관리</div>
                                                </div>
                                                {visibleCompanys
                                                        .map((company) => (
                                                                <div key={company.cid} className="row border real-dark-border mx-0" style={{ fontSize: '0.8em', textAlign: 'center', padding: '5px' }}>
                                                                        <div className="col-1 border-start" style={{ fontSize: '0.8em', textAlign: 'center', verticalAlign: 'middle' }}>
                                                                                <input type="checkbox" aria-label="항목 선택" />
                                                                        </div>
                                                                        <div className="col-2 border-start">{company.userid}</div>
                                                                        <div className="col-2 border-start">{company.businessName}</div>
                                                                        <div className="col-2 border-start">{company.email}</div>
                                                                        <div className="col-2 border-start">{company.tel}</div>
                                                                        <div className="col-2 border-start">{company.writedate.slice(0, 10)}</div>
                                                                        <div className="col-1 border-start" style={{
                                                                                background: company.isOut == 'Y' ? '#ffebee' : '#e3f2fd',
                                                                                color: company.isOut == 'Y' ? '#c62828' : '#1976d2',
                                                                                padding: '2px 6px', borderRadius: '4px', fontSize: '12px'
                                                                        }}>{company.isOut == 'Y' ? '탈퇴' : '활동 중'}</div>
                                                                </div>
                                                        ))}
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <button style={{ backgroundColor: 'white', border: '0px', textDecoration: 'underline', textAlign: 'left', fontSize: '0.8em' }} onClick={() => setCShowMore(!cshowMore)}>
                                                                {cshowMore ? "접기" : "더보기"}
                                                        </button>
                                                        <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
                                                                {/* 기업명 검색 상태이면 해당 기업 컨텍스트로 통계 열기 */}
                                                                {companySearchKey === 'businessName' && companySearchWord && (
                                                                        <button className='button'
                                                                                style={{ border: '1px solid #2d7df4', backgroundColor: '#2d7df4' }}
                                                                                onClick={() => handleOpenSalesChart('company', companySearchWord)}
                                                                        >
                                                                                📊 "{companySearchWord}" 매출 통계
                                                                        </button>
                                                                )}
                                                                <button className='button' style={{ border: '1px solid blue', backgroundColor: 'blue' }}>탈퇴처리</button>
                                                        </div>
                                                </div>
                                        </div>
                                        <div className='category-content'>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                                        <h4 style={{ textAlign: 'left', fontWeight: '600' }}>탈퇴기업 검색</h4>
                                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                <select
                                                                        value={companySearchKey}
                                                                        onChange={(e) => setCompanyOutSearchKey(e.target.value)}
                                                                        className="cat1" style={{
                                                                                width: '80px', padding: '3px', borderRadius: '10px',
                                                                                fontSize: '0.8em', height: '30px', marginTop: '5PX'
                                                                        }}
                                                                >
                                                                        <option value="businessName">이름</option>
                                                                        <option value="userid">아이디</option>
                                                                        <option value="email">이메일</option>
                                                                        <option value="tel">전화번호</option>
                                                                </select>
                                                                <div className="search-bar">
                                                                        <input type="text" placeholder="검색어를 입력해주세요."
                                                                                value={companyOutSearchWord}
                                                                                onChange={(e) => setCompanyOutSearchWord(e.target.value)}
                                                                                onKeyDown={(e) => e.key === 'Enter' && handleCompanySearch()}
                                                                        />
                                                                        <button className="search-icon" onClick={handleCompanySearch}></button>
                                                                </div>
                                                        </div>
                                                </div>
                                                <hr />
                                                <div className="row border real-dark-border mx-0" style={{ backgroundColor: '#eeeeee', fontSize: '0.8em', textAlign: 'center', padding: '5px' }}>
                                                        <div className="col-1 border-start">번호</div>
                                                        <div className="col-2 border-start">아이디</div>
                                                        <div className="col-2 border-start">성명</div>
                                                        <div className="col-2 border-start">이메일</div>
                                                        <div className="col-2 border-start">연락처</div>
                                                        <div className="col-2 border-start">가입일</div>
                                                        <div className="col-1 border-start">관리</div>
                                                </div>
                                                {invisibleCompanys
                                                        .filter(company => company.isOut !== 'N')
                                                        .map((company) => (
                                                                <div key={company.cid} className="row border real-dark-border mx-0" style={{ fontSize: '0.8em', textAlign: 'center', padding: '5px' }}>
                                                                        <div className="col-1 border-start">{company.cid}</div>
                                                                        <div className="col-2 border-start">{company.userid}</div>
                                                                        <div className="col-2 border-start">{company.name}</div>
                                                                        <div className="col-2 border-start">{company.email}</div>
                                                                        <div className="col-2 border-start">{company.tel}</div>
                                                                        <div className="col-2 border-start">{company.writedate.slice(0, 10)}</div>
                                                                        <div className="col-1 border-start" style={{
                                                                                background: company.isOut == 'Y' ? '#ffebee' : '#e3f2fd',
                                                                                color: company.isOut == 'Y' ? '#c62828' : '#1976d2',
                                                                                padding: '2px 6px', borderRadius: '4px', fontSize: '12px'
                                                                        }}>{company.isOut == 'Y' ? '탈퇴' : '활동 중'}</div>
                                                                </div>
                                                        ))}
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <button style={{ backgroundColor: 'white', border: '0px', textDecoration: 'underline', textAlign: 'left', fontSize: '0.8em' }} onClick={() => setCShowMoreOut(!cshowMoreOut)}>
                                                                {cshowMoreOut ? "접기" : "더보기"}
                                                        </button>
                                                </div>
                                        </div>
                                </div>
                        )}
                        {/* 상품관리 페이지 */}
                        {activeMenu == '상품 관리' && (
                                <div style={{ display: 'flex', flexDirection: 'column', width: '80%' }}>
                                        <div className='category-content'>
                                                {/* 상품검색 */}
                                                <h4 style={{ textAlign: 'left', fontWeight: '600px' }}>상품 검색</h4>
                                                <hr />
                                                <div style={{ textAlign: 'left', width: '500px' }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                                                                <p>카테고리 :</p>
                                                                <select className="cat1"
                                                                        value={productBCategory}
                                                                        onChange={(e) => setProductBCategory(e.target.value)}
                                                                        style={{ width: '200px', padding: '3px', borderRadius: '10px', fontSize: '0.8em', height: '30px' }}
                                                                >
                                                                        <option value="">대분류</option>
                                                                        {[...new Set(products.map(pd => pd.b_category))].map((cat) => (
                                                                                <option key={cat} value={cat}>{cat}</option>
                                                                        ))}
                                                                </select>
                                                                <select className="cat1"
                                                                        value={productSCategory}
                                                                        onChange={(e) => setProductSCategory(e.target.value)}
                                                                        style={{ width: '200px', padding: '3px', borderRadius: '10px', fontSize: '0.8em', height: '30px' }}
                                                                >
                                                                        <option value="">소분류</option>
                                                                        {[...new Set(products.map(pd => pd.scategory))].map((cat) => (
                                                                                <option key={cat} value={cat}>{cat}</option>
                                                                        ))}
                                                                </select>
                                                        </div>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                <p>검색어 :</p>
                                                                <select
                                                                        className="cat1" style={{
                                                                                width: '100px', padding: '3px', borderRadius: '10px',
                                                                                fontSize: '0.8em', height: '30px'
                                                                        }}
                                                                        value={productSearchKey} onChange={(e) => setProductSearchKey(e.target.value)}
                                                                >
                                                                        <option value="null">전체</option>
                                                                        <option value="name">상품명</option>
                                                                        <option value="businessName">기업명</option>
                                                                </select>
                                                                <input type='text' value={productSearchWord} onChange={(e) => setProductSearchWord(e.target.value)}
                                                                        style={{
                                                                                width: '320px', padding: '3px', borderRadius: '10px', fontSize: '0.8em',
                                                                                height: '30px', border: '1px solid #333333'
                                                                        }} placeholder="검색어를 입력하세요."
                                                                ></input>
                                                        </div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                                                <p style={{ width: "80px d-inline-flex" }}>등록일자 :</p>
                                                                <div className="row mx-0" style={{ cursor: 'pointer', backgroundColor: '#eeeeee', fontSize: '0.8em', border: '1px solid #333333', borderRadius: '10px', width: '400px' }}>
                                                                        <div className="col p-1 text-center" onClick={() => handleDateProductPreset('day')}>당일</div>
                                                                        <div className="col p-1 text-center" style={{ borderLeft: '1px solid black' }} onClick={() => handleDateProductPreset('week')}>일주일</div>
                                                                        <div className="col p-1 text-center" style={{ borderLeft: '1px solid black' }} onClick={() => handleDateProductPreset('month', 1)}>1개월</div>
                                                                        <div className="col p-1 text-center" style={{ borderLeft: '1px solid black' }} onClick={() => handleDateProductPreset('month', 3)}>3개월</div>
                                                                        <div className="col p-1 text-center" style={{ borderLeft: '1px solid black' }} onClick={() => handleDateProductPreset('year')}>1년</div>
                                                                </div>
                                                        </div>
                                                        <div style={{ marginLeft: "85px" }}>
                                                                <div style={{ display: "flex", gap: "10px", fontSize: "0.8em", padding: "10px" }}>
                                                                        <input type='date' className='calendar' value={productStartDate} onChange={(e) => setProductStartDate(e.target.value)} />
                                                                        <b>~</b>
                                                                        <input type='date' className='calendar' value={productEndDate} onChange={(e) => setProductEndDate(e.target.value)} />
                                                                </div>
                                                        </div>
                                                        {/* <button
                                                                onClick={() => {}}
                                                                className='button2'
                                                                style={{marginLeft: 'auto', display: 'block'}}
                                                        >
                                                                검색
                                                        </button> */}
                                                </div>
                                                {/* 상품 목록 */}
                                                <h4 style={{ textAlign: 'left', fontWeight: '600', marginTop: '20px' }}>상품 목록</h4>
                                                <hr />
                                                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                                        <button onClick={handleBulkProDelete} className='button' style={{ border: '1px solid blue', backgroundColor: 'blue', marginLeft: '10px' }}>선택삭제</button>
                                                        <div style={{ display: 'flex', gap: '8px' }}>
                                                                {/* 상품명 또는 기업명 검색 상태이면 해당 컨텍스트로 통계 열기 */}
                                                                {productSearchWord && (productSearchKey === 'name' || productSearchKey === 'businessName') && (
                                                                        <button className='button'
                                                                                style={{ border: '1px solid #2d7df4', backgroundColor: '#2d7df4' }}
                                                                                onClick={() => handleOpenSalesChart(
                                                                                        productSearchKey === 'businessName' ? 'company' : 'product',
                                                                                        productSearchWord
                                                                                )}
                                                                        >
                                                                                📊 "{productSearchWord}" 매출 통계
                                                                        </button>
                                                                )}
                                                                <button className='button' style={{ border: '1px solid blue', backgroundColor: 'blue' }}
                                                                        onClick={() => { location.href = "/mypage/addproduct" }}
                                                                >
                                                                        상품등록
                                                                </button>
                                                        </div>
                                                </div>

                                                <table className="table table-bordered" style={{ width: '100%', textAlign: 'center', border: '1px solid #787878', marginTop: '20px' }}>
                                                        <thead>
                                                                <tr style={{ fontSize: '0.8em' }}>
                                                                        <th style={{ backgroundColor: '#eeeeee' }}>일괄삭제</th>
                                                                        <th style={{ backgroundColor: '#eeeeee' }}>기업명</th>
                                                                        <th style={{ backgroundColor: '#eeeeee' }}>카테고리</th>
                                                                        <th style={{ backgroundColor: '#eeeeee' }}>상품명</th>
                                                                        <th style={{ backgroundColor: '#eeeeee' }}>판매가</th>
                                                                        <th style={{ backgroundColor: '#eeeeee' }}>등록일</th>
                                                                        <th style={{ backgroundColor: '#eeeeee' }}>재고</th>
                                                                        <th style={{ backgroundColor: '#eeeeee' }}>상태</th>
                                                                        <th style={{ backgroundColor: '#eeeeee' }}>목록 수정/삭제</th>
                                                                </tr>
                                                        </thead>
                                                        {filteredProducts.slice((currentPage3 - 1) * postsPerPage3, currentPage3 * postsPerPage3).map((pd) => (
                                                                <tbody key={pd.pid}>
                                                                        <tr>
                                                                                <td style={{ fontSize: '0.8em', textAlign: 'center', verticalAlign: 'middle' }}>
                                                                                        <input type="checkbox" checked={selectedProIds.includes(pd.pid)}
                                                                                                onChange={() => handleProCheck(pd.pid)}
                                                                                        />
                                                                                </td>
                                                                                {/* 기업명 */}
                                                                                <td style={{ fontSize: '0.8em', textAlign: 'center', verticalAlign: 'middle' }}>{pd.company?.businessName}</td>
                                                                                {/* 카테고리 */}
                                                                                <td style={{ fontSize: '0.8em', textAlign: 'center', verticalAlign: 'middle' }}>{pd.b_category}〉{pd.scategory}</td>
                                                                                {/* 상품명 - 수정 모드 */}
                                                                                <td style={{ fontSize: '0.8em', textAlign: 'center', verticalAlign: 'middle' }}>
                                                                                        {proEditingId === pd.pid ? (
                                                                                                <input
                                                                                                        name="name"
                                                                                                        value={proEditForm.name || ''}
                                                                                                        onChange={handleProEditChange}
                                                                                                        style={{ width: '160px', padding: '3px 6px', border: '1px solid #2d7df4', borderRadius: '4px', fontSize: '0.85em' }}
                                                                                                />
                                                                                        ) : (
                                                                                                <div style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: '0 auto' }}>
                                                                                                        {pd.name}
                                                                                                </div>
                                                                                        )}
                                                                                </td>
                                                                                {/* 판매가 - 수정 모드 */}
                                                                                <td style={{ fontSize: '0.8em', textAlign: 'center', verticalAlign: 'middle' }}>
                                                                                        {proEditingId === pd.pid ? (
                                                                                                <input
                                                                                                        name="price"
                                                                                                        value={proEditForm.price || ''}
                                                                                                        onChange={handleProEditChange}
                                                                                                        style={{ width: '90px', padding: '3px 6px', border: '1px solid #2d7df4', borderRadius: '4px', fontSize: '0.85em' }}
                                                                                                />
                                                                                        ) : pd.price}
                                                                                </td>
                                                                                {/* 등록일 */}
                                                                                <td style={{ fontSize: '0.8em', textAlign: 'center', verticalAlign: 'middle' }}>{pd.writedate?.slice(0, 10)}</td>
                                                                                {/* 재고 - 수정 모드 */}
                                                                                <td style={{ fontSize: '0.8em', textAlign: 'center', verticalAlign: 'middle' }}>
                                                                                        {proEditingId === pd.pid ? (
                                                                                                <input
                                                                                                        name="count"
                                                                                                        type="number"
                                                                                                        value={proEditForm.count ?? 0}
                                                                                                        onChange={handleProEditChange}
                                                                                                        style={{ width: '60px', padding: '3px 6px', border: '1px solid #2d7df4', borderRadius: '4px', fontSize: '0.85em' }}
                                                                                                />
                                                                                        ) : pd.count}
                                                                                </td>
                                                                                {/* 상태 */}
                                                                                <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                                                                        <div className="col-7" style={{
                                                                                                display: 'inline-block', width: 'auto',
                                                                                                background: pd.count == 0 ? '#ffebee' : '#e3f2fd',
                                                                                                color: pd.count == 0 ? '#c62828' : '#1976d2',
                                                                                                padding: '2px 6px', borderRadius: '4px', fontSize: '12px'
                                                                                        }}>
                                                                                                {pd.count == 0 ? '품절' : '재고 있음'}
                                                                                        </div>
                                                                                </td>
                                                                                {/* 수정/삭제 버튼 */}
                                                                                <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                                                                        {proEditingId === pd.pid ? (
                                                                                                <>
                                                                                                        <button className='button2' style={{ marginRight: '6px', backgroundColor: '#2d7df4', border: '1px solid #2d7df4', color: '#fff' }}
                                                                                                                onClick={handleProSaveClick}>저장</button>
                                                                                                        <button className='button2' onClick={() => setProEditingId(null)}>취소</button>
                                                                                                </>
                                                                                        ) : (
                                                                                                <>
                                                                                                        <button className='button2' style={{ marginRight: '10px' }}
                                                                                                                onClick={() => handleProEditClick(pd)}>수정</button>
                                                                                                        <button className='button2' onClick={() => handleProDelete(pd.pid)}>삭제</button>
                                                                                                </>
                                                                                        )}
                                                                                </td>
                                                                        </tr>
                                                                </tbody>
                                                        ))}
                                                </table>
                                                <nav>
                                                        <ul className="pagination" style={{ marginTop: '20px' }}>
                                                                <li>
                                                                        <a className='paging-text' href="#" onClick={(e) => paginate3(currentPage3 - 1, e)}
                                                                                style={{ textDecoration: 'none', color: currentPage3 === 1 ? '#ccc' : '#333' }}>
                                                                                ≪
                                                                        </a>
                                                                </li>
                                                                {Array.from({ length: totalPages3 }, (_, i) => i + 1).map((num) => (
                                                                        <li key={num}>
                                                                                <a
                                                                                        href="#"
                                                                                        onClick={(e) => paginate3(num, e)}
                                                                                        className={currentPage3 === num ? 'paging-active-text' : 'paging-text'}
                                                                                        style={{
                                                                                                textDecoration: 'none',
                                                                                                fontWeight: currentPage3 === num ? 'bold' : 'normal',
                                                                                                color: currentPage3 === num ? '#000' : '#888'
                                                                                        }}
                                                                                >
                                                                                        {num}
                                                                                </a>
                                                                        </li>
                                                                ))}
                                                                <li>
                                                                        <a className='paging-text' href="#" onClick={(e) => paginate3(currentPage3 + 1, e)}
                                                                                style={{ textDecoration: 'none', color: currentPage3 === totalPages3 ? '#ccc' : '#333' }}>
                                                                                ≫
                                                                        </a>
                                                                </li>
                                                        </ul>
                                                </nav>
                                        </div>
                                </div>
                        )}
                        {/* 세일관리 페이지 */}
                        {activeMenu == '세일 관리' && (
                                <div className='category-content'>
                                        <Reservation
                                                reservedEvents={reservedEvents}
                                                selectedEventIds={selectedEventIds}
                                                handleEventCheck={handleEventCheck}
                                                handleBulkEventDelete={handleBulkEventDelete}
                                                handleEventDelete={handleEventDelete}
                                                handleEventEditClick={handleEventEditClick}
                                                setEventModalOpen={setEventModalOpen}
                                        />
                                        <EventList
                                                activeMenu={activeMenu}
                                                events={events}
                                                endedEvents={endedEvents}
                                                selectedEventIds={selectedEventIds}
                                                handleEventCheck={handleEventCheck}
                                                handleBulkEventDelete={handleBulkEventDelete}
                                                handleEventDelete={handleEventDelete}
                                                handleEventEditClick={handleEventEditClick}
                                                setEventModalOpen={setEventModalOpen}
                                        />
                                </div>
                        )}
                        {activeMenu == '-예약' && (
                                <div className='category-content'>
                                        <Reservation
                                                reservedEvents={reservedEvents}
                                                selectedEventIds={selectedEventIds}
                                                handleEventCheck={handleEventCheck}
                                                handleBulkEventDelete={handleBulkEventDelete}
                                                handleEventDelete={handleEventDelete}
                                                handleEventEditClick={handleEventEditClick}
                                                setEventModalOpen={setEventModalOpen}
                                        />
                                </div>
                        )}
                        {activeMenu == '-이벤트 관리' && (
                                <div className='category-content'>
                                        <EventList
                                                activeMenu={activeMenu}
                                                events={events}
                                                endedEvents={endedEvents}
                                                selectedEventIds={selectedEventIds}
                                                handleEventCheck={handleEventCheck}
                                                handleBulkEventDelete={handleBulkEventDelete}
                                                handleEventDelete={handleEventDelete}
                                                handleEventEditClick={handleEventEditClick}
                                                setEventModalOpen={setEventModalOpen}
                                        />
                                </div>
                        )}
                        {/* 문의관리 페이지 */}
                        {activeMenu === '문의 관리' && (
                                <div className="category-content">
                                        <div style={{ padding: "30px", background: "#fff", borderRadius: "8px", minHeight: "600px" }}>
                                                <div style={{ marginBottom: "25px", textAlign: "left" }}>
                                                        <h4 style={{ fontWeight: "bold", margin: 0, color: "#222" }}>1:1 고객 문의 관리</h4>
                                                        <p style={{ color: "#777", fontSize: "13px", margin: "5px 0 0 0" }}>
                                                                목록 줄을 클릭하면 상세 내용이 열리고, [답변 작성/수정] 버튼을 클릭해야만 팝업 창이 뜹니다.
                                                        </p>
                                                </div>

                                                <div className="inquiry-list-wrapper">
                                                        <table className="management-table">
                                                                <thead>
                                                                        <tr>
                                                                                <th style={{ width: '8%' }}>번호</th>
                                                                                <th style={{ width: '12%' }}>카테고리</th>
                                                                                <th>제목</th>
                                                                                <th style={{ width: '12%' }}>작성자</th>
                                                                                <th style={{ width: '15%' }}>작성일</th>
                                                                                <th style={{ width: '15%', textAlign: 'center' }}>상태</th>
                                                                        </tr>
                                                                </thead>
                                                                {asks.length === 0 ? (
                                                                        <tbody>
                                                                                <tr>
                                                                                        <td colSpan="6" className="empty-row" style={{ textAlign: 'center', padding: '40px 0' }}>
                                                                                                접수된 고객 문의가 존재하지 않습니다.
                                                                                        </td>
                                                                                </tr>
                                                                        </tbody>
                                                                ) : (
                                                                        asks.map((q, index) => {
                                                                                const rawDate = q.writedate || "";
                                                                                const formattedDate = rawDate.length >= 10 ? rawDate.substring(0, 10) : "-";
                                                                                const isAnswered = q.answer !== null && q.answer !== undefined && q.answer.trim() !== "";

                                                                                const isExpanded = selectedInquiry?.s_id === q.s_id;
                                                                                console.log("👉 백엔드에서 넘어온 문의글 데이터 1개 분석:", asks);

                                                                                return (
                                                                                        <tbody key={q.s_id || index}>
                                                                                                <tr
                                                                                                        onClick={() => {
                                                                                                                setSelectedInquiry(selectedInquiry?.s_id === q.s_id ? null : q);
                                                                                                        }}
                                                                                                        style={{ cursor: 'pointer' }}
                                                                                                >
                                                                                                        <td>{asks.length - index}</td>
                                                                                                        <td><span className="category-tag">{q.category}</span></td>
                                                                                                        <td className="inquiry-title-cell" style={{ textAlign: 'left' }}>{q.subject}</td>
                                                                                                        <td>{q.writer || "회원"}</td>
                                                                                                        <td>{formattedDate}</td>
                                                                                                        <td style={{ textAlign: 'center' }}>
                                                                                                                <span className={`status-badge ${isAnswered ? 'complete' : 'waiting'}`}>
                                                                                                                        {isAnswered ? "답변완료" : "답변대기"}
                                                                                                                </span>
                                                                                                        </td>
                                                                                                </tr>

                                                                                                {isExpanded && (
                                                                                                        <tr className="inquiry-detail-row" onClick={(e) => e.stopPropagation()}>
                                                                                                                <td colSpan="6" style={{ background: '#fafafa', padding: '20px' }}>
                                                                                                                        <div className="my-detail-content" style={{ textAlign: 'left' }}>

                                                                                                                                {/* Q. 고객 문의 내용 */}
                                                                                                                                <div className="question-box" style={{ marginBottom: '15px' }}>

                                                                                                                                        <strong>Q. 문의 내용</strong>
                                                                                                                                        <p style={{ whiteSpace: 'pre-wrap', marginTop: '8px', color: '#333' }}>{q.context}</p>
                                                                                                                                        {(() => {
                                                                                                                                                // 1. 백엔드 컨트롤러가 entity.setFilename()으로 넣어준 변수명 'filename'을 정확히 읽어옵니다.
                                                                                                                                                const realFileName = q.filename || selectedInquiry?.filename;

                                                                                                                                                if (realFileName && realFileName !== "null") {
                                                                                                                                                        return (
                                                                                                                                                                <div className="attached-img-zone my-3">
                                                                                                                                                                        <p><strong>첨부 사진:</strong></p>
                                                                                                                                                                        <img
                                                                                                                                                                                // 2. WebMvcConfig가 열어준 /upload/ 경로와 매핑합니다. (포트는 대호님 백엔드 포트)
                                                                                                                                                                                src={`http://192.168.4.60:9991/upload/${realFileName}`}
                                                                                                                                                                                alt="사용자 첨부 이미지"
                                                                                                                                                                                style={{
                                                                                                                                                                                        maxWidth: '100%',
                                                                                                                                                                                        maxHeight: '350px',
                                                                                                                                                                                        borderRadius: '8px',
                                                                                                                                                                                        border: '1px solid #ddd'
                                                                                                                                                                                }}
                                                                                                                                                                                onError={(e) => {
                                                                                                                                                                                        // 9991 포트에서 실패할 경우, 다른 백엔드 구동 포트인 9989 환경으로 자동 스위칭 보완
                                                                                                                                                                                        if (!e.target.src.includes(":9991")) {
                                                                                                                                                                                                e.target.src = `http://192.168.4.60:9991/upload/${realFileName}`;
                                                                                                                                                                                        }
                                                                                                                                                                                }}
                                                                                                                                                                        />
                                                                                                                                                                </div>
                                                                                                                                                        );
                                                                                                                                                }
                                                                                                                                                return null;
                                                                                                                                        })()}
                                                                                                                                </div>

                                                                                                                                {/* A. 관리자 기존 답변 내역 */}
                                                                                                                                {
                                                                                                                                        isAnswered ? (
                                                                                                                                                <div className="answer-box">
                                                                                                                                                        <strong>A. 답변 내용</strong>
                                                                                                                                                        <p style={{ whiteSpace: 'pre-wrap', marginTop: '8px', color: '#333' }}>{q.answer}</p>
                                                                                                                                                </div>
                                                                                                                                        ) : (
                                                                                                                                                <div className="waiting-box" style={{ padding: '10px 0', color: '#999' }}>
                                                                                                                                                        <small>아직 등록된 답변이 없습니다. 아래 버튼을 눌러 답변을 작성해 주세요.</small>
                                                                                                                                                </div>
                                                                                                                                        )
                                                                                                                                }

                                                                                                                                <div style={{ textAlign: 'right', marginTop: '15px' }}>
                                                                                                                                        <button
                                                                                                                                                type="button"
                                                                                                                                                style={{
                                                                                                                                                        padding: "6px 16px",
                                                                                                                                                        background: isAnswered ? "#4caf50" : "#ff9800",
                                                                                                                                                        color: "#fff",
                                                                                                                                                        border: "none",
                                                                                                                                                        borderRadius: "4px",
                                                                                                                                                        cursor: "pointer",
                                                                                                                                                        fontSize: "13px",
                                                                                                                                                        fontWeight: "bold"
                                                                                                                                                }}
                                                                                                                                                onClick={(e) => {
                                                                                                                                                        e.stopPropagation();

                                                                                                                                                        setReplyText(q.answer || "");

                                                                                                                                                        // 별도의 state 선언 없이, 선택된 객체에 임시 플래그 속성을 심어 모달을 띄웁니다!
                                                                                                                                                        setSelectedInquiry({ ...q, showModal: true });
                                                                                                                                                }}
                                                                                                                                        >
                                                                                                                                                {isAnswered ? "답변 수정하기" : "답변 작성하기"}
                                                                                                                                        </button>
                                                                                                                                </div>

                                                                                                                        </div>
                                                                                                                </td>
                                                                                                        </tr>
                                                                                                )}
                                                                                        </tbody>
                                                                                );
                                                                        })
                                                                )}
                                                        </table>
                                                </div>

                                                {/* 관리자 답변 작성 및 수정 팝업 모달창 (showModal 플래그가 들어있을 때만 정확히 팝업) */}
                                                {selectedInquiry && selectedInquiry.showModal === true && (
                                                        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.4)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 10000 }}>
                                                                <div style={{ background: "#fff", padding: "30px", borderRadius: "12px", width: "520px", position: "relative", boxShadow: "0 8px 24px rgba(0,0,0,0.15)" }}>
                                                                        <button type="button" style={{ position: "absolute", top: "15px", right: "15px", background: "none", border: "none", fontSize: "22px", cursor: "pointer", color: '#aaa' }} onClick={() => { setSelectedInquiry(null); setReplyText(""); }}>&times;</button>

                                                                        <h4 style={{ marginBottom: "20px", fontWeight: "bold", textAlign: 'left', borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
                                                                                고객 문의 답변 {selectedInquiry.answer ? "수정" : "등록"}
                                                                        </h4>

                                                                        <div style={{ background: "#f8f9fa", padding: "15px", borderRadius: "6px", marginBottom: "20px", textAlign: "left", fontSize: "14px", border: "1px solid #f1f3f5" }}>
                                                                                <div style={{ marginBottom: "6px" }}><strong>제목:</strong> {selectedInquiry.subject}</div>
                                                                                <div style={{ whiteSpace: "pre-wrap", color: "#555" }}><strong>내용:</strong> {selectedInquiry.context}</div>
                                                                        </div>

                                                                        <div style={{ marginBottom: "25px", textAlign: "left" }}>
                                                                                <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", fontSize: '14px', color: '#222' }}>공식 관리자 답변 입력</label>
                                                                                <textarea
                                                                                        style={{ width: "100%", height: "140px", padding: "12px", border: "1px solid #ddd", borderRadius: "6px", resize: "none", boxSizing: 'border-box', lineHeight: '1.5', fontSize: "14px" }}
                                                                                        value={replyText}
                                                                                        onChange={(e) => setReplyText(e.target.value)}
                                                                                        placeholder="여기에 적은 답변은 실시간으로 사용자 마이페이지에 연동됩니다."
                                                                                />
                                                                        </div>

                                                                        <div style={{ display: "flex", gap: "10px" }}>
                                                                                <button type="button" style={{ flex: 1, padding: "12px", background: "#eee", color: "#333", border: "none", borderRadius: "6px", fontSize: "14px", cursor: "pointer" }} onClick={() => { setSelectedInquiry(null); setReplyText(""); }}>닫기</button>
                                                                                <button
                                                                                        type="button"
                                                                                        style={{ flex: 1, padding: "12px", background: selectedInquiry.answer ? "#4caf50" : "#ff9800", color: "#fff", border: "none", borderRadius: "6px", fontSize: "14px", cursor: "pointer", fontWeight: 'bold' }}
                                                                                        onClick={() => handleAdminReplySubmit(selectedInquiry.s_id)}
                                                                                >
                                                                                        답변 완료
                                                                                </button>
                                                                        </div>
                                                                </div>
                                                        </div>
                                                )}
                                        </div>
                                </div>
                        )
                        }
                        {/* 통계 페이지 */}
                        {activeMenu == '통계' && (
                                <div style={{ display: 'flex', flexDirection: 'column', width: '80%' }}>
                                        <div className='category-content'>
                                                <h4 style={{ textAlign: 'left', fontWeight: '600' }}>통계 정보 검색</h4>
                                                <hr />
                                                <div style={{ textAlign: 'left', width: '500px' }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                <p>기업명 :</p>
                                                                <select className="cat1" style={{
                                                                        width: '100px', padding: '3px', borderRadius: '10px',
                                                                        fontSize: '0.8em', height: '30px'
                                                                }}
                                                                        value={buySearchKey}
                                                                        onChange={(e) => setBuySearchKey(e.target.value)}
                                                                >
                                                                        <option value="">전체</option>
                                                                        <option value="name">상품명</option>
                                                                        <option value="businessName">기업명</option>
                                                                </select>
                                                                <input type='text' style={{
                                                                        width: '320px', padding: '3px',
                                                                        borderRadius: '10px', fontSize: '0.8em', height: '30px',
                                                                        border: '1px solid #333333'
                                                                }} placeholder="검색어를 입력하세요."
                                                                        value={buySearchWord}
                                                                        onChange={(e) => setBuySearchWord(e.target.value)}
                                                                />
                                                        </div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                                                <p style={{ width: "80px d-inline-flex" }}>등록일자 :</p>
                                                                <div className="row mx-0" style={{ cursor: 'pointer', backgroundColor: '#eeeeee', fontSize: '0.8em', border: '1px solid #333333', borderRadius: '10px', width: '400px' }}>
                                                                        <div className="col p-1 text-center" onClick={() => handleDateStatsPreset('day')}>당일</div>
                                                                        <div className="col p-1 text-center" style={{ borderLeft: '1px solid black' }} onClick={() => handleDateStatsPreset('week')}>일주일</div>
                                                                        <div className="col p-1 text-center" style={{ borderLeft: '1px solid black' }} onClick={() => handleDateStatsPreset('month', 1)}>1개월</div>
                                                                        <div className="col p-1 text-center" style={{ borderLeft: '1px solid black' }} onClick={() => handleDateStatsPreset('month', 3)}>3개월</div>
                                                                        <div className="col p-1 text-center" style={{ borderLeft: '1px solid black' }} onClick={() => handleDateStatsPreset('year')}>1년</div>
                                                                </div>
                                                        </div>
                                                        <div style={{ marginLeft: "85px" }}>
                                                                <div style={{ display: "flex", gap: "10px", fontSize: "0.8em", padding: "10px" }}>
                                                                        <input type='date' className='calendar'
                                                                                value={statsStartDate}
                                                                                onChange={(e) => setStatsStartDate(e.target.value)}
                                                                        />
                                                                        <b>~</b>
                                                                        <input type='date' className='calendar' value={statsEndDate}
                                                                                onChange={(e) => setStatsEndDate(e.target.value)} />
                                                                </div>
                                                        </div>
                                                </div>
                                                {/* 상품 목록 */}
                                                <h4 style={{ textAlign: 'left', fontWeight: '600', marginTop: '20px' }}>상품 목록</h4>
                                                <hr />
                                                <button className='button' style={{ marginLeft: '90%', border: '1px solid blue', backgroundColor: 'blue' }}
                                                        onClick={() => handleOpenSalesChart(
                                                                buySearchKey === 'businessName' ? 'company' : buySearchKey === 'name' ? 'product' : null,
                                                                buySearchWord || ''
                                                        )}
                                                >매출 통계</button>
                                                <table className="table table-bordered" style={{ width: '100%', textAlign: 'center', border: '1px solid #787878', marginTop: '20px' }}>
                                                        <thead>
                                                                <tr style={{ fontSize: '0.8em' }}>
                                                                        <th style={{ backgroundColor: '#eeeeee' }}>날짜</th>
                                                                        <th style={{ backgroundColor: '#eeeeee' }}>상품코드</th>
                                                                        <th style={{ backgroundColor: '#eeeeee' }}>카테고리</th>
                                                                        <th style={{ backgroundColor: '#eeeeee' }}>상품명</th>
                                                                        <th style={{ backgroundColor: '#eeeeee' }}>기업명</th>
                                                                        <th style={{ backgroundColor: '#eeeeee' }}>판매가</th>
                                                                        <th style={{ backgroundColor: '#eeeeee' }}>주문건수</th>
                                                                        <th style={{ backgroundColor: '#eeeeee' }}>구매비</th>
                                                                        <th style={{ backgroundColor: '#eeeeee' }}>수수료</th>
                                                                        <th style={{ backgroundColor: '#eeeeee' }}>상세보기</th>
                                                                </tr>
                                                        </thead>
                                                        {filteredGroupedList.map((item) => (
                                                                <tbody key={item.pId}>
                                                                        <tr style={{ fontSize: '0.8em' }}>
                                                                                <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{item.latestDate}</td>
                                                                                <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{item.pId}</td>
                                                                                <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{item.product?.b_category}〉{item.product?.scategory}</td>
                                                                                <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{item.product?.name}</td>
                                                                                <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{item.product?.company?.businessName}</td>
                                                                                <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{item.product?.price}원</td>
                                                                                <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{item.totalCount}</td>
                                                                                <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                                                                        {(item.totalPrice - item.totalDiscount).toLocaleString()}원
                                                                                </td>
                                                                                <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                                                                                        {Math.floor(item.totalPrice * 0.1).toLocaleString()}원
                                                                                </td>
                                                                                <td>
                                                                                        <button className='button2' onClick={() => { setSelectedBuyItem(item); setModalOpen(true); }} style={{ width: '80px' }}>상세보기</button>
                                                                                </td>
                                                                        </tr>
                                                                </tbody>
                                                        ))}
                                                </table>
                                        </div>
                                </div>
                        )}
                        {modalOpen && (
                                <>
                                        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999 }} onClick={() => setModalOpen(false)} />
                                        <BuyTag />
                                </>
                        )}
                        {chartOpen && (
                                <>
                                        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999 }} onClick={() => setChartOpen(false)} />
                                        <ChartModel />
                                </>
                        )}
                        {/* 이벤트 수정 모달 */}
                        {editEventModalOpen && (
                                <div style={{
                                        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                                        backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999,
                                        display: 'flex', justifyContent: 'center', alignItems: 'center'
                                }}>
                                        <div style={{
                                        backgroundColor: 'white', padding: '30px', borderRadius: '8px',
                                        width: '500px', maxHeight: '80vh', overflowY: 'auto'
                                        }}>
                                        <h5 style={{ marginBottom: '20px', fontWeight: '600' }}>이벤트 수정</h5>

                                        <div style={{ marginBottom: '12px' }}>
                                                <div style={{ fontWeight: '500', marginBottom: '4px' }}>제목</div>
                                                <input type='text' style={{ width: '100%', padding: '6px' }}
                                                value={editEvent.subject}
                                                onChange={(e) => setEditEvent({ ...editEvent, subject: e.target.value })} />
                                        </div>

                                        <div style={{ marginBottom: '12px' }}>
                                                <div style={{ fontWeight: '500', marginBottom: '4px' }}>내용</div>
                                                <textarea style={{ width: '100%', padding: '6px', minHeight: '100px' }}
                                                value={editEvent.context}
                                                onChange={(e) => setEditEvent({ ...editEvent, context: e.target.value })} />
                                        </div>

                                        <div style={{ marginBottom: '12px' }}>
                                                <div style={{ fontWeight: '500', marginBottom: '4px' }}>시작일 (updatedate)</div>
                                                <input type='date' style={{ width: '100%', padding: '6px', marginTop: '4px' }}
                                                value={editEvent.updatedate}
                                                onChange={(e) => setEditEvent({ ...editEvent, updatedate: e.target.value })} />
                                        </div>

                                        <div style={{ marginBottom: '20px' }}>
                                                <div style={{ fontWeight: '500', marginBottom: '4px' }}>종료일 (enddate)</div>
                                                <input type='date' style={{ width: '100%', padding: '6px', marginTop: '4px' }}
                                                value={editEvent.enddate}
                                                onChange={(e) => setEditEvent({ ...editEvent, enddate: e.target.value })} />
                                        </div>

                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                                <button className='button2' onClick={() => setEditEventModalOpen(false)}>취소</button>
                                                <button className='button' style={{ border: '1px solid blue', backgroundColor: 'blue' }}
                                                onClick={handleEventEditSubmit}>저장</button>
                                        </div>
                                        </div>
                                </div>
                        )}
                        {eventModalOpen && (
                                <div style={{
                                        position: 'fixed', top: 0, left: 0,
                                        width: '100%', height: '100%',
                                        backgroundColor: 'rgba(0,0,0,0.4)',
                                        display: 'flex', justifyContent: 'center', alignItems: 'center',
                                        zIndex: 999
                                }}>
                                        <div style={{
                                                width: '800px', background: '#fff',
                                                padding: '30px', borderRadius: '14px',
                                                boxShadow: '0 6px 18px rgba(0,0,0,0.2)'
                                        }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <h4 style={{ marginBottom: '20px', fontWeight: '600' }}>게시글 등록</h4>
                                                        <button style={{
                                                                backgroundColor: 'white', border: '1px solid white',
                                                                textAlign: 'center', alignItems: 'center', marginBottom: '30px'
                                                        }}
                                                                onClick={() => setEventModalOpen(false)}
                                                        >
                                                                X
                                                        </button>
                                                </div>
                                                {/* 상품 선택 */}
                                                <div style={{ marginBottom: '12px' }}>
                                                        <div style={{ display: 'flex' }}>
                                                                <div style={{ fontWeight: '600', color: 'red' }}>*</div>
                                                                <label style={{ fontSize: '0.9em' }}>상품 선택</label>
                                                        </div>
                                                        <select style={{ width: '100%', padding: '6px', marginTop: '4px' }}
                                                                value={newEvent.pId}
                                                                onChange={(e) => setNewEvent({ ...newEvent, pId: e.target.value })}>
                                                                <option value=''>상품을 선택하세요</option>
                                                                {products.map(pd => (
                                                                        <option key={pd.pid} value={pd.pid}>
                                                                                [{pd.pid}] {pd.name} ({pd.company?.businessName})
                                                                        </option>
                                                                ))}
                                                        </select>
                                                </div>

                                                {/* 제목 */}
                                                <div style={{ marginBottom: '12px' }}>
                                                        <div style={{ display: 'flex' }}>
                                                                <div style={{ fontWeight: '600', color: 'red' }}>*</div>
                                                                <label style={{ fontSize: '0.9em' }}>제목</label>
                                                        </div>
                                                        <input type='text' style={{ width: '100%', padding: '6px', marginTop: '4px' }}
                                                                value={newEvent.subject}
                                                                onChange={(e) => setNewEvent({ ...newEvent, subject: e.target.value })}
                                                                placeholder='제목을 입력하세요' />
                                                </div>
                                                {/* 내용 */}
                                                <div style={{ marginBottom: '12px' }}>
                                                        <div style={{ display: 'flex' }}>
                                                                <div style={{ fontWeight: '600', color: 'red' }}>*</div>
                                                                <label style={{ fontSize: '0.9em' }}>내용</label>
                                                        </div>
                                                        <textarea style={{ width: '100%', padding: '6px', marginTop: '4px', height: '100px' }}
                                                                value={newEvent.context}
                                                                onChange={(e) => setNewEvent({ ...newEvent, context: e.target.value })}
                                                                placeholder='내용을 입력하세요' />
                                                </div>

                                                {/* 시작 날짜 */}
                                                <div style={{ marginBottom: '12px' }}>
                                                        <div style={{ display: 'flex' }}>
                                                                <div style={{ fontWeight: '600', color: 'red' }}>*</div>
                                                                <label style={{ fontSize: '0.9em' }}>시작 날짜</label>
                                                        </div>
                                                        <input type='date' style={{ width: '100%', padding: '6px', marginTop: '4px' }}
                                                                value={newEvent.updatedate}
                                                                onChange={(e) => setNewEvent({ ...newEvent, updatedate: e.target.value })} />
                                                </div>

                                                {/* 종료 날짜 */}
                                                <div style={{ marginBottom: '20px' }}>
                                                        <div style={{ display: 'flex' }}>
                                                                <div style={{ fontWeight: '600', color: 'red' }}>*</div>
                                                                <label style={{ fontSize: '0.9em' }}>종료 날짜</label>
                                                        </div>
                                                        <input type='date' style={{ width: '100%', padding: '6px', marginTop: '4px' }}
                                                                value={newEvent.enddate}
                                                                onChange={(e) => setNewEvent({ ...newEvent, enddate: e.target.value })} />
                                                </div>

                                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                                        <button className='button' style={{ border: '1px solid blue', backgroundColor: 'blue' }}
                                                                onClick={handleEventSubmit}>등록</button>
                                                </div>
                                        </div>
                                </div>
                        )}
                        
                        {/* 환경설정 페이지
                        {activeMenu == '환경설정' && (
                                <div>
                                </div>
                        )} */}
                        {/* 정산 */}
                        {activeMenu == '정산' && (
                                <div style={{ display: 'flex', flexDirection: 'column', width: '80%' }}>
                                        <div className='category-content'>
                                                <h4 style={{ textAlign: 'left', fontWeight: '600' }}>정산</h4>
                                                <hr />

                                                {/* 정산 요약 박스 - buys 기반 실시간 계산 */}
                                                {(() => {
                                                        const totalWaiting = buys
                                                                .filter(b => b.settleStatus !== 'COMPLETE')
                                                                .reduce((sum, b) => {
                                                                        const p = Number((b.price || '0').toString().replace(/[^0-9]/g, ''));
                                                                        const t = p * (b.count || 1);
                                                                        return sum + (t - Math.floor(t * 0.1));
                                                                }, 0);
                                                        const totalComplete = buys
                                                                .filter(b => b.settleStatus === 'COMPLETE')
                                                                .reduce((sum, b) => {
                                                                        const p = Number((b.price || '0').toString().replace(/[^0-9]/g, ''));
                                                                        const t = p * (b.count || 1);
                                                                        return sum + (t - Math.floor(t * 0.1));
                                                                }, 0);
                                                        const totalFee = buys.reduce((sum, b) => {
                                                                const p = Number((b.price || '0').toString().replace(/[^0-9]/g, ''));
                                                                const t = p * (b.count || 1);
                                                                return sum + Math.floor(t * 0.1);
                                                        }, 0);
                                                        return (
                                                                <div style={{ display: 'flex', gap: '20px', margin: '45px 0' }}>
                                                                        <div style={{ flex: 1, border: '1px solid #dcdcdc', borderRadius: '12px', padding: '25px 20px', textAlign: 'center' }}>
                                                                                <h4 style={{ margin: 0, marginBottom: '10px', fontSize: '16px', color: '#555' }}>정산 예정금액</h4>
                                                                                <div style={{ fontSize: '24px', fontWeight: '700', color: '#2d7df4' }}>₩ {totalWaiting.toLocaleString()}</div>
                                                                        </div>
                                                                        <div style={{ flex: 1, border: '1px solid #dcdcdc', borderRadius: '12px', padding: '25px 20px', textAlign: 'center' }}>
                                                                                <h4 style={{ margin: 0, marginBottom: '10px', fontSize: '16px', color: '#555' }}>정산 완료금액</h4>
                                                                                <div style={{ fontSize: '24px', fontWeight: '700', color: '#4CAF50' }}>₩ {totalComplete.toLocaleString()}</div>
                                                                        </div>
                                                                        <div style={{ flex: 1, border: '1px solid #dcdcdc', borderRadius: '12px', padding: '25px 20px', textAlign: 'center' }}>
                                                                                <h4 style={{ margin: 0, marginBottom: '10px', fontSize: '16px', color: '#555' }}>판매 수수료</h4>
                                                                                <div style={{ fontSize: '24px', fontWeight: '700', color: '#e74c3c' }}>₩ {totalFee.toLocaleString()}</div>
                                                                        </div>
                                                                </div>
                                                        );
                                                })()}

                                                {/* 정산 목록 테이블 - buys 기반 */}
                                                <table className="management-table">
                                                        <thead>
                                                                <tr>
                                                                        <th>거래 일시</th>
                                                                        <th>업체명</th>
                                                                        <th>카테고리</th>
                                                                        <th>상품명</th>
                                                                        <th>판매가</th>
                                                                        <th>수수료</th>
                                                                        <th>정산액</th>
                                                                        <th className="text-center">상태</th>
                                                                </tr>
                                                        </thead>
                                                        <tbody>
                                                                {buys.length > 0 ? (
                                                                        buys.map((buy, index) => {
                                                                                const price = Number((buy.price || '0').toString().replace(/[^0-9]/g, ''));
                                                                                const buyCount = buy.count || 1;
                                                                                const totalPrice = price * buyCount;
                                                                                const fee = Math.floor(totalPrice * 0.1);
                                                                                const settlePrice = totalPrice - fee;
                                                                                const isPaid = buy.settleStatus === 'COMPLETE';
                                                                                return (
                                                                                        <tr key={buy.bid || index}>
                                                                                                <td className="order-date">
                                                                                                        <span className="id-text">NO.{buy.bid}</span><br />
                                                                                                        <small>{buy.writedate?.split('T')[0]}</small>
                                                                                                </td>
                                                                                                <td>{buy.product?.company?.businessName}</td>
                                                                                                <td>{buy.product?.b_category}</td>
                                                                                                <td><strong>{buy.product?.name}</strong></td>
                                                                                                <td className="text-right">{totalPrice.toLocaleString()}원</td>
                                                                                                <td className="fee-text">-{fee.toLocaleString()}원</td>
                                                                                                <td className="settle-price">{settlePrice.toLocaleString()}원</td>
                                                                                                <td className="text-center">
                                                                                                        <span className={isPaid ? "corp-status-badge done" : "corp-status-badge"}>
                                                                                                                {isPaid ? '정산완료' : '정산예정'}
                                                                                                        </span>
                                                                                                </td>
                                                                                        </tr>
                                                                                );
                                                                        })
                                                                ) : (
                                                                        <tr>
                                                                                <td colSpan="8" className="empty-row">데이터가 존재하지 않습니다.</td>
                                                                        </tr>
                                                                )}
                                                        </tbody>
                                                </table>
                                        </div>
                                </div>
                        )}
                </div>
        )
}

export default Manager