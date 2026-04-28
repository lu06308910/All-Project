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
                                                        padding: activeMenu == menu ? '10px' : '0px'
                                                }}
                                        >
                                        {menu}
                                        </p>
                                ))}
                                </div>
                        </div>
                        <div style={{display: 'flex', flexDirection: 'column', width:'1000px'}}>
                                <div className='category-content'>
                                        {activeMenu == '회원 관리' && (
                                                <>
                                                        <h4 style={{textAlign:'left'}}>회원 검색</h4>
                                                        <div class="row" style={{backgroundColor:'#eeeeee'}}>
                                                                <div className="col p-2">번호</div>
                                                                <div className="col p-2">아이디</div>
                                                                <div className="col p-2">성명</div>
                                                                <div className="col p-2">이메일</div>
                                                                <div className="col p-2">연락처</div>
                                                                <div className="col p-2">가입일</div>
                                                                <div className="col p-2">관리</div>
                                                        </div>
                                                        <div class="row">
                                                                <div className="col p-2">*번호</div>
                                                                <div className="col p-2">*아이디</div>
                                                                <div className="col p-2">*성명</div>
                                                                <div className="col p-2">*이메일</div>
                                                                <div className="col p-2">*연락처</div>
                                                                <div className="col p-2">*가입일</div>
                                                                <div className="col p-2">*관리</div>
                                                        </div>
                                                </>
                                                )
                                        }
                                </div>
                                <div className='category-content'>
                                        {activeMenu == '회원 관리' && (
                                                <>
                                                        <h4 style={{textAlign:'left'}}>탈퇴회원 검색</h4>
                                                        <div class="row" style={{backgroundColor:'#eeeeee'}}>
                                                                <div className="col p-2">번호</div>
                                                                <div className="col p-2">아이디</div>
                                                                <div className="col p-2">성명</div>
                                                                <div className="col p-2">이메일</div>
                                                                <div className="col p-2">연락처</div>
                                                                <div className="col p-2">가입일</div>
                                                                <div className="col p-2">관리</div>
                                                        </div>
                                                        <div class="row">
                                                                <div className="col p-2">*번호</div>
                                                                <div className="col p-2">*아이디</div>
                                                                <div className="col p-2">*성명</div>
                                                                <div className="col p-2">*이메일</div>
                                                                <div className="col p-2">*연락처</div>
                                                                <div className="col p-2">*가입일</div>
                                                                <div className="col p-2">*관리</div>
                                                        </div>
                                                </>
                                                )
                                        }
                                </div>
                        </div>
                </div>
        )
}

export default Manager