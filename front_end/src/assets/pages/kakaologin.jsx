import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Kakaologin() {
        const navigate = useNavigate();

        useEffect(() => {
                // URL 주소창에서 카카오가 넘겨준 code 파라미터 추출
                const params = new URLSearchParams(window.location.search);
                const code = params.get("code");

                if (code) {
                        console.log("카카오 인가 코드 획득:", code);

                        // 스프링 부트 백엔드로 인가 코드 전송
                        axios.get(`http://localhost:9991/member/kakao?code=${code}`)
                                .then(response => {
                                        console.log("백엔드 로그인 결과:", response.data);

                                        if (response.data.status === "OK") {
                                                // 기존 로그인 성공 로직과 동일하게 세션 스토리지 저장
                                                sessionStorage.setItem('logStatus', 'Y');
                                                sessionStorage.setItem("loginUserId", response.data.userid);
                                                sessionStorage.setItem("mId", response.data.mId);
                                                sessionStorage.setItem('logId', response.data.userid);
                                                sessionStorage.setItem('logName', response.data.username);
                                                sessionStorage.setItem('usertype', response.data.usertype);

                                                alert(`${response.data.username}님, 카카오 로그인 성공!`);
                                                window.location.href = "/";
                                        } else {
                                                alert("카카오 로그인 실패: " + response.data.message);
                                                navigate("/login");
                                        }
                                })
                                .catch(error => {
                                        console.error("카카오 로그인 요청 에러:", error);
                                        alert("서버 통신 오류가 발생했습니다.");
                                        navigate("/member/login");
                                });
                }
        }, [navigate]);

        return (
                <div style={{ marginTop: '200px', textAlign: 'center', fontSize: '18px' }}>
                        <p>카카오 로그인 처리 중입니다. 잠시만 기다려주세요...</p>
                </div>
        );
}

export default Kakaologin;