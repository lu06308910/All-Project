package com.finalproject.canvas.service;

import com.finalproject.canvas.entity.ReviewEntity;
import com.finalproject.canvas.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;

    public void saveReview(Integer mId, Integer pId, Integer star, String context, MultipartFile file) throws Exception {

        final  ReviewEntity review = new ReviewEntity();

        review.setMId(mId);
        review.setPId(pId);
        review.setStar(star);
        review.setContext(context);
        review.setWritedate(LocalDateTime.now());

        //  파일이 있을 경우 저장 처리
        if (file != null && !file.isEmpty()) {
            String uploadDir = "C:/upload/review/";
            File folder = new File(uploadDir);
            if (!folder.exists()) folder.mkdirs();

            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            String filePath = uploadDir + fileName;

            file.transferTo(new File(filePath));

            //  DB에는 리소스 경로만 저장 (React에서 불러올 경로)
            review.setImgUrl(fileName);
        }

        reviewRepository.save(review);
    }
    public List<ReviewEntity> getReviewList(Integer pId) {
        return reviewRepository.findBypId(pId);
    }
    // 모든상품 상품별 평균별점
    public Double getAverageStar(Integer pId) {
        return reviewRepository.getAverageStar(pId);
    }
}
