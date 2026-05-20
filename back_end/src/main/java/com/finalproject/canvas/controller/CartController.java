package com.finalproject.canvas.controller;

import com.finalproject.canvas.entity.CartEntity;
import com.finalproject.canvas.service.CartService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
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
    //장바구니에서 구매 완료 후 자동 삭제
    @DeleteMapping("/delete")
    public void deleteCarts(@RequestBody List<Integer> cartIds) {
        cartService.deleteCarts(cartIds);
    }
    // 상세페이지 -> 장바구니 정보넘기기 (이슬 추가)
    @PostMapping("/add")
    public ResponseEntity<?> addCart(@RequestBody CartEntity cart) {
        System.out.println("====== 받은 CART ======");
        System.out.println("mId = " + cart.getMId());
        System.out.println("pId = " + cart.getPId());
        System.out.println("color = " + cart.getColor());
        System.out.println("size = " + cart.getSize());
        System.out.println("count = " + cart.getCount());
        System.out.println("======================");

        cartService.addCart(cart);
        return ResponseEntity.ok("success");
    }
}
