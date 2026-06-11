package com.finalproject.canvas.controller;

import com.finalproject.canvas.entity.ServicesupportEntity;
import com.finalproject.canvas.repository.ServicesupportRepository;
import com.finalproject.canvas.service.ServicesupportService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.List;
import java.util.UUID;

@CrossOrigin(origins="*")
@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/support")
public class ServicesupportController {
    private final ServicesupportService servicesupportService;

    @PostMapping("/write")
    public ResponseEntity<?> writeSupport(
            @ModelAttribute ServicesupportEntity entity, // 폼 데이터를 객체로 매핑
            @RequestParam(value = "file", required = false) MultipartFile file // 파일 받기
    ) {
        try {
            if (file != null && !file.isEmpty()) {
                // 1. 파일 저장 경로 설정 (프로젝트 내 특정 폴더)
                String uploadDir = "C:/upload/";
                File dir = new File(uploadDir);
                if (!dir.exists()) dir.mkdirs();

                // 2. 파일명 중복 방지 (UUID 사용)
                String originalFilename = file.getOriginalFilename();
                String savedFilename = UUID.randomUUID().toString() + "_" + originalFilename;

                // 3. 파일 물리적 저장
                file.transferTo(new File(uploadDir + savedFilename));

                // 4. 엔티티에 저장된 파일명 세팅
                entity.setFilename(savedFilename);
            }

            servicesupportService.insertSupport(entity);
            return ResponseEntity.ok("success");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/list")
    public ResponseEntity<List<ServicesupportEntity>> getMyInquiries(@RequestParam("writer") String writer) {
        List<ServicesupportEntity> list = servicesupportService.mypage(writer);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/list/all")
    public ResponseEntity<List<ServicesupportEntity>> getAllInquiries() {
        return ResponseEntity.ok(servicesupportService.getAllSupport());
    }
    // 관리자 페이지 수정
    @PostMapping("/reply")
    public ResponseEntity<?> registerAdminReply(
            @RequestParam("s_id") Integer sId,       // 리액트 FormData에서 보낸 s_id
            @RequestParam("answer") String answer    // 리액트 FormData에서 보낸 answer
    ) {
        try {
            // 서비스단이나 리포지토리를 통해 해당 문의글 조회
            // (Service단에 구현해 둔 게 없다면 컨트롤러에서 레포지토리 주입받거나, 서비스에 메서드 추가)
            ServicesupportEntity support = servicesupportService.getSupportById(sId);

            if (support == null) {
                return ResponseEntity.status(404).body("해당 문의 내역을 찾을 수 없습니다.");
            }

            // 관리자 답변(answer) 주입 및 답변 완료 상태(Y) 업데이트
            support.setAnswer(answer);
            support.setAnswerOk(com.finalproject.canvas.entity.OutStatus.Y); // Enum 타입 매핑

            // 3. DB에 업데이트 반영
            servicesupportService.insertSupport(support); // 기존 save/insert 메서드 재활용

            return ResponseEntity.ok("success");
        } catch (Exception e) {
            log.error("답변 등록 중 서버 에러 발생: ", e);
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
}