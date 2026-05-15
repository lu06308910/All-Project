package com.finalproject.canvas.controller;

import com.finalproject.canvas.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/review")
@RequiredArgsConstructor
@CrossOrigin
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping("/write")
    public ResponseEntity<?> writeReview(
            @RequestParam Integer mId,
            @RequestParam Integer pId,
            @RequestParam Integer star,
            @RequestParam String context,
            @RequestParam(required = false) MultipartFile file
    ) throws Exception {

        reviewService.saveReview(mId, pId, star, context, file);

        return ResponseEntity.ok("review saved");
    }

    //  리뷰 리스트 추가
    @GetMapping("/list/{pId}")
    public ResponseEntity<?> getReviewList(@PathVariable Integer pId) {

        return ResponseEntity.ok(
                reviewService.getReviewList(pId)
        );
    }
}
