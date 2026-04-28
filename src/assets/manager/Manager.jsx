import { useState } from 'react'
import './../css/gayoung.css'
import 'bootstrap/dist/css/bootstrap.min.css';

function Manager(){
        
        const [activeMenu, setActiveMenu] = useState('대시보드');

        const menus = ['대시보드', '회원 관리', '기업 관리', '상품 관리', '게시글 관리', '문의 관리', '통계', '환경설정'];

        return(
                <div className='manager-container'>
                        <div className='category-mana'>
                                <h1 className="canvas">CANVAS</h1>
                                <div className='sub-mana'>
                                        {menus.map((menu) => (
                                        <p 
                                                key={menu} 
                                                onClick={() => setActiveMenu(menu)}
                                                style={{ 
                                                        cursor: 'pointer', 
                                                        backgroundColor: activeMenu === menu ? '#3a4ca8' : '#333333',
                                                        padding: '10px 15px'
                                                }}
                                        >
                                        {menu}
                                        </p>
                                ))}
                                </div>
                        </div>

                        {/* 회원관리 페이지 */}
                        {activeMenu == '회원 관리' &&(
                                <div style={{display: 'flex', flexDirection: 'column', width:'900px'}}>
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
                                                        <div className='button'>탈퇴처리</div>
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
                                <div style={{display: 'flex', flexDirection: 'column', width:'900px'}}>
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
                                                        <div className='button'>탈퇴처리</div>
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
                                                <h4 style={{textAlign:'left', fontWeight:'600'}}>상품 검색</h4>
                                                <hr/>
                                                <div style={{textAlign:'left'}}>
                                                        <div style={{display: 'flex', justifyContent: 'space-between', gap:'10px'}}>
                                                               <p>카테고리 :</p> 
                                                               <select className="cat1" style={{width:'200px', padding:'3px', borderRadius:'10px', fontSize:'0.8em', height:'40px'}}>
                                                                        <option value="null">대분류</option>
                                                                        <option value="category">카테고리1</option>
                                                                        <option value="category">카테고리2</option>
                                                               </select>
                                                               <select className="cat1" style={{width:'200px', padding:'3px', borderRadius:'10px', fontSize:'0.8em', height:'40px'}}>
                                                                        <option value="null">소분류</option>
                                                                        <option value="category">카테고리1</option>
                                                                        <option value="category">카테고리2</option>
                                                               </select>
                                                        </div>
                                                        <div style={{display: 'flex', justifyContent: 'space-between', gap:'10px'}}>
                                                               <p>검색어 :</p>
                                                               <select className="cat1" style={{width:'200px', padding:'3px', borderRadius:'10px', fontSize:'0.8em', height:'40px'}}>
                                                                        <option value="null">전체</option>
                                                                        <option value="category">상품명</option>
                                                                        <option value="category">기업명</option>
                                                               </select>
                                                               <input type='text' className='search-text'></input>
                                                        </div>
                                                        
                                                        <p>검색어 :</p>
                                                        <p>등록일자 :</p>
                                                </div>
                                                
                                        </div>
                                </div>
                        )}
                        {/* 게시글관리 페이지 */}
                        {activeMenu == '게시글 관리' && (
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
        )
}

export default Manager