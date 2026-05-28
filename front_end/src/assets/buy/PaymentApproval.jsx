import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

function PaymentApproval() {
        const navigate = useNavigate();
        const [searchParams] = useSearchParams();
        const pg_token = searchParams.get("pg_token"); // 카카오에서 보내준 토큰 추출

        useEffect(() => {

                const pg_token = new URLSearchParams(window.location.search).get("pg_token");

                if (pg_token) {
                        axios.post(`https://relieving-willing-resend.ngrok-free.dev/buy/payment/success?pg_token=${pg_token}`)
                                .then(res => {
                                        console.log("결제 성공:", res.data);
                                        // 성공 시 최종 확인 페이지로 이동
                                        navigate('/finalcheck');
                                })
                                .catch(err => {
                                        console.error("결제 승인 실패:", err);
                                        alert("결제 처리 중 오류가 발생했습니다.");
                                        navigate('/purchase'); // 실패 시 구매 페이지로 복귀
                                });
                }
        }, []);

        return (
                <div style={{ textAlign: 'center', marginTop: '100px' }}>
                        <h3>결제 승인 중입니다...</h3>
                        <p>잠시만 기다려 주세요.</p>
                </div>
        );
}

export default PaymentApproval;