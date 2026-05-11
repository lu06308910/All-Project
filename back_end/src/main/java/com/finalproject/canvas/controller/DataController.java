package com.finalproject.canvas.controller;

import com.finalproject.canvas.entity.DataEntity;
import com.finalproject.canvas.service.DataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/member")
public class DataController {

    @Autowired
    private DataService DataService;

    // 데이터 저장
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
        String userId = loginData.get("userId");
        String password = loginData.get("password");

        DataEntity user = DataService.login(userId, password);

        if (user != null) {
            // 로그인 성공 시 유저 정보를 리액트로 보내줌 (비밀번호는 빼고 보내는 게 좋지만 일단 진행)
            return ResponseEntity.ok(user);
        } else {
            // 실패 시 401(미승인) 에러와 메시지 전송
            return ResponseEntity.status(401).body("아이디 또는 비밀번호가 틀렸습니다.");
        }
    }
}
