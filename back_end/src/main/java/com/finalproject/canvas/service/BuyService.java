package com.finalproject.canvas.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.finalproject.canvas.entity.*;
import com.finalproject.canvas.repository.BuyRepository;
import com.finalproject.canvas.repository.CartRepository;
import com.finalproject.canvas.repository.DeliveryRepository;
import com.finalproject.canvas.repository.ProductRepository;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders; // 💡 수정됨
import org.springframework.http.MediaType;    // 💡 추가됨
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@CrossOrigin("*")
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BuyService {
    private final BuyRepository buyRepository;
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final DeliveryRepository deliveryRepository;

    @Transactional
    public void addFromCart(Map<String, Object> payload) {
        List<Object> cartIdObjs = (List<Object>) payload.get("cartIds");
        List<Object> dIdObjs = (List<Object>) payload.get("dIds");
        List<Object> countObjs = (List<Object>) payload.get("counts");
        List<Object> discountObjs = (List<Object>) payload.get("discounts");
        List<Object> priceObjs = (List<Object>) payload.get("prices");

        for (int i = 0; i < cartIdObjs.size(); i++) {
            Integer cartId = ((Number) cartIdObjs.get(i)).intValue();
            Integer count = countObjs != null ? ((Number) countObjs.get(i)).intValue() : 1;

            Integer pId = cartRepository.findPIdByCartId(cartId);
            Integer mId = cartRepository.findMIdByCartId(cartId);

            if (pId == null) throw new RuntimeException("상품을 찾을 수 없습니다.");

            ProductEntity product = productRepository.findById(pId).orElseThrow();
            int parsedPrice = Integer.parseInt(product.getPrice().replaceAll("[^0-9]", ""));

            BuyEntity buy = new BuyEntity();
            buy.setCartId(cartId);
            buy.setMId(mId != null ? mId : 0);
            buy.setPId(pId);
            buy.setDId(dIdObjs != null ? ((Number) dIdObjs.get(i)).intValue() : null);
            buy.setCount(count);
            buy.setStatus("결제완료");
            buy.setPrice(priceObjs != null
                    ? ((Number) priceObjs.get(i)).intValue()
                    : parsedPrice);

            buyRepository.save(buy);
            product.setCount(Math.max(0, product.getCount() - count));
            productRepository.save(product);
        }
    }

    @Transactional
    public void saveOrderFromPayload(Map<String, Object> payload) {
        ObjectMapper mapper = new ObjectMapper();
        DeliveryEntity delivery = mapper.convertValue(payload.get("delivery"), DeliveryEntity.class);
        List<CartEntity> cartList = mapper.convertValue(payload.get("cartList"), new TypeReference<List<CartEntity>>() {
        });

        DeliveryEntity savedDelivery = deliveryRepository.save(delivery);
        for (CartEntity item : cartList) {
            BuyEntity buy = new BuyEntity();
            buy.setMId(item.getMId());
            buy.setPId(item.getPId());
            buy.setDId(savedDelivery.getDId());
            buy.setCount(item.getCount());
            buy.setPrice(item.getPrice());
            buy.setStatus("결제대기");
            buy.setIsBuy(OutStatus.Y);
            buy.setPaymentMethod("카카오페이");
            buy.setSettleStatus("WAITING");

            buyRepository.save(buy);
            ProductEntity product = productRepository.findById(item.getPId()).orElseThrow();
            product.setCount(product.getCount() - item.getCount());
            productRepository.save(product);
            cartRepository.deleteById(item.getCartId());
        }
    }

    @Transactional
    public boolean approvePayment(String pgToken, HttpSession session) {
        String tid = (String) session.getAttribute("tid");
        String orderId = (String) session.getAttribute("orderId");
        String userId = (String) session.getAttribute("userId");

        Map<String, Object> payload = (Map<String, Object>) session.getAttribute("orderPayload");

        if (tid == null || payload == null) return false;

        String url = "https://kapi.kakao.com/v1/payment/approve";
        RestTemplate rt = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "KakaoAK 6e8b1a5f56c7f6c57a1172fa4401e59f");
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("cid", "TC0ONETIME");
        params.add("tid", tid);
        params.add("partner_order_id", orderId);
        params.add("partner_user_id", userId);
        params.add("pg_token", pgToken);

        try {
            rt.postForObject(url, new HttpEntity<>(params, headers), Map.class);
            // 💡 클래스명 제거!
            this.saveOrderFromPayload(payload);
            session.removeAttribute("tid");
            session.removeAttribute("orderPayload");
            return true;
        } catch (Exception e) {
            log.error("승인 에러", e);
            return false;
        }
    }

    @Transactional
    public void updateOrderStatus(Integer bId, String status) {
        // 1. 주문 조회 (데이터베이스에서 주문 번호로 찾기)
        BuyEntity buy = buyRepository.findById(bId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 주문 거래입니다."));

        // 2. 입력받은 status 값을 엔티티에 세팅
        // 주의: BuyEntity 클래스에 setStatus(String status) 메서드가 꼭 있어야 합니다.
        buy.setStatus(status);

        // 3. 저장 및 로그 출력
        buyRepository.save(buy);
        log.info("주문 번호 {}의 상태가 {}로 변경되었습니다.", bId, status);
    }

}