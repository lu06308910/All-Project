package com.finalproject.canvas.controller;

import com.finalproject.canvas.service.LikeService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/like")
@Slf4j
public class LikeController {

    @Autowired
    private LikeService likeService;

    // 좋아요 토글
    /** @PostMapping("/toggle")
    public ResponseEntity<?> toggleLike(@RequestBody Map<String, Integer> body) {

        Integer memberId =  body.get("memberId");
        Integer productId = Integer.valueOf(body.get("productId").toString());

        boolean liked = likeService.toggleLike(memberId, productId);

        Map<String, Object> response = new HashMap<>();
        response.put("productId", productId);
        response.put("liked", liked);

        return ResponseEntity.ok(response);
    } */

    // 마이페이지 찜삭제 - 대호 추가(가영님이랑 확인필요)
    @PostMapping("/toggle")
    public ResponseEntity<?> toggleWishProduct(@RequestBody Map<String, Object> body) {
        // 리액트에서 보내주는 JSON body 데이터 추출
        Object pidObj = body.get("pid");
        String userid = (String) body.get("userid");

        log.info("찜 토글 요청 수신 - 사용자: {}, 상품 번호: {}", userid, pidObj);

        if (pidObj == null || userid == null) {
            return ResponseEntity.badRequest().body("필수 파라미터(pid, userid)가 누락되었습니다.");
        }

        // String이나 Integer 타입을 안전하게 변환
        Integer pid = Integer.parseInt(pidObj.toString());

        try {
            return ResponseEntity.ok("wish toggled successfully");

        } catch (Exception e) {
            log.error("찜 토글 처리 중 에러 발생: ", e);
            return ResponseEntity.internalServerError().body("서버 오류가 발생했습니다.");
        }
    }

    // 유저가 좋아요한 상품 목록 가져오기
    @GetMapping("/list/{memberId}")
    public ResponseEntity<?> getLikedList(@PathVariable Integer memberId) {

        List<Integer> likedProductIds = likeService.getLikedProductIds(memberId);

        return ResponseEntity.ok(likedProductIds);
    }
}