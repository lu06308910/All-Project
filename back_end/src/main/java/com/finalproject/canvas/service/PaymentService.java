package com.finalproject.canvas.service;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class PaymentService {

    // 이 메서드가 반드시 정의되어 있어야 합니다.
    public ResponseEntity<?> readyPayment(Map<String, Object> payload) {
        // 1. 여기서 카카오페이 API(RestTemplate 등을 사용)로 요청을 보냅니다.
        // 2. 카카오페이로부터 받은 응답(next_redirect_pc_url 등)을 반환합니다.

        // 예시 구조:
        // return restTemplate.postForEntity(kakaoUrl, request, Map.class);
        return ResponseEntity.ok().build(); // 임시 구현
    }

    private final RestTemplate restTemplate;

    @Value("${kakao.admin.key}")
    private String adminKey;

    public String ready(Map<String, Object> payload, HttpSession session) {
        String url = "https://kapi.kakao.com/v1/payment/ready";

        // 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "KakaoAK " + adminKey);
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        // 바디 설정 (카카오페이는 FORM_URLENCODED 형식을 요구합니다)
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("cid", "TC0ONETIME"); // 테스트용 가맹점 코드
        params.add("partner_order_id", "partner_order_id");
        params.add("partner_user_id", payload.get("memberId").toString());
        params.add("item_name", payload.get("item_name").toString());
        params.add("quantity", "1");
        params.add("total_amount", payload.get("total_amount").toString());
        params.add("tax_free_amount", "0");
        params.add("approval_url", "http://192.168.4.60:9991/buy/payment/success");
        params.add("cancel_url", "http://192.168.4.60:5173/purchase");
        params.add("fail_url", "http://192.168.4.60:5173/purchase");

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

        // 3. API 호출
        Map response = restTemplate.postForObject(url, request, Map.class);

        // 4. 세션에 tid 저장 (승인 단계에서 필요)
        session.setAttribute("tid", response.get("tid"));

        return (String) response.get("next_redirect_pc_url");
    }

    public boolean approvePayment(String pgToken, HttpSession session) {
        String tid = (String) session.getAttribute("tid");
        String url = "https://kapi.kakao.com/v1/payment/approve";

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "KakaoAK " + adminKey);
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("cid", "TC0ONETIME");
        params.add("tid", tid);
        params.add("partner_order_id", "partner_order_id");
        params.add("partner_user_id", "고객ID"); // 세션에서 가져오기 권장
        params.add("pg_token", pgToken);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

        try {
            restTemplate.postForObject(url, request, Map.class);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
