package com.finalproject.canvas.controller;

import com.finalproject.canvas.entity.BuyEntity;
import com.finalproject.canvas.repository.BuyRepository;
import com.finalproject.canvas.service.BuyService;
import com.finalproject.canvas.service.PaymentService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
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
        List<BuyEntity> list = buyRepository.findBymId(mId);

        // JSON 직렬화 전에 강제로 fileList를 한 번씩 조회해서 초기화합니다.
        list.forEach(buy -> {
            if (buy.getProduct() != null && buy.getProduct().getFileList() != null) {
                buy.getProduct().getFileList().size(); // 이 한 줄이 데이터를 강제로 로드(초기화)시킵니다.
            }
        });

        return list;
    }

    // 상품 취소/변경/교환 업데이트 - 대호추가
    @PostMapping("/status/{bId}")
    public ResponseEntity<?> updateStatus(@PathVariable Integer bId, @RequestParam("action") String actionType) {
        try {
            buyService.updateOrderStatus(bId, actionType);
            return ResponseEntity.ok().body("요청이 정상적으로 처리되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("오류 발생: " + e.getMessage());
        }
    }

    // 특정 회원의 취소/반품/교환 목록 조회 - 대호추가
    @GetMapping("/cancel/list/{mId}")
    public List<BuyEntity> getCancelBuysByMember(@PathVariable Integer mId) {
        log.info("회원 번호 {} 번의 취소/반품/교환 내역 요청 수신", mId);
        return buyRepository.findCancelListByMember(mId);
    }

    // 마이페이지 기업 판매/정산현황조회
    @Transactional(readOnly = true)
    @GetMapping("/seller/saleslist")
    public List<BuyEntity> getSellerSales(@RequestParam("sellerId") String sellerId) {
        log.info("기업 판매자 [{}] 번의 판매/정산 리스트 요청 수신", sellerId);
        // Repository에서 수정했던 JOIN FETCH 최적화 메소드를 직접 호출하거나
        // Service 단의 로직을 거쳐서 반환하도록 설계합니다.
        return buyRepository.findSalesBySeller(sellerId);
    }

    // 특정 주문 건 정산 완료 처리
    @Transactional
    @PutMapping("/settle/complete/{bId}")
    public ResponseEntity<String> completeSettlement(@PathVariable("bId") Integer bId) {
        return buyRepository.findById(bId).map(buy -> {
            buy.setSettleStatus("COMPLETE"); // 'COMPLETE' 상태 주입
            buyRepository.save(buy);
            return ResponseEntity.ok("주문번호 [" + bId + "] 건 정산 완료 처리 완료! 💰");
        }).orElse(ResponseEntity.notFound().build());
    }

    @Autowired
    private PaymentService paymentService; // 카카오페이 통신을 위한 서비스(별도 구현 필요)

    @PostMapping("/payment/ready") // 이제 /buy/payment/ready 가 됨
    public ResponseEntity<?> ready(@RequestBody Map<String, Object> payload) {
        return paymentService.readyPayment(payload); // paymentService 구현 필요
    }

    @PostMapping("/payment/success")
    public String paymentSuccess(@RequestParam("pg_token") String pgToken, HttpSession session) {

        // PaymentService는 카카오페이 승인을 위해 세션(tid 확인용)이 필요하므로 같이 넘겨줍니다.
        boolean isApproved = paymentService.approvePayment(pgToken, session);

        if (isApproved) {
            // 결제만 승인하고 프론트엔드로 리다이렉트 (주문 DB 저장은 프론트에서 /process-order 로 따로 요청)
            return "redirect:http://192.168.4.60:5173/finalcheck";
        }
        return "redirect:http://192.168.4.60:5173/purchase?error=payment_failed";
    }

    // 프론트엔드의 Finalcheck.jsx가 호출할 경로 (이 부분은 아까와 동일하게 두시면 됩니다)
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
}
