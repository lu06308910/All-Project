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


    @PostMapping("/toggle") // 기존 내용 마이페이지랑 병합 - 대호수정

    public ResponseEntity<?> toggleAction(@RequestBody Map<String, Object> body) {
        String userid = (String) body.get("userid");

        // memberId가 문자열로 오든 숫자로 오든 안전하게 꺼내기
        Object memberIdObj = body.get("memberId");
        Integer memberId = (memberIdObj != null) ? Integer.parseInt(memberIdObj.toString()) : null;

        String pidStr = String.valueOf(body.get("pid") != null ? body.get("pid") : body.get("productId"));
        Integer pid = Integer.parseInt(pidStr);

        log.info("토글 요청 - 사용자ID: {}, 회원번호: {}, 상품번호: {}", userid, memberId, pid);

        // 통합된 서비스 로직 호출 (기존에 잘 되던 서비스 메서드에 맞게 쓰시면 됩니다)
        boolean liked = likeService.toggleLike(memberId, pid);

        // 프론트엔드가 하트 불을 켤 수 있게 'liked' 상태를 맵에 담아 보냅니다!
        Map<String, Object> response = new HashMap<>();
        response.put("productId", pid);
        response.put("liked", liked); // true 또는 false가 들어감

        return ResponseEntity.ok(response);
    }

    // 유저가 좋아요한 상품 목록 가져오기
    @GetMapping("/list/{memberId}")
    public ResponseEntity<?> getLikedList(@PathVariable Integer memberId) {

        List<Integer> likedProductIds = likeService.getLikedProductIds(memberId);

        return ResponseEntity.ok(likedProductIds);
    }
}