package com.finalproject.canvas.controller;

import com.finalproject.canvas.entity.PaskEntity;
import com.finalproject.canvas.service.PaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/question")
@RequiredArgsConstructor
public class PaskController {

    private final PaskService paskService;

    // 문의 등록
    @PostMapping("/write")
    public ResponseEntity<?> writeAsk(
            @RequestParam Integer mId,
            @RequestParam Integer pId,
            @RequestParam Integer cId,
            @RequestParam String subject,
            @RequestParam String context
    ) {
        PaskEntity saved = paskService.saveAsk(mId, pId, cId, subject, context);
        return ResponseEntity.ok("ask saved");
    }

    // 특정 상품 문의 리스트
    @GetMapping("/list/{pId}")
    public ResponseEntity<?> getQuestionList(@PathVariable Integer pId) {
        return ResponseEntity.ok(
                paskService.getQuestionList(pId)
        );
    }
}
