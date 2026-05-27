package com.finalproject.canvas.service;

// 1. IMPORT 수정: 올바른 Jackson 패키지 사용

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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor

@Transactional(readOnly = true)
public class BuyService {
    private final BuyRepository buyRepository;
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final DeliveryRepository deliveryRepository; // 주입 확인 완료

    // ... (addFromCart, updateOrderStatus 등 기존 메서드 동일) ...
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

            // 데이터 조회 및 null 체크
            Integer pId = cartRepository.findPIdByCartId(cartId);
            Integer mId = cartRepository.findMIdByCartId(cartId);

            if (pId == null) {
                throw new RuntimeException("CartId " + cartId + "에 해당하는 상품을 찾을 수 없습니다.");
            }

            // 상품 조회
            ProductEntity product = productRepository.findById(pId)
                    .orElseThrow(() -> new RuntimeException("상품 없음: " + pId));

            int parsedPrice = Integer.parseInt(product.getPrice().replaceAll("[^0-9]", ""));

            BuyEntity buy = new BuyEntity();
            buy.setCartId(cartId);
            buy.setMId(mId != null ? mId : 0); // 필요 시 기본값 처리
            buy.setPId(pId);
            buy.setDId(dIdObjs != null ? ((Number) dIdObjs.get(i)).intValue() : null);
            buy.setCount(count);
            buy.setDiscount(discountObjs != null ? ((Number) discountObjs.get(i)).intValue() : 0);
            buy.setStatus("결제완료");
            buy.setPrice(priceObjs != null
                    ? String.valueOf(((Number) priceObjs.get(i)).intValue())
                    : String.valueOf(parsedPrice));

            buyRepository.save(buy);

            // 재고 차감
            int newStock = product.getCount() - count;
            product.setCount(Math.max(0, newStock));
            productRepository.save(product);
            }
        }


        @Transactional //대호추가
        public void processOrderAfterPayment (HttpSession session) throws Exception {
            log.info("결제 후 세션 확인 - DeliveryJson: {}", session.getAttribute("tempDelivery"));
            log.info("결제 후 세션 확인 - CartJson: {}", session.getAttribute("tempCart"));
            String deliveryJson = (String) session.getAttribute("tempDelivery");
            String cartJson = (String) session.getAttribute("tempCart");

            ObjectMapper mapper = new ObjectMapper();

            // 데이터 역직렬화
            DeliveryEntity delivery = mapper.readValue(deliveryJson, DeliveryEntity.class);
            List<CartEntity> cartList = mapper.readValue(cartJson, new TypeReference<List<CartEntity>>() {
            });

            // 배송지 정보 저장 (중복 제거 완료)
            DeliveryEntity savedDelivery = deliveryRepository.save(delivery);
            Integer dId = savedDelivery.getDId();

            // 주문 정보 저장
            for (CartEntity item : cartList) {
                BuyEntity buy = new BuyEntity();
                buy.setMId(item.getMId());
                buy.setPId(item.getPId());
                buy.setDId(dId);
                buy.setCount(item.getCount());
                buy.setPrice(String.valueOf(item.getPrice()));
                buy.setStatus("결제완료");
                buy.setIsBuy(OutStatus.Y);
                buy.setPaymentMethod("카카오페이");
                buy.setSettleStatus("COMPLETED");

                buyRepository.save(buy);

                // 장바구니 비우기
                cartRepository.deleteById(item.getCartId());
            }

            session.removeAttribute("tempDelivery");
            session.removeAttribute("tempCart");
        }

        // 상품취소, 반품, 교환 업데이트 - 대호추가
        @Transactional
        public void updateOrderStatus (Integer bId, String actionType){
            BuyEntity buy = buyRepository.findById(bId)
                    .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 주문 거래입니다."));

            // 사용자가 요청한 actionType에 따라 status 매핑 변경
            if ("CANCEL".equals(actionType)) {
                buy.setStatus("취소완료");
            } else if ("RETURN".equals(actionType)) {
                buy.setStatus("반품신청");
            } else if ("EXCHANGE".equals(actionType)) {
                buy.setStatus("교환신청");
            } else {
                throw new IllegalArgumentException("잘못된 요청 타입입니다.");
            }

            buyRepository.save(buy);
        }
    @Transactional
    public void saveOrderFromPayload(Map<String, Object> payload) {
        ObjectMapper mapper = new ObjectMapper();

        // 데이터 역직렬화
        DeliveryEntity delivery = mapper.convertValue(payload.get("delivery"), DeliveryEntity.class);
        List<CartEntity> cartList = mapper.convertValue(payload.get("cartList"), new TypeReference<List<CartEntity>>(){});

        // 배송지 저장
        DeliveryEntity savedDelivery = deliveryRepository.save(delivery);
        Integer dId = savedDelivery.getDId();

        // 주문 정보 저장
        for (CartEntity item : cartList) {
            BuyEntity buy = new BuyEntity();
            buy.setMId(item.getMId());
            buy.setPId(item.getPId());
            buy.setDId(dId);
            buy.setCount(item.getCount());
            buy.setPrice(String.valueOf(item.getPrice()));
            buy.setStatus("결제완료");
            buy.setIsBuy(OutStatus.Y);
            buy.setPaymentMethod("카카오페이");
            buy.setSettleStatus("COMPLETED");

            buyRepository.save(buy);
            cartRepository.deleteById(item.getCartId());
        }
    }

    }