import { useState } from 'react'
import './../css/gayoung.css'
import './../css/top.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { Chart, Line } from 'react-chartjs-2';
import {  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend} from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);


function Manager(){
        
        const [activeMenu, setActiveMenu] = useState('대시보드');
        const [isPostOpen, setIsPostOpen] = useState(false);
        const [modalOpen, setModalOpen] = useState(false);
        const [chartOpen, setChartOpen] = useState(false);

        const menus = ['대시보드', '회원 관리', '기업 관리', '상품 관리', '게시글 관리', '문의 관리', '통계'];
        const submenus= ['-예약', '-이벤트 관리']
        const handleCategoryClick = (CategoryName)=>{
                setActiveCategory(CategoryName);
        }

        const Reservation =()=>(
                <div>
                        <h4 style={{textAlign:'left', fontWeight:'600'}}>예약 게시글 목록</h4>
                        <hr/>
                        <table className="table table-bordered" style={{width:'1000px', textAlign:'center', border:'1px solid #787878', marginTop:'20px', fontSize:'0.8em'}}>
                                <thead>
                                        <tr>
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
                                                <td>
                                                        <input type="checkbox" aria-label="항목 선택" />
                                                </td>
                                                <td>전체</td>
                                                <td>전품목 10퍼센트 할인 행사</td>
                                                <td>2026-04-22</td>
                                                <td>2026-05-04</td>
                                                <td>미공개</td>
                                                <td>
                                                        <button className='button2'>수정</button>
                                                        <button className='button2'>삭제</button>
                                                </td>
                                        </tr>
                                </tbody>
                        </table>
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                <div style={{textDecoration:'underline', textAlign:'left', fontSize:'0.8em'}}>
                                        더보기
                                </div>
                                <button className='button'>게시글등록</button>
                        </div>
                </div>
        )
        const Event = () =>(
                <div>
                        <h4 style={{textAlign:'left', fontWeight:'600'}}>진행 중인 이벤트</h4>
                        <hr/>
                        <table className="table table-bordered" style={{width:'1000px', textAlign:'center', border:'1px solid #787878', marginTop:'20px', fontSize:'0.8em'}}>
                                <thead>
                                        <tr>
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
                                                <td>
                                                        <input type="checkbox" aria-label="항목 선택" />
                                                </td>
                                                <td>전체</td>
                                                <td>사면 살수록 이득이 되는 전폭 세일 행사</td>
                                                <td>2026-04-25</td>
                                                <td>2026-05-30</td>
                                                <td>공개</td>
                                                <td>
                                                        <button className='button2'>수정</button>
                                                        <button className='button2'>삭제</button>
                                                </td>
                                        </tr>
                                </tbody>
                        </table>
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                <div style={{textDecoration:'underline', textAlign:'left', fontSize:'0.8em'}}>
                                        더보기
                                </div>
                                <button className='button'>게시글등록</button>
                        </div>
                        <h4 style={{textAlign:'left', fontWeight:'600'}}>마무리 된 이벤트</h4>
                        <hr/>
                        <table className="table table-bordered" style={{width:'1000px', textAlign:'center', border:'1px solid #787878', marginTop:'20px', fontSize:'0.8em'}}>
                                <thead>
                                        <tr>
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
                                                <td>
                                                        <input type="checkbox" aria-label="항목 선택" />
                                                </td>
                                                <td>전체</td>
                                                <td>사면 살수록 이득이 되는 전폭 세일 행사</td>
                                                <td>2026-03-15</td>
                                                <td>2026-04-25</td>
                                                <td>미공개</td>
                                                <td>
                                                        <button className='button2'>수정</button>
                                                        <button className='button2'>삭제</button>
                                                </td>
                                        </tr>
                                </tbody>
                        </table>
                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                <div style={{textDecoration:'underline', textAlign:'left', fontSize:'0.8em'}}>
                                        더보기
                                </div>
                                <button className='button'>게시글등록</button>
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
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [
                        {
                                label: '기업명1',
                                data: [65, 59, 80, 81, 56, 55, 40],
                                borderColor: 'rgb(255, 99, 132)',
                                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                                yAxisID: 'y',
                        },
                        {
                                label: '기업명2',
                                data: [28, 48, 40, 19, 86, 27, 90],
                                borderColor: 'rgb(53, 162, 235)',
                                backgroundColor: 'rgba(53, 162, 235, 0.5)',
                                yAxisID: 'y1',
                        },
                ],
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
        const ChartData =  {
                type: 'line',
                data: data,
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
                        <Line data={data} options={ChartData.options} />
                </div>
        )
        
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
                                                <h4 style={{textAlign:'left', fontWeight:'60%'}}>매출 현황</h4>
                                                <hr/>
                                                <Line data={data2} options={ChartData.options2}/>
                                                <h4 style={{textAlign:'left', fontWeight:'60%'}}>상위 리스트</h4>
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
                                                        <h4 style={{textAlign:'left', fontWeight:'60%'}}>회원 검색</h4>
                                                        <div className="row" style={{backgroundColor:'#eeeeee', fontSize:'0.8em'}}>
                                                                <div className="col p-2">번호</div>
                                                                <div className="col p-2">아이디</div>
                                                                <div className="col p-2">성명</div>
                                                                <div className="col p-2">이메일</div>
                                                                <div className="col p-2">연락처</div>
                                                                <div className="col p-2">가입일</div>
                                                                <div className="col p-2">관리</div>
                                                        </div>
                                                        <div className="row" style={{fontSize:'0.8em'}}>
                                                                <div className="col p-2">*번호</div>
                                                                <div className="col p-2">*아이디</div>
                                                                <div className="col p-2">*성명</div>
                                                                <div className="col p-2">*이메일</div>
                                                                <div className="col p-2">*연락처</div>
                                                                <div className="col p-2">*가입일</div>
                                                                <div className="col p-2">*관리</div>
                                                        </div>
                                                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                                <div style={{textDecoration:'underline', textAlign:'left', fontSize:'0.8em'}}>
                                                                        더보기
                                                                </div>
                                                                <button className='button'>탈퇴처리</button>
                                                        </div>
                                                </div>
                                                <div className='category-content'>
                                                        <h4 style={{textAlign:'left', fontWeight:'600'}}>탈퇴회원 검색</h4>
                                                        <div className="row" style={{backgroundColor:'#eeeeee', fontSize:'0.8em'}}>
                                                                <div className="col p-2">번호</div>
                                                                <div className="col p-2">아이디</div>
                                                                <div className="col p-2">성명</div>
                                                                <div className="col p-2">이메일</div>
                                                                <div className="col p-2">연락처</div>
                                                                <div className="col p-2">가입일</div>
                                                                <div className="col p-2">관리</div>
                                                        </div>
                                                        <div className="row" style={{fontSize:'0.8em'}}>
                                                                <div className="col p-2">*번호</div>
                                                                <div className="col p-2">*아이디</div>
                                                                <div className="col p-2">*성명</div>
                                                                <div className="col p-2">*이메일</div>
                                                                <div className="col p-2">*연락처</div>
                                                                <div className="col p-2">*가입일</div>
                                                                <div className="col p-2">*관리</div>
                                                        </div>
                                                        <p style={{textDecoration:'underline', textAlign:'left', fontSize:'0.8em'}}>
                                                                더보기
                                                        </p>
                                                </div>
                                        </div>
                                )}

                                {/* 기업관리 페이지 */}
                                {activeMenu == '기업 관리' &&(
                                        <div style={{display: 'flex', flexDirection: 'column', width:'80%'}}>
                                                <div className='category-content'>
                                                        <h4 style={{textAlign:'left', fontWeight:'60%'}}>기업 검색</h4>
                                                        <div className="row" style={{backgroundColor:'#eeeeee', fontSize:'0.8em'}}>
                                                                <div className="col p-2">번호</div>
                                                                <div className="col p-2">아이디</div>
                                                                <div className="col p-2">성명</div>
                                                                <div className="col p-2">이메일</div>
                                                                <div className="col p-2">연락처</div>
                                                                <div className="col p-2">가입일</div>
                                                                <div className="col p-2">관리</div>
                                                        </div>
                                                        <div className="row" style={{fontSize:'0.8em'}}>
                                                                <div className="col p-2">*번호</div>
                                                                <div className="col p-2">*아이디</div>
                                                                <div className="col p-2">*성명</div>
                                                                <div className="col p-2">*이메일</div>
                                                                <div className="col p-2">*연락처</div>
                                                                <div className="col p-2">*가입일</div>
                                                                <div className="col p-2">*관리</div>
                                                        </div>
                                                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                                <div style={{textDecoration:'underline', textAlign:'left', fontSize:'0.8em'}}>
                                                                        더보기
                                                                </div>
                                                                <button className='button'>탈퇴처리</button>
                                                        </div>
                                                </div>
                                                <div className='category-content'>
                                                        <h4 style={{textAlign:'left', fontWeight:'60%'}}>탈퇴기업 검색</h4>
                                                        <div className="row" style={{backgroundColor:'#eeeeee', fontSize:'0.8em'}}>
                                                                <div className="col p-2">번호</div>
                                                                <div className="col p-2">아이디</div>
                                                                <div className="col p-2">성명</div>
                                                                <div className="col p-2">이메일</div>
                                                                <div className="col p-2">연락처</div>
                                                                <div className="col p-2">가입일</div>
                                                                <div className="col p-2">관리</div>
                                                        </div>
                                                        <div className="row" style={{fontSize:'0.8em'}}>
                                                                <div className="col p-2">*번호</div>
                                                                <div className="col p-2">*아이디</div>
                                                                <div className="col p-2">*성명</div>
                                                                <div className="col p-2">*이메일</div>
                                                                <div className="col p-2">*연락처</div>
                                                                <div className="col p-2">*가입일</div>
                                                                <div className="col p-2">*관리</div>
                                                        </div>
                                                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                                                <div style={{textDecoration:'underline', textAlign:'left', fontSize:'0.8em'}}>
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
                                                        <h4 style={{textAlign:'left', fontWeight:'60%'}}>상품 검색</h4>
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
                                                                                <div className="col p-1 text-center">당일</div>
                                                                                <div className="col p-1 text-center" style={{borderLeft:'1px solid black'}}>일주일</div>
                                                                                <div className="col p-1 text-center" style={{borderLeft:'1px solid black'}}>1개월</div>
                                                                                <div className="col p-1 text-center" style={{borderLeft:'1px solid black'}}>3개월</div>
                                                                                <div className="col p-1 text-center" style={{borderLeft:'1px solid black'}}>1년</div>
                                                                        </div>  
                                                                </div>
                                                                <div style={{marginLeft:"85px"}}>
                                                                        <div style={{display:"flex", gap:"10px", fontSize:"0.8em", padding:"10px"}}>
                                                                                <input type='date' className='calendar'/>
                                                                                <b>~</b>
                                                                                <input type='date' className='calendar'/>
                                                                        </div>
                                                                </div>
                                                        </div>
                                                        {/* 상품 목록 */}
                                                        <h4 style={{textAlign:'left', fontWeight:'60%', marginTop:'20px'}}>상품 목록</h4>
                                                        <hr/>
                                                        <button className='button' style={{marginLeft:'920px'}}>상품등록</button>
                                                        <table className="table table-bordered" style={{width:'1000px', textAlign:'center', border:'1px solid #787878', marginTop:'20px'}}>
                                                                <thead>
                                                                        <tr>
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
                                                                                <td>
                                                                                        <input type="checkbox" aria-label="항목 선택" />
                                                                                </td>
                                                                                <td>기업명</td>
                                                                                <td>카테고리</td>
                                                                                <td>상품명</td>
                                                                                <td>판매가</td>
                                                                                <td>재고</td>
                                                                                <td>등록일</td>
                                                                                <td>
                                                                                        <button className='button2'>수정</button>
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
                                                        <h4 style={{textAlign:'left', fontWeight:'60%'}}>문의 목록</h4>
                                                        <hr/>
                                                        <div className="row" style={{backgroundColor:'#eeeeee', fontSize:'0.8em', textAlign:'center'}}>
                                                                <div className="col p-2">번호</div>
                                                                <div className="col p-2">제목</div>
                                                                <div className="col p-2">작성자</div>
                                                                <div className="col p-2">작성일</div>
                                                                <div className="col p-2">수정/삭제</div>
                                                        </div>
                                                        <div className="row" style={{fontSize:'0.8em', textAlign:'center'}}>
                                                                <div className="col p-2">1</div>
                                                                <div className="col p-2">
                                                                        <div>🔒사고 싶은 옷이 찜목록에서 삭제됐어요.</div>
                                                                </div>
                                                                <div className="col p-2">김희*</div>
                                                                <div className="col p-2">2026-04-26</div>
                                                                <div className="col p-2">
                                                                        <button className='button2'>수정</button>
                                                                        <button className='button2'>삭제</button>
                                                                </div>
                                                        </div>
                                                        {/* 페이징 */}
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
                                        </div>
                                )}
                                {/* 통계 페이지 */}
                                {activeMenu == '통계' && (
                                        <div>
                                                <div className='category-content'>
                                                        <h4 style={{textAlign:'left', fontWeight:'60%'}}>기업 검색</h4>
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
                                                                                <div className="col p-1 text-center">당일</div>
                                                                                <div className="col p-1 text-center" style={{borderLeft:'1px solid black'}}>일주일</div>
                                                                                <div className="col p-1 text-center" style={{borderLeft:'1px solid black'}}>1개월</div>
                                                                                <div className="col p-1 text-center" style={{borderLeft:'1px solid black'}}>3개월</div>
                                                                                <div className="col p-1 text-center" style={{borderLeft:'1px solid black'}}>1년</div>
                                                                        </div>  
                                                                </div>
                                                                <div style={{marginLeft:"85px"}}>
                                                                        <div style={{display:"flex", gap:"10px", fontSize:"0.8em", padding:"10px"}}>
                                                                                <input type='date' className='calendar'/>
                                                                                <b>~</b>
                                                                                <input type='date' className='calendar'/>
                                                                        </div>
                                                                </div>
                                                        </div>
                                                        {/* 상품 목록 */}
                                                        <h4 style={{textAlign:'left', fontWeight:'60%', marginTop:'20px'}}>상품 목록</h4>
                                                        <hr/>
                                                        <button className='button' style={{marginLeft:'920px'}} onClick={()=>setChartOpen(true)}>매출 통계</button>
                                                        <table className="table table-bordered" style={{width:'1000px', textAlign:'center', border:'1px solid #787878', marginTop:'20px'}}>
                                                                <thead>
                                                                        <tr>
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
                                                                                <td>2026-01-22</td>
                                                                                <td>L001</td>
                                                                                <td>야외 〉조경</td>
                                                                                <td>나무원목의자</td>
                                                                                <td>기업명1</td>
                                                                                <td>70,000</td>
                                                                                <td>15</td>
                                                                                <td>69,000</td>
                                                                                <td>151,600</td>
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