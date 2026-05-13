import React, { useState, useEffect } from "react";
import { Link, Outlet } from 'react-router-dom';
import axios from "axios";
import Footer from './Footer';
import './../css/top.css';

function Top() {
  const [showTopBtn, setShowTopBtn] = useState(false);

  const isLogin = window.sessionStorage.getItem("logStatus") === "Y"; // 로그인 여부판단
  //스트링부트의 session삭제
  //sessionStorage정보 삭제
  // 로그아웃
  const handleLogout = () => {
    // 세션 스토리지의 모든 정보 삭제
    sessionStorage.clear();

    // 또는 특정 항목만 삭제하고 싶을 때:
    // sessionStorage.removeItem('logStatus');
    // sessionStorage.removeItem('logId');
    // sessionStorage.removeItem('logName');

    alert("로그아웃 되었습니다.");

    // 2. 메인 페이지로 이동하면서 새로고침 (상태 초기화)
    window.location.href = "/";
  };

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
            <Link to="/sale">할인 상품</Link>
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
              {/* 로그인 안 했을 때 */}
              {!isLogin && (
                <>
                  <div><Link to="/login">로그인</Link></div>
                  <div><Link to="/member/signup">회원가입</Link></div>
                </>
              )}

              {/* 로그인 했을 때 */}
              {isLogin && (
                <>
                  <div><Link to="#" onClick={handleLogout}>로그아웃</Link></div>
                  <div><Link to="/mypage">마이스토어</Link></div>
                  <div><Link to="/basket">장바구니</Link></div>
                </>
              )}

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