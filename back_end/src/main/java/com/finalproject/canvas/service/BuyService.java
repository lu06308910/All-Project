package com.finalproject.canvas.service;

import com.finalproject.canvas.entity.BuyEntity;
import com.finalproject.canvas.repository.BuyRepository;
import com.finalproject.canvas.repository.CartRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class BuyService {
    private final BuyRepository buyRepository;
    private final CartRepository cartRepository;

    public void addFromCart(Map<String, Object> payload) {
        List<Object> cartIdObjs  = (List<Object>) payload.get("cartIds");
        List<Object> dIdObjs     = (List<Object>) payload.get("dIds");
        List<Object> countObjs   = (List<Object>) payload.get("counts");
        List<Object> discountObjs= (List<Object>) payload.get("discounts");

        for (int i = 0; i < cartIdObjs.size(); i++) {
            Integer cartId = ((Number) cartIdObjs.get(i)).intValue();

            BuyEntity buy = new BuyEntity();
            buy.setCartId(cartId);
            buy.setMId(cartRepository.findMIdByCartId(cartId));
            buy.setPId(cartRepository.findPIdByCartId(cartId));
            buy.setDId(dIdObjs != null ? ((Number) dIdObjs.get(i)).intValue() : null);
            buy.setCount(countObjs != null ? ((Number) countObjs.get(i)).intValue() : 1);
            buy.setDiscount(discountObjs != null ? ((Number) discountObjs.get(i)).intValue() : 0);
            buy.setStatus("결제완료");

            buyRepository.save(buy);
        }
    }

}
