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
}
