package com.finalproject.canvas.controller;

import com.finalproject.canvas.entity.BuyEntity;
import com.finalproject.canvas.repository.BuyRepository;
import com.finalproject.canvas.service.BuyService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins="*")
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
}
