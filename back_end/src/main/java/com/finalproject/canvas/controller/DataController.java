package com.finalproject.canvas.controller;

import com.finalproject.canvas.entity.CpDataEntity;
import com.finalproject.canvas.entity.DataEntity;
import com.finalproject.canvas.service.DataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/member")
@CrossOrigin(origins = "http://localhost:5173") // 리엑트 주소 허용한다는 메소드
public class DataController {

    @Autowired
    private DataService DataService;

    @Autowired
    private CpDataEntity CpDataEntity;

    // 데이터 저장
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
        System.out.println("========================================");
        System.out.println("[백엔드 호출] /api/member/login");
        System.out.println("프론트가 보낸 ID: " + loginData.get("userId"));
        System.out.println("프론트가 보낸 PW: " + loginData.get("password"));
        System.out.println("========================================");
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
