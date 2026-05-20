package com.finalproject.canvas.service;

import com.finalproject.canvas.entity.BuyEntity;
import com.finalproject.canvas.entity.ProductEntity;
import com.finalproject.canvas.repository.BuyRepository;
import com.finalproject.canvas.repository.CartRepository;
import com.finalproject.canvas.repository.ProductRepository;
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

            // 상품 조회 (재고 차감 + 가격 파싱 위해 먼저)
            ProductEntity product = productRepository.findById(pId)
                    .orElseThrow(() -> new RuntimeException("상품 없음: " + pId));

            int parsedPrice = Integer.parseInt(product.getPrice().replaceAll("[^0-9]", ""));

            BuyEntity buy = new BuyEntity();
            buy.setCartId(cartId);
            buy.setMId(cartRepository.findMIdByCartId(cartId));
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

    // 상품취소,반품,교환 업데이트 - 대호추가
    @Transactional
    public void updateOrderStatus(Integer bId, String actionType) {
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

    // 특정 회원 취소/반품/교환 내역 조회 - 대호추가
    public List<BuyEntity> getCancelList(Integer mId) {
        return buyRepository.findCancelListByMember(mId);
    }

    // 기업 사용자의 판매 현황 조회 - 대호추가
    public List<BuyEntity> getSalesList(String sellerId) {
        log.info("BuyService -> findSalesBySeller 호출: {}", sellerId);
        return buyRepository.findSalesBySeller(sellerId);
    }

}