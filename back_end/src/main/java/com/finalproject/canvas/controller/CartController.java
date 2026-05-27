package com.finalproject.canvas.controller;

import com.finalproject.canvas.entity.CartEntity;
import com.finalproject.canvas.repository.CartRepository;
import com.finalproject.canvas.service.CartService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins="*")
@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/cart")
public class CartController {
    private final CartService cartService;
    private final CartRepository cartRepository;

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

        CartEntity saved = cartService.addCart(cart);

        return ResponseEntity.ok(
                Map.of("cartId", saved.getCartId())
        );
    }
    // 장바구니페이지에서 옵션변경 기능
    @PutMapping("/update/{cartId}")
    public ResponseEntity<?> updateCart(
            @PathVariable Integer cartId,
            @RequestBody CartEntity req
    ) {
        CartEntity cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new RuntimeException("cart not found"));

        cart.setColor(req.getColor());
        cart.setSize(req.getSize());
        cart.setCount(req.getCount());
        cart.setPrice(req.getPrice());

        cartRepository.save(cart);

        return ResponseEntity.ok("updated");
    }

    // 이슬추가, 상세페이지에서 바로구매
    @PostMapping("/list-by-ids")
    public List<CartEntity> getCartByIds(@RequestBody List<Integer> ids) {
        return cartService.getCartByIds(ids);
    }
}
