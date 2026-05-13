import React from 'react';
import { Link } from 'react-router-dom';
import './../css/footer.css';

function Footer() {
        return (
                <footer className="footer-container">
                        <div className="inner-container footer-content">

                                {/* CANVAS 정보 및 링크 */}
                                <div className="footer-top">
                                        <div className="footer-brand">
                                                <h2 className="footer-logo">CANVAS</h2>
                                                <p className="footer-desc">
                                                        공간의 가치를 기록하고 제안하는 인테리어 아카이브 플랫폼, CANVAS입니다.
                                                </p>
                                        </div>

                                        <div className="footer-links">
                                                <div className="link-group">
                                                        <span>Service</span>
                                                        <Link to="/">모든 상품</Link>
                                                        <Link to="/">공간별 추천</Link>
                                                        <Link to="/">할인 상품</Link>
                                                </div>
                                                <div className="link-group">
                                                        <span>Support</span>
                                                        <Link to="/">서비스지원</Link>
                                                        <Link to="/">이용약관</Link>
                                                        <Link to="/">개인정보처리방침</Link>
                                                </div>
                                        </div>
                                </div>

                                {/* 하단: 회사 상세 정보 및 카피라이트 */}
                                <div className="footer-bottom">
                                        <div className="company-info">
                                                <span>주식회사 캔버스</span>
                                                <span>대표이사: 김대호</span>
                                                <span>사업자등록번호: 000-00-00000</span>
                                                <span>주소: 서울특별시 어딘가 구석진 개발실</span>
                                                <span>
                                                        &copy; {new Date().getFullYear()} CANVAS. All rights reserved.
                                                </span>
                                        </div>

                                </div>

                        </div>
                </footer>
        );
};

export default Footer;