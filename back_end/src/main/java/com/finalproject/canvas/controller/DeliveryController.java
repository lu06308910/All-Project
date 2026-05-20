package com.finalproject.canvas.controller;

import com.finalproject.canvas.entity.DeliveryEntity;
import com.finalproject.canvas.repository.DeliveryRepository;
import com.finalproject.canvas.service.DeliveryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/delivery")
public class DeliveryController {

    private final DeliveryService deliveryService;

    // 배송지 저장 (Parchase.jsx에서 POST)
    @PostMapping("/add")
    public DeliveryEntity addDelivery(@RequestBody DeliveryEntity delivery) {
        return deliveryService.addDelivery(delivery);
    }

    // 여러 건 저장 (상품 수만큼)
    @PostMapping("/add/all")
    public List<DeliveryEntity> addAllDelivery(@RequestBody List<DeliveryEntity> deliveries) {
        return deliveryService.addAllDelivery(deliveries);
    }

    // 특정 회원 배송지 조회
    @GetMapping("/list/{mId}")
    public List<DeliveryEntity> getDeliveryByMember(@PathVariable Integer mId) {
        return deliveryService.getDeliveryByMember(mId);
    }

    // 전체 배송지 조회 (관리자용)
    @GetMapping("/all")
    public List<DeliveryEntity> getAllDelivery() {
        return deliveryService.getAllDelivery();
    }

    // 대호추가 - 배송상태조회
    @GetMapping("/list")
    public ResponseEntity<List<DeliveryEntity>> getDeliveryList(@RequestParam("userid") Integer mId) {
        try {
            log.info("마이페이지 배송조회 요청 회원 ID: {}", mId);

            // 핵심: 이미 서비스에 구현되어 있던 getDeliveryByMember 메서드를 그대로 재사용!
            List<DeliveryEntity> list = deliveryService.getDeliveryByMember(mId);

            return ResponseEntity.ok(list);
        } catch (Exception e) {
            log.error("배송 내역 조회 중 서버 에러 발생: ", e);
            return ResponseEntity.status(500).build();
        }
    }
}