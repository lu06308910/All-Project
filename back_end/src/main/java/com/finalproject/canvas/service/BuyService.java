package com.finalproject.canvas.service;

import com.finalproject.canvas.entity.BuyEntity;
import com.finalproject.canvas.repository.BuyRepository;
import com.finalproject.canvas.repository.CartRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class BuyService {
    private final BuyRepository buyRepository;
    private final CartRepository cartRepository;

    public void addFromCart(List<Integer> cartIds) {
        for (Integer cartId : cartIds) {
            BuyEntity buy = new BuyEntity();
            buy.setCartId(cartId);
            buy.setMId(cartRepository.findMIdByCartId(cartId));
            buy.setPId(cartRepository.findPIdByCartId(cartId));

            log.info("저장할 buy: mId={}, pId={}, cartId={}", buy.getMId(), buy.getPId(), buy.getCartId());
            buyRepository.save(buy);
        }
    }

}
