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

@CrossOrigin(origins = "*")
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
                String uploadDir = System.getProperty("user.dir") + "/src/main/resources/static/uploads/";
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
}
