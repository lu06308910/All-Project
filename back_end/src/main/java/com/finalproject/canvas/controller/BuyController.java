package com.finalproject.canvas.controller;

import com.finalproject.canvas.entity.BuyEntity;
import com.finalproject.canvas.repository.BuyRepository;
import com.finalproject.canvas.service.BuyService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/buy")
public class BuyController {

    private final BuyService buyService;  // final 추가!
    private final BuyRepository buyRepository;

    @PostMapping("/add")
    public void addBuy(@RequestBody Map<String, Object> payload) {
        buyService.addFromCart(payload);
    }

    @GetMapping("/list/all")
    public List<BuyEntity> getAllBuys() {
        return buyRepository.findAll();
    }

    // 특정 회원의 주문 조회
    @GetMapping("/list/{mId}")
    public List<BuyEntity> getBuysByMember(@PathVariable Integer mId) {
        return buyRepository.findBymId(mId);
    }
    // 상품 취소/변경/교환 업데이트
    @PostMapping("/status/{bId}")
    public ResponseEntity<?> updateStatus(@PathVariable Integer bId, @RequestParam("action") String actionType) {
        try {
            buyService.updateOrderStatus(bId, actionType);
            return ResponseEntity.ok().body("요청이 정상적으로 처리되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("오류 발생: " + e.getMessage());
        }
    }

    // 특정 회원의 취소/반품/교환 목록 조회
    @GetMapping("/cancel/list/{mId}")
    public List<BuyEntity> getCancelBuysByMember(@PathVariable Integer mId) {
        log.info("회원 번호 {} 번의 취소/반품/교환 내역 요청 수신", mId);
        return buyRepository.findCancelListByMember(mId);
    }

    @GetMapping("/seller/saleslist")
    public List<BuyEntity> getSellerSales(@RequestParam("sellerId") String sellerId) {
        return buyService.getSalesList(sellerId);
    }
}
