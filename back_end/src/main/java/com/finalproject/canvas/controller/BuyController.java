package com.finalproject.canvas.controller;

import com.finalproject.canvas.entity.BuyEntity;
import com.finalproject.canvas.repository.BuyRepository;
import com.finalproject.canvas.service.BuyService;
import com.finalproject.canvas.service.PaymentService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/buy")
public class BuyController {

    private final BuyService buyService;
    private final BuyRepository buyRepository;
    private final PaymentService paymentService;

    // ... (기존 메서드들 그대로 유지) ...
    @PostMapping("/add")
    public void addBuy(@RequestBody Map<String, Object> payload) {
        buyService.addFromCart(payload);
    }

    @GetMapping("/list/all")
    public List<BuyEntity> getAllBuys() {
        return buyRepository.findAll();
    }

    @GetMapping("/list/{mId}")
    public List<BuyEntity> getBuysByMember(@PathVariable Integer mId) {
        List<BuyEntity> list = buyRepository.findBymId(mId);

        list.forEach(buy -> {
            if (buy.getProduct() != null && buy.getProduct().getFileList() != null) {
                buy.getProduct().getFileList().size();
            }
        });
        return list;
    }

    @PostMapping("/status/{bId}")
    public ResponseEntity<?> updateStatus(
            @PathVariable Integer bId,
            @RequestParam("action") String actionType) {

        try {
            buyService.updateOrderStatus(bId, actionType);
            return ResponseEntity.ok().body("요청이 정상적으로 처리되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("오류 발생: " + e.getMessage());
        }
    }

    // 기업사용자 상태변경 - 대호추가
    @PostMapping("/status/update")
    public ResponseEntity<?> updateStatusByBody(@RequestBody Map<String, Object> payload) {

        try {
            log.info("받은 payload: {}", payload);

            Integer bId = Integer.valueOf(payload.get("bId").toString());
            String status = payload.get("status").toString();

            buyService.updateOrderStatus(bId, status);

            return ResponseEntity.ok("상태 변경 성공");

        } catch (Exception e) {
            log.error("상태 변경 오류", e);
            return ResponseEntity.badRequest().body("오류 내용: " + e.getMessage());
        }
    }

    // 취소,판매,정산
    @GetMapping("/cancel/list/{mId}")
    public List<BuyEntity> getCancelBuysByMember(@PathVariable Integer mId) {
        return buyRepository.findCancelListByMember(mId);
    }

    @Transactional(readOnly = true)
    @GetMapping("/seller/saleslist")
    public List<BuyEntity> getSellerSales(@RequestParam("sellerId") String sellerId) {
        return buyRepository.findSalesBySeller(sellerId);
    }

    @Transactional
    @PutMapping("/settle/complete/{bId}")
    public ResponseEntity<String> completeSettlement(@PathVariable("bId") Integer bId) {
        return buyRepository.findById(bId).map(buy -> {
            buy.setSettleStatus("COMPLETE");
            buyRepository.save(buy);
            return ResponseEntity.ok("주문 완료");
        }).orElse(ResponseEntity.notFound().build());
    }

    // 주문 저장
    @PostMapping("/process-order")
    public ResponseEntity<?> processOrder(@RequestBody Map<String, Object> payload) {
        try {
            buyService.saveOrderFromPayload(payload);
            return ResponseEntity.ok("주문 저장 성공");
        } catch (Exception e) {
            log.error("주문 저장 실패", e);
            return ResponseEntity.internalServerError().body("주문 저장 실패");
        }
    }
/*
    @PostMapping("/payment/ready")
    public ResponseEntity<?> ready(@RequestBody Map<String, Object> payload,
                                   HttpSession session) {

        log.info("=== PAYMENT READY 진입 ===");
        log.info("SESSION ID = {}", session.getId());

        log.info("loginUser = {}", session.getAttribute("loginUser"));

        try {
            Map<String, Object> response = paymentService.ready(payload, session);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("결제 ready 실패", e);
            return ResponseEntity.internalServerError()
                    .body("결제 준비 실패: " + e.getMessage());
        }
    }

    @GetMapping("/payment/success")
    public ResponseEntity<?> paymentSuccess(@RequestParam("pg_token") String pgToken,
                                            HttpSession session) {

        log.info("pg_token 수신: {}", pgToken);

        try {
            boolean isApproved = paymentService.approvePayment(pgToken, session);

            if (isApproved) {
                HttpHeaders headers = new HttpHeaders();
                headers.add("Location",
                        "https://relieving-willing-resend.ngrok-free.dev/pay/success");

                return new ResponseEntity<>(headers, HttpStatus.FOUND);
            }

            HttpHeaders headers = new HttpHeaders();
            headers.add("Location",
                    "https://relieving-willing-resend.ngrok-free.dev/pay/fail");

            return new ResponseEntity<>(headers, HttpStatus.FOUND);

        } catch (Exception e) {
            log.error("결제 승인 실패", e);

            HttpHeaders headers = new HttpHeaders();
            headers.add("Location",
                    "https://relieving-willing-resend.ngrok-free.dev/pay/fail");

            return new ResponseEntity<>(headers, HttpStatus.FOUND);
        }
    } */

}