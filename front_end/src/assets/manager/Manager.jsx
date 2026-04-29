import { useState } from 'react'
import './../css/gayoung.css'
import './../css/top.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';


function Manager(){
        
        const [activeMenu, setActiveMenu] = useState('대시보드');

        const menus = ['대시보드', '회원 관리', '기업 관리', '상품 관리', '게시글 관리', '문의 관리', '통계', '환경설정'];
        const submenus= ['-예약', '-이벤트 관리']

        return(
                <div className='inner-container'>
                        <div className='manager-container'>
                                <div className='category-mana'>
                                        <Link to="/" style={{textDecoration:"none"}}>
                                             <h1 className="canvas">CANVAS</h1>   
                                        </Link>
                                        <div className='sub-mana'>
                                        {menus.map((menu) => (
                                                <p key={menu}>
                                                <p
                                                        onClick={() => setActiveMenu(menu)}
                                                        style={{
                                                        cursor: 'pointer',
                                                        backgroundColor: activeMenu === menu ? '#3a4ca8' : '#333333',
                                                        padding: '0px 15px',
                                                        margin: 0
                                                        }}
                                                >
                                                        {menu}
                                                </p>
                                                
                                                {/* 서브메뉴 조건부 렌더링 */}
                                                {menu === '게시글 관리' && activeMenu === '게시글 관리' && (
                                                        <div style={{ backgroundColor: '#222222' }}>
                                                        {submenus.map((sub) => (
                                                                <p
                                                                key={sub}
                                                                onClick={() => setActiveMenu(sub)}
                                                                style={{
                                                                        cursor: 'pointer',
                                                                        padding: '8px 30px',
                                                                        fontSize: '0.9em',
                                                                        color: activeMenu === sub ? '#ffffff' : '#aaaaaa',
                                                                        backgroundColor: activeMenu === sub ? '#4a5cb8' : 'transparent',
                                                                        margin: 0
                                                                }}
                                                                >
                                                                {sub}
                                                                </p>
                                                        ))}
                                                        </div>
                                                )}
                                                </p>
                                        ))}
                                        </div>
                                </div>
                                {/* 회원관리 페이지 */}
                                {activeMenu == '회원 관리' &&(
                                        <div style={{display: 'flex', flexDirection: 'column', width:'80%'}}>
                                                <div className='category-content'>
                                                        <h4 style={{textAlign:'left', fontWeight:'600'}}>회원 검색</h4>
                                                        <div class="row" style={{backgroundColor:'#eeeeee', fontSize:'0.8em'}}>
                                                                <div className="col p-2">번호</div>
                                                                <div className="col p-2">아이디</div>
                                                                <div className="col p-2">성명</div>
                                                                <div className="col p-2">이메일</div>
                                                                <div className="col p-2">연락처</div>
                                                                <div className="col p-2">가입일</div>
                                                                <div className="col p-2">관리</div>
                                                        </div>
                                                        <div class="row" style={{fontSize:'0.8em'}}>
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
                                                        <div class="row" style={{backgroundColor:'#eeeeee', fontSize:'0.8em'}}>
                                                                <div className="col p-2">번호</div>
                                                                <div className="col p-2">아이디</div>
                                                                <div className="col p-2">성명</div>
                                                                <div className="col p-2">이메일</div>
                                                                <div className="col p-2">연락처</div>
                                                                <div className="col p-2">가입일</div>
                                                                <div className="col p-2">관리</div>
                                                        </div>
                                                        <div class="row" style={{fontSize:'0.8em'}}>
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
                                                        <h4 style={{textAlign:'left', fontWeight:'600'}}>기업 검색</h4>
                                                        <div class="row" style={{backgroundColor:'#eeeeee', fontSize:'0.8em'}}>
                                                                <div className="col p-2">번호</div>
                                                                <div className="col p-2">아이디</div>
                                                                <div className="col p-2">성명</div>
                                                                <div className="col p-2">이메일</div>
                                                                <div className="col p-2">연락처</div>
                                                                <div className="col p-2">가입일</div>
                                                                <div className="col p-2">관리</div>
                                                        </div>
                                                        <div class="row" style={{fontSize:'0.8em'}}>
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
                                                        <h4 style={{textAlign:'left', fontWeight:'600'}}>탈퇴기업 검색</h4>
                                                        <div class="row" style={{backgroundColor:'#eeeeee', fontSize:'0.8em'}}>
                                                                <div className="col p-2">번호</div>
                                                                <div className="col p-2">아이디</div>
                                                                <div className="col p-2">성명</div>
                                                                <div className="col p-2">이메일</div>
                                                                <div className="col p-2">연락처</div>
                                                                <div className="col p-2">가입일</div>
                                                                <div className="col p-2">관리</div>
                                                        </div>
                                                        <div class="row" style={{fontSize:'0.8em'}}>
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
                                                                        <div class="row mx-0" style={{backgroundColor:'#eeeeee', fontSize:'0.8em', border: '1px solid #333333', borderRadius:'10px', width:'400px'}}>
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
                                                        <h4 style={{textAlign:'left', fontWeight:'600', marginTop:'20px'}}>상품 목록</h4>
                                                        <hr/>
                                                        <button className='button' style={{marginLeft:'920px'}}>상품등록</button>
                                                        <table class="table table-bordered" style={{width:'1000px', textAlign:'center', border:'1px solid #787878', marginTop:'20px'}}>
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
                                {activeMenu == '예약 관리' && (
                                        <div>
                                                <div className='category-content'>
                                                        <h4 style={{textAlign:'left', fontWeight:'600'}}>게시글 검색</h4>
                                                </div>
                                        </div>
                                )}
                                {/* 게시글관리 페이지 */}
                                {activeMenu == '이벤트 관리' && (
                                        <div>
                                                <div className='category-content'>
                                                        <h4 style={{textAlign:'left', fontWeight:'600'}}>게시글 검색</h4>
                                                </div>
                                        </div>
                                )}
                                {/* 문의관리 페이지 */}
                                {activeMenu == '문의 관리' && (
                                        <div>
                                                <div className='category-content'>
                                                        <h4 style={{textAlign:'left', fontWeight:'600'}}>문의 검색</h4>
                                                </div>
                                        </div>
                                )}
                                {/* 통계 페이지 */}
                                {activeMenu == '통계' && (
                                        <div>
                                                <div className='category-content'>
                                                        <h4 style={{textAlign:'left', fontWeight:'600'}}>통계 조건 검색</h4>
                                                </div>
                                        </div>
                                )}
                                {/* 환경설정 페이지 */}
                                {activeMenu == '환경설정' && (
                                        <div>
                                        </div>
                                )}
                        </div>
                </div>
        )
}

export default Manager