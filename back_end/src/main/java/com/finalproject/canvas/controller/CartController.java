package com.finalproject.canvas.controller;

import com.finalproject.canvas.entity.CartEntity;
import com.finalproject.canvas.service.CartService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins="*")
@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/cart")
public class CartController {
    private final CartService cartService;

    //모든 회원 정보 가져오기 (관리자 페이지)
    @GetMapping("/all")
    public List<CartEntity> getList() {
        return cartService.getAllList();
    }

    @GetMapping("/list/{mId}")
    public List<CartEntity> getCartByMember(@PathVariable Integer mId){
        return cartService.getCartByMember(mId);
    }
}
