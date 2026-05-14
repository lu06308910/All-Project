package com.finalproject.canvas.controller;

import com.finalproject.canvas.service.LikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/like")
public class LikeController {

    @Autowired
    private LikeService likeService;

    // 좋아요 토글
    @PostMapping("/toggle")
    public ResponseEntity<?> toggleLike(@RequestBody Map<String, Integer> body) {

        Integer memberId =  body.get("memberId");
        Integer productId = Integer.valueOf(body.get("productId").toString());

        boolean liked = likeService.toggleLike(memberId, productId);

        Map<String, Object> response = new HashMap<>();
        response.put("productId", productId);
        response.put("liked", liked);

        return ResponseEntity.ok(response);
    }

    // 유저가 좋아요한 상품 목록 가져오기
    @GetMapping("/list/{memberId}")
    public ResponseEntity<?> getLikedList(@PathVariable Integer memberId) {

        List<Integer> likedProductIds = likeService.getLikedProductIds(memberId);

        return ResponseEntity.ok(likedProductIds);
    }
}