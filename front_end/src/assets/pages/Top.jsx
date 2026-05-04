import React, { useState, useEffect } from "react";
import { Link, Outlet } from 'react-router-dom';
import Footer from './Footer';
import './../css/top.css';

function Top() {
  const [showTopBtn, setShowTopBtn] = useState(false);

  // 스크롤 감지 로직
  useEffect(() => {
    const handleShowButton = () => {
      if (window.scrollY > 500) { // 500px 이상 내려오면 버튼 보임
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    };

    window.addEventListener("scroll", handleShowButton);
    return () => {
      window.removeEventListener("scroll", handleShowButton);
    };
  }, []);

  // 최상단이동
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // 부드럽게 올라가는 효과
    });
  }
  //---------------------------------------------------------------------
  return (
    <div className="layoutAll">
      {showTopBtn && (
        <div className="scroll-container">
          <button className="top-btn" onClick={scrollToTop}>
            TOP
          </button>
        </div>
      )}

      {/* 메인로고 */}
      <header className="header-container">

        <div className="inner-container">
          <div className="header">
            <Link to="/">CANVAS</Link>
          </div>

          {/* 메인 카테고리 */}
          <div className="main-categori">
            <Link to="/allproduct">모든 상품</Link>
            <Link to="/spaceproduct">공간별</Link>
            <Link to="">할인 상품</Link>
            <Link to="/qna">서비스지원</Link>
            <Link to="/manager">관리자페이지</Link>
          </div>

          {/* 검색 및 아이콘카테고리 */}
          <div className="sub-categori">
            <div className="search-bar">
              <input type="text" placeholder="검색할 상품을 입력해주세요." />
              <button className="search-icon"></button>
            </div>

            <div className="icon-categori">
              <div><Link to="/login">로그인</Link></div>
              <div><Link to="/member/signup">회원가입</Link></div>
              <div><Link to="">마이스토어</Link></div>
              <div><Link to="">장바구니</Link></div>
            </div>
          </div>
        </div>
      </header >

      <main className="inner-container">
        <Outlet />
      </main>

      <Footer />
    </div>

  );
}

export default Top;