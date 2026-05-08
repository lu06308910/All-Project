import { useState } from 'react'
import './../css/gayoung.css'
import './../css/top.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { Line, Doughnut } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement
} from 'chart.js';
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  ArcElement,
  Title, 
  Tooltip, 
  Legend
);

function Manager(){

        const [showMore, setShowMore] = useState(false);
        const [activeMenu, setActiveMenu] = useState('대시보드');
        const [isPostOpen, setIsPostOpen] = useState(false);
        const [modalOpen, setModalOpen] = useState(false);
        const [chartOpen, setChartOpen] = useState(false);
        const [currentPage, setCurrentPage] = useState(1);
        const [openId, setOpenId] = useState(null); // 현재 열려있는 게시글의 ID 저장

        const postsPerPage = 10;
        const totalPosts=30;
        const totalPages = Math.ceil(totalPosts / postsPerPage);

        const indexOfLastPost = currentPage * postsPerPage;
        const indexOfFirstPost = indexOfLastPost - postsPerPage;

        // 페이지 이동 함수
        const paginate = (pageNumber, e) => {
                e.preventDefault(); // 클릭 시 페이지 새로고침 방지
                if (pageNumber >= 1 && pageNumber <= totalPages) {
                        setCurrentPage(pageNumber);
                }
        };

        // 유저명
        const users = [
                { id: 1, name: '김수한무', userid: 'kimsuhan1', email: 'kimsuhan1@gmail.com', tel: '010-1214-8354', writedate:'2026-02-01', manage:'alive' },
        ]

        // 더보기
        const visibleUsers = showMore ? users : users.slice(0, 4);

        const handleToggle = (id) => {
                // 이미 열려있는 걸 다시 누르면 닫고(null), 아니면 해당 ID를 엽니다.
                setOpenId(openId === id ? null : id);
        };

        const menus = ['대시보드', '회원 관리', '기업 관리', '상품 관리', '게시글 관리', '문의 관리', '통계'];
        const submenus= ['-예약', '-이벤트 관리']
        const handleCategoryClick = (CategoryName)=>{
                setActiveCategory(CategoryName);
        }

        //날짜 변수
        const [startDate, setStartDate] = useState('');
        const [endDate, setEndDate] = useState('');

        const handleDatePreset = (period, value) => {
                const today = new Date();
                const start = new Date();

                // 종료일은 언제나 오늘
                setEndDate(formatDate(today));

                // 기간 설정
                if(period === 'day'){
                        // 당일: 시작일도 오늘
                        setStartDate(formatDate(today));
                }else if(period === 'week'){
                        start.setDate(today.getDate() - 7);
                        setStartDate(formatDate(start));
                }else if(period === 'month'){
                        start.setMonth(today.getMonth() - value);
                        setStartDate(formatDate(start));
                }else if(period === 'year'){
                        start.setFullYear(today.getFullYear() - 1);
                        setStartDate(formatDate(start));
                }
        };

        // 날짜를 YYYY-MM-DD 형식으로 변환하는 보조 함수
        const formatDate = (date) => {
                return date.toISOString().split('T')[0];
        };

        const Reservation =()=>(
                <div>
                        <h4 style={{textAlign:'left', fontWeight:'600'}}>예약 게시글 목록</h4>
                        <hr/>
                        <table className="table table-bordered" style={{width:'1000px', textAlign:'center', border:'1px solid #787878', marginTop:'20px'}}>
                                <thead>
                                        <tr style={{fontSize:'0.8em'}}>
                                                <th style={{backgroundColor:'#eeeeee'}}>일괄삭제</th>
                                                <th style={{backgroundColor:'#eeeeee'}}>카테고리</th>
                                                <th style={{backgroundColor:'#eeeeee'}}>이벤트명</th>
                                                <th style={{backgroundColor:'#eeeeee'}}>등록시간</th>
                                                <th style={{backgroundColor:'#eeeeee'}}>예약시간</th>
                                                <th style={{backgroundColor:'#eeeeee'}}>발행상태</th>
                                                <th style={{backgroundColor:'#eeeeee'}}>목록 수정/삭제</th>
                                        </tr>
                                </thead>
                                <tbody>
                                        <tr>
                                                <td style={{fontSize:'0.8em'}}>
                                                        <input type="checkbox" aria-label="항목 선택" />
                                                </td>
                                                <td style={{fontSize:'0.8em'}}>전체</td>
                                                <td style={{fontSize:'0.8em'}}>전품목 10퍼센트 할인 행사</td>
                                                <td style={{fontSize:'0.8em'}}>2026-04-22</td>
                                                <td style={{fontSize:'0.8em'}}>2026-05-04</td>
                                                <td style={{fontSize:'0.8em'}}>미공개</td>
                                                <td>
                                                        <button className='button2' style={{marginRight:'10px'}}>수정</button>
                                                        <button className='button2'>삭제</button>
                                                </td>
                                        </tr>
                                </tbody>
                        </table>
                        <div style={{display: 'flex', justifyContent: 'space-between', width:'94%'}}>
                                <button style={{backgroundColor:'white', border:'0px', textDecoration:'underline', textAlign:'left', fontSize:'0.8em'}} onClick={() => setShowMore(!showMore)}>
                                        {showMore ? "접기" : "더보기"}
                                </button>
                                <button className='button' style={{border:'1px solid blue', backgroundColor:'blue'}}>게시글등록</button>
                        </div>
                </div>
        )
        const Event = () =>(
                <div>
                        <h4 style={{textAlign:'left', fontWeight:'600'}}>진행 중인 이벤트</h4>
                        <hr/>
                        <table className="table table-bordered" style={{width:'1000px', textAlign:'center', border:'1px solid #787878', marginTop:'20px'}}>
                                <thead>
                                        <tr style={{fontSize:'0.8em'}}>
                                                <th style={{backgroundColor:'#eeeeee'}}>일괄삭제</th>
                                                <th style={{backgroundColor:'#eeeeee'}}>카테고리</th>
                                                <th style={{backgroundColor:'#eeeeee'}}>이벤트명</th>
                                                <th style={{backgroundColor:'#eeeeee'}}>시작기간</th>
                                                <th style={{backgroundColor:'#eeeeee'}}>종료기간</th>
                                                <th style={{backgroundColor:'#eeeeee'}}>발행상태</th>
                                                <th style={{backgroundColor:'#eeeeee'}}>목록 수정/삭제</th>
                                        </tr>
                                </thead>
                                <tbody>
                                        <tr>
                                                <td style={{fontSize:'0.8em'}}>
                                                        <input type="checkbox" aria-label="항목 선택" />
                                                </td>
                                                <td style={{fontSize:'0.8em'}}>전체</td>
                                                <td style={{fontSize:'0.8em'}}>사면 살수록 이득이 되는 전폭 세일 행사</td>
                                                <td style={{fontSize:'0.8em'}}>2026-04-25</td>
                                                <td style={{fontSize:'0.8em'}}>2026-05-30</td>
                                                <td style={{fontSize:'0.8em'}}>공개</td>
                                                <td>
                                                        <button className='button2' style={{marginRight:'10px'}}>수정</button>
                                                        <button className='button2'>삭제</button>
                                                </td>
                                        </tr>
                                </tbody>
                        </table>
                        <div style={{display: 'flex', justifyContent: 'space-between', width:'94%'}}>
                                <button style={{backgroundColor:'white', border:'0px', textDecoration:'underline', textAlign:'left', fontSize:'0.8em'}} onClick={() => setShowMore(!showMore)}>
                                        {showMore ? "접기" : "더보기"}
                                </button>
                                <button className='button' style={{border:'1px solid blue', backgroundColor:'blue'}}>게시글등록</button>
                        </div>
                        <h4 style={{textAlign:'left', fontWeight:'600'}}>마무리 된 이벤트</h4>
                        <hr/>
                        <table className="table table-bordered" style={{width:'1000px', textAlign:'center', border:'1px solid #787878', marginTop:'20px'}}>
                                <thead>
                                        <tr style={{fontSize:'0.8em'}}>
                                                <th style={{backgroundColor:'#eeeeee'}}>일괄삭제</th>
                                                <th style={{backgroundColor:'#eeeeee'}}>카테고리</th>
                                                <th style={{backgroundColor:'#eeeeee'}}>이벤트명</th>
                                                <th style={{backgroundColor:'#eeeeee'}}>시작기간</th>
                                                <th style={{backgroundColor:'#eeeeee'}}>종료기간</th>
                                                <th style={{backgroundColor:'#eeeeee'}}>발행상태</th>
                                                <th style={{backgroundColor:'#eeeeee'}}>목록 수정/삭제</th>
                                        </tr>
                                </thead>
                                <tbody>
                                        <tr>
                                                <td style={{fontSize:'0.8em'}}>
                                                        <input type="checkbox" aria-label="항목 선택" />
                                                </td>
                                                <td style={{fontSize:'0.8em'}}>전체</td>
                                                <td style={{fontSize:'0.8em'}}>사면 살수록 이득이 되는 전폭 세일 행사</td>
                                                <td style={{fontSize:'0.8em'}}>2026-03-15</td>
                                                <td style={{fontSize:'0.8em'}}>2026-04-25</td>
                                                <td style={{fontSize:'0.8em'}}>미공개</td>
                                                <td>
                                                        <button className='button2' style={{marginRight:'10px'}}>수정</button>
                                                        <button className='button2'>삭제</button>
                                                </td>
                                        </tr>
                                </tbody>
                        </table>
                        <div style={{display: 'flex', justifyContent: 'space-between', width:'94%'}}>
                                <button style={{backgroundColor:'white', border:'0px', textDecoration:'underline', textAlign:'left', fontSize:'0.8em'}} onClick={() => setShowMore(!showMore)}>
                                        {showMore ? "접기" : "더보기"}
                                </button>
                                <button className='button' style={{border:'1px solid blue', backgroundColor:'blue'}}>게시글등록</button>
                        </div>
                </div>
        )
        const BuyTag = ()=>(
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
                        <div style={{display:"flex", justifyContent:"space-between"}}>
                                <div className='light-but'>2025-02-14 매출</div>
                                <button style={{background:"white", border: "1px solid white", color:"black"}} onClick={() => setModalOpen(false)}>X</button>
                        </div>
                        <table className="table table-bordered" style={{width:'600px', textAlign:'center', border:'1px solid #787878', marginTop:'20px'}}>
                                <thead>
                                        <tr>
                                                <th style={{backgroundColor:'#eeeeee'}}>주문번호</th>
                                                <th style={{backgroundColor:'#eeeeee'}}>상품명</th>
                                                <th style={{backgroundColor:'#eeeeee'}}>회원아이디</th>
                                                <th style={{backgroundColor:'#eeeeee'}}>회원명</th>
                                                <th style={{backgroundColor:'#eeeeee'}}>결제금액</th>
                                        </tr>
                                </thead>
                                <tbody>
                                        <tr>
                                                <td>23123124</td>
                                                <td>나무원목의자</td>
                                                <td>sefsd1</td>
                                                <td>이길*</td>
                                                <td>69,000</td>
                                        </tr>
                                </tbody>
                        </table>
                        <nav>
                                <ul className="pagination">
                                        <li><a className='paging-text' href="#">≪</a></li>
                                        <li><a className='paging-active-text' href="#">1</a></li>
                                        <li><a className='paging-text' href="#">2</a></li>
                                        <li><a className='paging-text' href="#">3</a></li>
                                        <li><a className='paging-text' href="#">≫</a></li>
                                </ul>
                        </nav>
                </div>
        )
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
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [
                        {
                                label: '매출',
                                data: [65, 59, 80, 81, 56, 55, 40],
                                borderColor: 'rgb(255, 99, 132)',
                                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                                yAxisID: 'y',
                        }
                ],
        };
        const data3 = {
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
        const ChartData =  {
                type: 'doughnut',
                data: data
        };
        const ChartData2 =  {
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
        const ChartData3 =  {
                type: 'doughnut',
                data: data
        };
        const ChartModel = ()=>(
                <div style={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: 'white',
                        padding: '20px',
                        zIndex: 1000,
                        borderRadius: '8px',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                        width: '600px'
                }}>
                        <div style={{display:"flex", justifyContent:"space-between"}}>
                                <div className='light-but'>2025-02-14 매출</div>
                                <button style={{background:"white", border: "1px solid white", color:"black"}} onClick={() => setChartOpen(false)}>X</button>
                        </div>
                        <Doughnut data={data} options={ChartData.options} />
                </div>
        )

        // chartlist를 no로 적용되게 해야 한다
        // const deleteSelected = () => {
        //         const remainingItems = cartList.filter(item=>!item.checked);

        //         if(remainingItems.length== cartList.length){
        //                 alert("삭제할 항목을 선택해 주세요.")
        //                 return;
        //         }

        //         if(window.confirm("선택한 항목을 장바구니에서 삭제하시겠습니까?")){
        //                 setCartList(remainingItems);
        //         }
        // }
        
        return(
                <div className='inner-container'>
                        <div className='manager-container'>
                                <div className='category-mana'>
                                        <Link to="/" style={{textDecoration:"none"}}>
                                             <h1 className="canvas">CANVAS</h1>   
                                        </Link>
                                        <div className='sub-mana'>
                                        {menus.map((menu) => (
                                                <div key={menu}>
                                                        <div
                                                                onClick={() => setActiveMenu(menu)}
                                                                style={{
                                                                        cursor: 'pointer',
                                                                        backgroundColor: activeMenu === menu ? '#3a4ca8' : '#333333',
                                                                        padding: '0px 15px',
                                                                        paddingLeft:'40px',
                                                                        margin: 0
                                                                }}
                                                                onClick={()=>{
                                                                        setActiveMenu(menu);
                                                                        if(menu=='게시글 관리') setIsPostOpen(!isPostOpen);
                                                                }}
                                                        >
                                                                {menu}
                                                        </div>
                                                
                                                {/* 서브메뉴 조건부 렌더링 */}
                                                {menu === '게시글 관리' && (isPostOpen || submenus.includes(activeMenu)) && (
                                                        <div style={{ backgroundColor: '#222222' }}>
                                                        {submenus.map((sub) => (
                                                                <p
                                                                key={sub}
                                                                onClick={() => setActiveMenu(sub)}
                                                                style={{
                                                                        cursor: 'pointer',
                                                                        padding: '8px 30px',
                                                                        fontSize: '0.9em',
                                                                        color:'#ffffff',
                                                                        paddingLeft:'60px',
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
                                {activeMenu == '대시보드' &&(
                                        <div className='category-content'>
                                                <h4 style={{textAlign:'left', fontWeight:'600'}}>매출 현황</h4>
                                                <hr/>
                                                <div style={{display: 'flex', gap: '20px', alignItems: 'center'}}>
                                                        <div style={{ flex: 3, height: '350px' }}> 
                                                                <Line 
                                                                data={data2} 
                                                                options={{
                                                                        ...ChartData.options2,
                                                                        maintainAspectRatio: false
                                                                }}
                                                                />
                                                        </div>
                                                        <div style={{ flex: 1.5, height: '350px' }}>
                                                                <Doughnut 
                                                                data={data3} 
                                                                options={{
                                                                        ...ChartData.options3,
                                                                        maintainAspectRatio: false
                                                                }}
                                                                />
                                                        </div>
                                                </div>
                                                <div style={{marginTop:'20px', display: 'flex', gap: '20px', alignItems: 'center'}}>
                                                                <div style={{marginLeft:'215px'}}>CANVAS 전체 매출 현황</div>
                                                                <div style={{marginLeft:'400px'}}>기업 매출 상위 분포도</div>
                                                </div>
                                                <h4 style={{marginTop:'60px', textAlign:'left', fontWeight:'600'}}>상위 리스트</h4>
                                                <hr/>
                                                <div className="row" style={{backgroundColor:'#eeeeee', fontSize:'0.8em'}}>
                                                        <div className="col p-2">인기 상품 TOP 5</div>
                                                        <div className="col p-2">조회수 TOP 5</div>
                                                </div>
                                                <div className="row" style={{fontSize:'0.8em'}}>
                                                        <div className="col p-2">게시글(상품) 이름</div>
                                                        <div className="col p-2">게시글(상품) 이름</div>
                                                </div>
                                        </div>
                                )}
                                {/* 회원관리 페이지 */}
                                {activeMenu == '회원 관리' &&(
                                        <div style={{display: 'flex', flexDirection: 'column', width:'80%'}}>
                                                <div className='category-content'>
                                                        <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px'}}>
                                                                <h4 style={{textAlign:'left', fontWeight:'600'}}>회원 검색</h4>
                                                                <div className="search-bar">
                                                                        <input type="text" placeholder="검색할 상품을 입력해주세요." />
                                                                        <button className="search-icon"></button>
                                                                </div>
                                                        </div>
                                                        <div className="row border real-dark-border mx-0" style={{backgroundColor:'#eeeeee', fontSize:'0.8em', textAlign:'center', padding:'5px'}}>
                                                                <div className="col-1 border-start">번호</div>
                                                                <div className="col-2 border-start">아이디</div>
                                                                <div className="col-2 border-start">성명</div>
                                                                <div className="col-2 border-start">이메일</div>
                                                                <div className="col-2 border-start">연락처</div>
                                                                <div className="col-2 border-start">가입일</div>
                                                                <div className="col-1 border-start">관리</div>
                                                        </div>
                                                        {users.map((user)=>(
                                                                <div className="row border real-dark-border mx-0" style={{fontSize:'0.8em', textAlign:'center', padding:'5px'}}>
                                                                        <div className="col-1 border-start">{user.id}</div>
                                                                        <div className="col-2 border-start">{user.userid}</div>
                                                                        <div className="col-2 border-start">{user.name}</div>
                                                                        <div className="col-2 border-start">{user.email}</div>
                                                                        <div className="col-2 border-start">{user.tel}</div>
                                                                        <div className="col-2 border-start">{user.writedate}</div>
                                                                        <div className="col-1 border-start">{user.manage}</div>
                                                                </div>
                                                        ))}
                                                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                                <button style={{backgroundColor:'white', border:'0px', textDecoration:'underline', textAlign:'left', fontSize:'0.8em'}} onClick={() => setShowMore(!showMore)}>
                                                                        {showMore ? "접기" : "더보기"}
                                                                </button>
                                                                <button className='button' style={{marginTop:'20px', border:'1px solid blue', backgroundColor:'blue'}}>탈퇴처리</button>
                                                        </div>
                                                </div>
                                                <div className='category-content'>
                                                        <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px'}}>
                                                                <h4 style={{textAlign:'left', fontWeight:'600'}}>탈퇴회원 검색</h4>
                                                                <div className="search-bar">
                                                                        <input type="text" placeholder="검색할 상품을 입력해주세요." />
                                                                        <button className="search-icon"></button>
                                                                </div>
                                                        </div>
                                                        <div className="row border real-dark-border mx-0" style={{backgroundColor:'#eeeeee', fontSize:'0.8em', textAlign:'center', padding:'5px'}}>
                                                                <div className="col-1 border-start">번호</div>
                                                                <div className="col-2 border-start">아이디</div>
                                                                <div className="col-2 border-start">성명</div>
                                                                <div className="col-2 border-start">이메일</div>
                                                                <div className="col-2 border-start">연락처</div>
                                                                <div className="col-2 border-start">가입일</div>
                                                                <div className="col-1 border-start">관리</div>
                                                        </div>
                                                        <div className="row border real-dark-border mx-0" style={{fontSize:'0.8em', textAlign:'center', padding:'5px'}}>
                                                                <div className="col-1 border-start">*번호</div>
                                                                <div className="col-2 border-start">*아이디</div>
                                                                <div className="col-2 border-start">*성명</div>
                                                                <div className="col-2 border-start">*이메일</div>
                                                                <div className="col-2 border-start">*연락처</div>
                                                                <div className="col-2 border-start">*가입일</div>
                                                                <div className="col-1 border-start">*관리</div>
                                                        </div>
                                                        <p style={{marginTop:'20px', textDecoration:'underline', textAlign:'left', fontSize:'0.8em', padding:'5px'}}>
                                                                더보기
                                                        </p>
                                                </div>
                                        </div>
                                )}

                                {/* 기업관리 페이지 */}
                                {activeMenu == '기업 관리' &&(
                                        <div style={{display: 'flex', flexDirection: 'column', width:'80%'}}>
                                                <div className='category-content'>
                                                        <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px'}}>
                                                                <h4 style={{textAlign:'left', fontWeight:'600'}}>기업 검색</h4>
                                                                <div className="search-bar">
                                                                        <input type="text" placeholder="검색할 상품을 입력해주세요." />
                                                                        <button className="search-icon"></button>
                                                                </div>
                                                        </div>
                                                        <div className="row border real-dark-border mx-0" style={{backgroundColor:'#eeeeee', fontSize:'0.8em', textAlign:'center', padding:'5px'}}>
                                                                <div className="col-1 border-start">번호</div>
                                                                <div className="col-2 border-start">아이디</div>
                                                                <div className="col-2 border-start">성명</div>
                                                                <div className="col-2 border-start">이메일</div>
                                                                <div className="col-2 border-start">연락처</div>
                                                                <div className="col-2 border-start">가입일</div>
                                                                <div className="col-1 border-start">관리</div>
                                                        </div>
                                                        <div className="row border real-dark-border mx-0" style={{fontSize:'0.8em', textAlign:'center', padding:'5px'}}>
                                                                <div className="col-1 border-start">*번호</div>
                                                                <div className="col-2 border-start">*아이디</div>
                                                                <div className="col-2 border-start">*성명</div>
                                                                <div className="col-2 border-start">*이메일</div>
                                                                <div className="col-2 border-start">*연락처</div>
                                                                <div className="col-2 border-start">*가입일</div>
                                                                <div className="col-1 border-start">*관리</div>
                                                        </div>
                                                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                                <div style={{marginTop:'20px', textDecoration:'underline', textAlign:'left', fontSize:'0.8em'}}>
                                                                        더보기
                                                                </div>
                                                                <button className='button' style={{marginTop:'20px', border:'1px solid blue', backgroundColor:'blue'}}>탈퇴처리</button>
                                                        </div>
                                                </div>
                                                <div className='category-content'>
                                                        <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px'}}>
                                                                <h4 style={{textAlign:'left', fontWeight:'600'}}>탈퇴기업 검색</h4>
                                                                <div className="search-bar">
                                                                        <input type="text" placeholder="검색할 상품을 입력해주세요." />
                                                                        <button className="search-icon"></button>
                                                                </div>
                                                        </div>
                                                        <div className="row border real-dark-border mx-0" style={{backgroundColor:'#eeeeee', fontSize:'0.8em', textAlign:'center', padding:'5px'}}>
                                                                <div className="col-1 border-start">번호</div>
                                                                <div className="col-2 border-start">아이디</div>
                                                                <div className="col-2 border-start">성명</div>
                                                                <div className="col-2 border-start">이메일</div>
                                                                <div className="col-2 border-start">연락처</div>
                                                                <div className="col-2 border-start">가입일</div>
                                                                <div className="col-1 border-start">관리</div>
                                                        </div>
                                                        <div className="row border real-dark-border mx-0" style={{fontSize:'0.8em', textAlign:'center', padding:'5px'}}>
                                                                <div className="col-1 border-start">*번호</div>
                                                                <div className="col-2 border-start">*아이디</div>
                                                                <div className="col-2 border-start">*성명</div>
                                                                <div className="col-2 border-start">*이메일</div>
                                                                <div className="col-2 border-start">*연락처</div>
                                                                <div className="col-2 border-start">*가입일</div>
                                                                <div className="col-1 border-start">*관리</div>
                                                        </div>
                                                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                                <div style={{marginTop:'20px', textDecoration:'underline', textAlign:'left', fontSize:'0.8em'}}>
                                                                        더보기
                                                                </div>
                                                        </div>
                                                </div>
                                        </div>
                                )}
                                {/* 상품관리 페이지 */}
                                {activeMenu == '상품 관리' && (
                                        <div>
                                                <div className='category-content'>
                                                        {/* 상품검색 */}
                                                        <h4 style={{textAlign:'left', fontWeight:'600'}}>상품 검색</h4>
                                                        <hr/>
                                                        <div style={{textAlign:'left', width:'500px'}}>
                                                                <div style={{display: 'flex', justifyContent: 'space-between', gap:'10px'}}>
                                                                        <p>카테고리 :</p> 
                                                                        <select className="cat1" style={{width:'200px', padding:'3px', borderRadius:'10px', fontSize:'0.8em', height:'30px'}}>
                                                                                        <option value="null">대분류</option>
                                                                                        <option value="category">카테고리1</option>
                                                                                        <option value="category">카테고리2</option>
                                                                        </select>
                                                                        <select className="cat1" style={{width:'200px', padding:'3px', borderRadius:'10px', fontSize:'0.8em', height:'30px'}}>
                                                                                        <option value="null">소분류</option>
                                                                                        <option value="category">카테고리1</option>
                                                                                        <option value="category">카테고리2</option>
                                                                        </select>
                                                                </div>
                                                                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                                        <p>검색어 :</p>
                                                                        <select className="cat1" style={{width:'100px', padding:'3px', borderRadius:'10px', fontSize:'0.8em', height:'30px'}}>
                                                                                        <option value="null">전체</option>
                                                                                        <option value="category">상품명</option>
                                                                                        <option value="category">기업명</option>
                                                                        </select>
                                                                        <input type='text' style={{width:'320px', padding:'3px', borderRadius:'10px', fontSize:'0.8em', height:'30px', border: '1px solid #333333'}} placeholder="검색어를 입력하세요."></input>
                                                                </div>
                                                                <div style={{display: 'flex', alignItems:'center', gap:'20px'}}>
                                                                        <p style={{width:"80px d-inline-flex"}}>등록일자 :</p>
                                                                        <div className="row mx-0" style={{backgroundColor:'#eeeeee', fontSize:'0.8em', border: '1px solid #333333', borderRadius:'10px', width:'400px'}}>
                                                                                <div className="col p-1 text-center" onClick={() => handleDatePreset('day')}>당일</div>
                                                                                <div className="col p-1 text-center" style={{borderLeft:'1px solid black'}} onClick={() => handleDatePreset('week')}>일주일</div>
                                                                                <div className="col p-1 text-center" style={{borderLeft:'1px solid black'}} onClick={() => handleDatePreset('month', 1)}>1개월</div>
                                                                                <div className="col p-1 text-center" style={{borderLeft:'1px solid black'}} onClick={() => handleDatePreset('month', 3)}>3개월</div>
                                                                                <div className="col p-1 text-center" style={{borderLeft:'1px solid black'}} onClick={() => handleDatePreset('year')}>1년</div>
                                                                        </div>
                                                                </div>
                                                                <div style={{marginLeft:"85px"}}>
                                                                        <div style={{display:"flex", gap:"10px", fontSize:"0.8em", padding:"10px"}}>
                                                                                <input type='date' className='calendar' value={startDate} onChange={(e) => setStartDate(e.target.value)}/>
                                                                                <b>~</b>
                                                                                <input type='date' className='calendar' value={endDate} onChange={(e) => setEndDate(e.target.value)}/>
                                                                        </div>
                                                                </div>
                                                        </div>
                                                        {/* 상품 목록 */}
                                                        <h4 style={{textAlign:'left', fontWeight:'600', marginTop:'20px'}}>상품 목록</h4>
                                                        <hr/>
                                                        <button className='button' style={{marginLeft:'920px', border:'1px solid blue', backgroundColor:'blue'}}>상품등록</button>
                                                        <table className="table table-bordered" style={{width:'1000px', textAlign:'center', border:'1px solid #787878', marginTop:'20px'}}>
                                                                <thead>
                                                                        <tr style={{fontSize:'0.8em'}}>
                                                                                <th style={{backgroundColor:'#eeeeee'}}>일괄삭제</th>
                                                                                <th style={{backgroundColor:'#eeeeee'}}>기업명</th>
                                                                                <th style={{backgroundColor:'#eeeeee'}}>카테고리</th>
                                                                                <th style={{backgroundColor:'#eeeeee'}}>상품명</th>
                                                                                <th style={{backgroundColor:'#eeeeee'}}>판매가</th>
                                                                                <th style={{backgroundColor:'#eeeeee'}}>재고</th>
                                                                                <th style={{backgroundColor:'#eeeeee'}}>등록일</th>
                                                                                <th style={{backgroundColor:'#eeeeee'}}>목록 수정/삭제</th>
                                                                        </tr>
                                                                </thead>
                                                                <tbody>
                                                                        <tr>
                                                                                <td style={{fontSize:'0.8em'}}>
                                                                                        <input type="checkbox" aria-label="항목 선택" />
                                                                                </td>
                                                                                <td style={{fontSize:'0.8em'}}>기업명</td>
                                                                                <td style={{fontSize:'0.8em'}}>카테고리</td>
                                                                                <td style={{fontSize:'0.8em'}}>상품명</td>
                                                                                <td style={{fontSize:'0.8em'}}>판매가</td>
                                                                                <td style={{fontSize:'0.8em'}}>재고</td>
                                                                                <td style={{fontSize:'0.8em'}}>등록일</td>
                                                                                <td>
                                                                                        <button className='button2' style={{marginRight:'10px'}}>수정</button>
                                                                                        <button className='button2'>삭제</button>
                                                                                </td>
                                                                        </tr>
                                                                </tbody>
                                                        </table>
                                                </div>
                                        </div>
                                )}
                                {/* 게시글관리 페이지 */}
                                {activeMenu == '게시글 관리' && (
                                        <div className='category-content'>
                                                <Reservation/>
                                                <Event/>
                                        </div>
                                )}
                                {activeMenu == '-예약' && (
                                        <div className='category-content'>
                                                <Reservation/>
                                        </div>
                                )}
                                {activeMenu == '-이벤트 관리' && (
                                        <div className='category-content'>
                                                <Event/>
                                        </div>
                                )}
                                {/* 문의관리 페이지 */}
                                {activeMenu == '문의 관리' && (
                                        <div style={{display: 'flex', flexDirection: 'column', width:'80%'}}>
                                                <div className='category-content'>
                                                        <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px'}}>
                                                                <h4 style={{textAlign:'left', fontWeight:'600'}}>문의 목록</h4>
                                                                <div className="search-bar">
                                                                        <input type="text" placeholder="검색할 단어 및 문장을 입력해주세요." />
                                                                        <button className="search-icon"></button>
                                                                </div>
                                                        </div>
                                                        <hr/>
                                                        <div className="row" style={{backgroundColor:'#eeeeee', fontSize:'0.8em', textAlign:'center'}}>
                                                                <div className="col p-2">번호</div>
                                                                <div className="col p-2">제목</div>
                                                                <div className="col p-2">작성자</div>
                                                                <div className="col p-2">작성일</div>
                                                                <div className="col p-2">수정/삭제</div>
                                                        </div>
                                                        <div className="row" style={{textAlign:'center'}}>
                                                                <div className="col p-2" style={{fontSize:'0.8em'}}>1</div>
                                                                <div className="col p-2" onClick={() => handleToggle(1)} style={{fontSize:'0.8em'}}>
                                                                        <div>🔒사고 싶은 옷이 찜목록에서 삭제됐어요.</div>
                                                                </div>
                                                                <div className="col p-2" style={{fontSize:'0.8em'}}>김희*</div>
                                                                <div className="col p-2" style={{fontSize:'0.8em'}}>2026-04-26</div>
                                                                <div className="col p-2">
                                                                        <button className='button2' style={{marginRight:'10px'}}>수정</button>
                                                                        <button className='button2'>삭제</button>
                                                                </div>
                                                        </div>
                                                        {/* 답변 창: openId가 현재 행의 ID와 일치할 때만 렌더링 */}
                                                        {openId === 1 && (
                                                                <div className="answer-box" style={{
                                                                backgroundColor: '#f9f9f9',
                                                                padding: '20px',
                                                                fontSize: '0.8em',
                                                                borderTop: '1px solid #eee',
                                                                textAlign: 'left'
                                                                }}>
                                                                        <span style={{ color: '#ff6b6b', fontWeight: 'bold' }}>A.</span>
                                                                        <div style={{ whiteSpace: 'pre-wrap', fontSize: '1em', lineHeight: '1.6' }}>
                                                                                {`안녕하세요, 고객님. CANVAS를 이용해 주셔서 감사합니다. 해당 상품은 현재 시즌 종료로 인해 데이터가 삭제되었습니다. 불편을 드려 죄송합니다.`}
                                                                        </div>
                                                                </div>
                                                        )}
                                                        {/* 페이징 */}
                                                        <nav>
                                                                <ul className="pagination" style={{marginTop:'20px'}}>
                                                                        <li>
                                                                                <a className='paging-text' href="#" onClick={(e) => paginate(currentPage - 1, e)} 
                                                                                        style={{ textDecoration: 'none', color: currentPage === 1 ? '#ccc' : '#333' }}>
                                                                                                ≪
                                                                                </a>
                                                                        </li>
                                                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                                                                                <li key={num}>
                                                                                        <a 
                                                                                                href="#"
                                                                                                onClick={(e) => paginate(num, e)}
                                                                                                className={currentPage === num ? 'paging-active-text' : 'paging-text'}
                                                                                                style={{
                                                                                                        textDecoration: 'none',
                                                                                                        fontWeight: currentPage === num ? 'bold' : 'normal',
                                                                                                        color: currentPage === num ? '#000' : '#888'
                                                                                                }}
                                                                                        >
                                                                                        {num}
                                                                                        </a>
                                                                                </li>
                                                                                ))}
                                                                        <li>
                                                                                <a className='paging-text' href="#" onClick={(e) => paginate(currentPage + 1, e)}
                                                                                style={{ textDecoration: 'none', color: currentPage === totalPages ? '#ccc' : '#333' }}>
                                                                                        ≫
                                                                                </a>
                                                                        </li>
                                                                </ul>
                                                        </nav>
                                                </div>
                                        </div>
                                )}
                                {/* 통계 페이지 */}
                                {activeMenu == '통계' && (
                                        <div>
                                                <div className='category-content'>
                                                        <h4 style={{textAlign:'left', fontWeight:'600'}}>기업 검색</h4>
                                                        <hr/>
                                                <div style={{textAlign:'left', width:'500px'}}>
                                                                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                                        <p>기업명 :</p>
                                                                        <select className="cat1" style={{width:'100px', padding:'3px', borderRadius:'10px', fontSize:'0.8em', height:'30px'}}>
                                                                                        <option value="null">전체</option>
                                                                                        <option value="category">상품명</option>
                                                                                        <option value="category">기업명</option>
                                                                        </select>
                                                                        <input type='text' style={{width:'320px', padding:'3px', borderRadius:'10px', fontSize:'0.8em', height:'30px', border: '1px solid #333333'}} placeholder="검색어를 입력하세요."></input>
                                                                </div>
                                                                <div style={{display: 'flex', alignItems:'center', gap:'20px'}}>
                                                                        <p style={{width:"80px d-inline-flex"}}>등록일자 :</p>
                                                                        <div className="row mx-0" style={{backgroundColor:'#eeeeee', fontSize:'0.8em', border: '1px solid #333333', borderRadius:'10px', width:'400px'}}>
                                                                                <div className="col p-1 text-center" onClick={() => handleDatePreset('day')}>당일</div>
                                                                                <div className="col p-1 text-center" style={{borderLeft:'1px solid black'}} onClick={() => handleDatePreset('week')}>일주일</div>
                                                                                <div className="col p-1 text-center" style={{borderLeft:'1px solid black'}} onClick={() => handleDatePreset('month', 1)}>1개월</div>
                                                                                <div className="col p-1 text-center" style={{borderLeft:'1px solid black'}} onClick={() => handleDatePreset('month', 3)}>3개월</div>
                                                                                <div className="col p-1 text-center" style={{borderLeft:'1px solid black'}} onClick={() => handleDatePreset('year')}>1년</div>
                                                                        </div>
                                                                </div>
                                                                <div style={{marginLeft:"85px"}}>
                                                                        <div style={{display:"flex", gap:"10px", fontSize:"0.8em", padding:"10px"}}>
                                                                                <input type='date' className='calendar' value={startDate} onChange={(e) => setStartDate(e.target.value)}/>
                                                                                <b>~</b>
                                                                                <input type='date' className='calendar' value={endDate} onChange={(e) => setEndDate(e.target.value)}/>
                                                                        </div>
                                                                </div>
                                                        </div>
                                                        {/* 상품 목록 */}
                                                        <h4 style={{textAlign:'left', fontWeight:'600', marginTop:'20px'}}>상품 목록</h4>
                                                        <hr/>
                                                        <button className='button' style={{marginLeft:'920px', border:'1px solid blue', backgroundColor:'blue'}} onClick={()=>setChartOpen(true)}>매출 통계</button>
                                                        <table className="table table-bordered" style={{width:'1000px', textAlign:'center', border:'1px solid #787878', marginTop:'20px'}}>
                                                                <thead>
                                                                        <tr style={{fontSize:'0.8em'}}>
                                                                                <th style={{backgroundColor:'#eeeeee'}}>날짜</th>
                                                                                <th style={{backgroundColor:'#eeeeee'}}>상품코드</th>
                                                                                <th style={{backgroundColor:'#eeeeee'}}>카테고리</th>
                                                                                <th style={{backgroundColor:'#eeeeee'}}>상품명</th>
                                                                                <th style={{backgroundColor:'#eeeeee'}}>기업명</th>
                                                                                <th style={{backgroundColor:'#eeeeee'}}>판매가</th>
                                                                                <th style={{backgroundColor:'#eeeeee'}}>주문건수</th>
                                                                                <th style={{backgroundColor:'#eeeeee'}}>배송비</th>
                                                                                <th style={{backgroundColor:'#eeeeee'}}>수수료</th>
                                                                                <th style={{backgroundColor:'#eeeeee'}}>상세보기</th>
                                                                        </tr>
                                                                </thead>
                                                                <tbody>
                                                                        <tr>
                                                                                <td style={{fontSize:'0.8em'}}>2026-01-22</td>
                                                                                <td style={{fontSize:'0.8em'}}>L001</td>
                                                                                <td style={{fontSize:'0.8em'}}>야외 〉조경</td>
                                                                                <td style={{fontSize:'0.8em'}}>나무원목의자</td>
                                                                                <td style={{fontSize:'0.8em'}}>기업명1</td>
                                                                                <td style={{fontSize:'0.8em'}}>70,000</td>
                                                                                <td style={{fontSize:'0.8em'}}>15</td>
                                                                                <td style={{fontSize:'0.8em'}}>69,000</td>
                                                                                <td style={{fontSize:'0.8em'}}>151,600</td>
                                                                                <td>
                                                                                        <button className='button' onClick={()=>setModalOpen(true)}>상세보기</button>
                                                                                </td>
                                                                        </tr>
                                                                </tbody>
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
                                                <ChartModel/>
                                        </>
                                )}
                                {/* 환경설정 페이지
                                {activeMenu == '환경설정' && (
                                        <div>
                                        </div>
                                )} */}
                        </div>
                </div>
        )
}

export default Manager