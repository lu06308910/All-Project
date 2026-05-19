package com.finalproject.canvas.controller;

import com.finalproject.canvas.service.BuyService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins="*")
@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/buy")
public class BuyController {

    private final BuyService buyService;  // final 추가!

    @PostMapping("/add")
    public void addBuy(@RequestBody Map<String, Object> payload) {
        buyService.addFromCart(payload);
    }
}
