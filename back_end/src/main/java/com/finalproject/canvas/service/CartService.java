package com.finalproject.canvas.service;

import com.finalproject.canvas.entity.CartEntity;
import com.finalproject.canvas.repository.CartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CartService {
    private final CartRepository cartRepository;

    //모든 일반회원 정보 가져오기
    public List<CartEntity> getAllList() {
        return cartRepository.findAll();
    }

    public List<CartEntity> getCartByMember(Integer mId){
        return cartRepository.findBymId(mId);
    }

    public void deleteCarts(List<Integer> cartIds) {
        cartRepository.deleteAllById(cartIds);
    }

    // 단건 삭제 메서드 구현 추가 (컨트롤러의 Long cartId 대응)
    public void deleteById(Long cartId) {
        if (cartId != null) {
            cartRepository.deleteById(cartId.intValue());
        }
    }
    // 상세페이지 -> 장바구니
    public CartEntity addCart(CartEntity cart) {

        if (cart.getDiscount() == null) {
            cart.setDiscount(0);
        }

        if (cart.getCount() == null || cart.getCount() <= 0) {
            cart.setCount(1);
        }

        if (cart.getPrice() == null) {
            int base = Integer.parseInt(cart.getProduct().getPrice().replace(",", ""));
            cart.setPrice(base);
        }

        return cartRepository.save(cart); // ★ return
    }


}
