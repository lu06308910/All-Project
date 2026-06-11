package com.finalproject.canvas.service;

import com.finalproject.canvas.entity.BuyEntity;
import com.finalproject.canvas.entity.PaymentEntity;
import com.finalproject.canvas.repository.BuyRepository;
import com.finalproject.canvas.repository.PaymentRepository;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import javax.crypto.SecretKey;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    private final BuyRepository buyRepository;
    private final PaymentRepository paymentRepository;

    @Value("${kakao.secret-key}")
    private String secretKey;

    @Value("${kakao.pay.approval_url}")
    private String approvalUrl;

    @Value("${kakao.pay.cancel_url}")
    private String cancelUrl;

    @Value("${kakao.pay.fail_url}")
    private String failUrl;

    private static final String CID = "TC0ONETIME";

    /**
     * 공통 헤더 생성
     */
    private HttpHeaders getHeaders() {
        HttpHeaders headers = new HttpHeaders();

        headers.set("Authorization", "KakaoAK " + secretKey);

        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        return headers;
    }

    /**
     * 결제 준비 (ready)
     */
    public Map<String, Object> ready(Map<String, Object> payload, HttpSession session) {

        String itemName = String.valueOf(payload.get("itemName"));
        Object amountObj = payload.get("totalAmount");

        if (amountObj == null || "null".equals(amountObj.toString())) {
            throw new RuntimeException("totalAmount 값이 없습니다.");
        }

        int totalAmount;
        try {
            totalAmount = Integer.parseInt(amountObj.toString());
        } catch (Exception e) {
            throw new RuntimeException("totalAmount 변환 실패: " + amountObj);
        }

        Object mIdObj = session.getAttribute("mId");
        if (mIdObj == null) {
            throw new RuntimeException("로그인 정보 없음");
        }

        Integer mId = Integer.valueOf(String.valueOf(mIdObj));

        String orderId = "ORD_" + UUID.randomUUID();
        String partnerUserId = "user_" + mId;

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("cid", CID);
        params.add("partner_order_id", orderId);
        params.add("partner_user_id", partnerUserId);
        params.add("item_name", itemName);
        params.add("quantity", "1");
        params.add("total_amount", String.valueOf(totalAmount));
        params.add("tax_free_amount", "0");
        params.add("approval_url", approvalUrl);
        params.add("cancel_url", cancelUrl);
        params.add("fail_url", failUrl);

        RestTemplate restTemplate = new RestTemplate();

        ResponseEntity<Map> response = restTemplate.exchange(
                "https://kapi.kakao.com/v1/payment/ready",
                HttpMethod.POST,
                new HttpEntity<>(params, getHeaders()),
                Map.class
        );
        Map<String, Object> body = response.getBody();

        // =========================
        // Payment 저장
        // =========================
        PaymentEntity payment = new PaymentEntity();
        payment.setOrderId(orderId);
        payment.setTid(String.valueOf(body.get("tid")));
        payment.setUserId(mId);
        payment.setItemName(itemName);
        payment.setAmount(totalAmount);
        payment.setStatus("READY");

        paymentRepository.save(payment);

        // =========================
        // Buy 생성 (결제 대기 상태)
        // =========================
        BuyEntity buy = new BuyEntity();
        buy.setOrderId(orderId);
        buy.setStatus("결제대기");
        buy.setPrice(totalAmount);

        buyRepository.save(buy);

        // =========================
        // session 저장 (approve용)
        // =========================
        session.setAttribute("tid", body.get("tid"));
        session.setAttribute("partner_order_id", orderId);
        session.setAttribute("partner_user_id", partnerUserId);

        log.info("READY 완료 - orderId: {}", orderId);

        return body;
    }

    // =========================
    // APPROVE (결제 승인 + DB 업데이트)
    // =========================
    public boolean approvePayment(String pgToken, HttpSession session) {

        try {
            String tid = String.valueOf(session.getAttribute("tid"));
            String orderId = String.valueOf(session.getAttribute("partner_order_id"));
            String userId = String.valueOf(session.getAttribute("partner_user_id"));

            MultiValueMap<String, String> params = new LinkedMultiValueMap<>();

            params.add("cid", CID);
            params.add("tid", tid);
            params.add("partner_order_id", orderId);
            params.add("partner_user_id", userId);
            params.add("pg_token", pgToken);

            RestTemplate restTemplate = new RestTemplate();

            ResponseEntity<Map> response = restTemplate.exchange(
                    "https://kapi.kakao.com/v1/payment/approve",
                    HttpMethod.POST,
                    new HttpEntity<>(params, getHeaders()),
                    Map.class
            );

            log.info("APPROVE RESPONSE: {}", response.getBody());

            // =========================
            // Payment 상태 변경
            // =========================
            PaymentEntity payment = paymentRepository.findByOrderId(orderId)
                    .orElseThrow(() -> new RuntimeException("Payment 없음"));

            payment.setStatus("PAID");
            paymentRepository.save(payment);

            // =========================
            // Buy 상태 변경
            // =========================
            BuyEntity buy = buyRepository.findByOrderId(orderId);
            if (buy != null) {
                buy.setStatus("결제완료");
                buyRepository.save(buy);
            }

            // =========================
            // session 정리
            // =========================
            session.removeAttribute("tid");
            session.removeAttribute("partner_order_id");
            session.removeAttribute("partner_user_id");

            log.info("APPROVE 완료 - orderId: {}", orderId);

            return true;

        } catch (Exception e) {
            log.error("KakaoPay APPROVE ERROR", e);
            return false;
        }
    }
}