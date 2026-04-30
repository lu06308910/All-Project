import React, { useState } from "react";
import { Link } from "react-router-dom";
import './../css/seul.css';


function Space(){
        return(
                <div className="space-wrap">

                        <div >
                                <div style={{marginTop:'100px'}}>공간별 쇼핑하기</div>

                                <div style={{display:'flex'}}>
                                        <div>
                                                <h2 style={{fontWeight:'bold',marginBottom:'0'}}>공간을 완성하는 편안함, 스타일,</h2>
                                                <h2 style={{fontWeight:'bold',margin:'0'}}>그리고 스마트한 집 안 모든 장소에 </h2>
                                                <h2 style={{fontWeight:'bold',marginTop:'0'}}>어울리는 맞춤형 솔루션</h2>
                                        </div>
                                        <div style={{marginLeft:'20px'}}>
                                                <img src="public/spacemain.png" />
                                        </div>
                                </div>
                        </div>



                        <h1>CANVAS만의 공간 디자인</h1>  
                        <div className="space-grid " >
                                {/* 1번 큰 이미지 */}
                                <div className="big-img img-box">
                                        <img src="public/imgcatagory4.jpg" />
                                        <a href="">
                                                <img src="public/imgBtn.png" className="btn-img"/>
                                        </a>

                                        {/* 오버레이(마우스 오버 시 나타남) */}
                                        <div className="hover-box">
                                                <span>거실 더보기</span>
                                        </div>
                                </div>

                                {/* 2번 위쪽 작은 이미지 */}
                                <div className="small-top img-box">
                                        <img src="public/imgcatagory3.png" />
                                        <a href="">
                                                <img src="public/imgBtn.png" className="btn-img"/>
                                        </a>

                                        <div className="hover-box">
                                                <span>주방 더보기</span>
                                        </div>
                                </div>

                                {/* 3번 식물 이미지 */}
                                <div className="small-right img-box">
                                        <img src="public/imgcatagory2.png" />
                                        <a href="">
                                                <img src="public/imgBtn.png" className="btn-img"/>
                                        </a>

                                        <div className="hover-box">
                                                <span>욕실 더보기</span>
                                        </div>
                                </div>

                                {/* 4번 긴 테이블 이미지 */}
                                <div className="wide-bottom img-box">
                                        <img src="public/imgcatagory.png"/>
                                        <a href="">
                                                <img src="public/imgBtn.png" className="btn-img"/>
                                        </a>

                                        <div className="hover-box">
                                                <span>침실 더보기</span>
                                        </div>
                                </div>

                        </div>
                        <h2>관련상품</h2>
                        




                </div>
        )


}
export default Space;