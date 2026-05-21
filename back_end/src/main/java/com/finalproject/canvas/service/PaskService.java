package com.finalproject.canvas.service;

import com.finalproject.canvas.entity.PaskEntity;
import com.finalproject.canvas.repository.PaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PaskService {
    private final PaskRepository paskRepository;

    public PaskEntity saveAsk(Integer mId,
                              Integer pId,
                              Integer cId,
                              String subject,
                              String context) {

        PaskEntity q = new PaskEntity();
        q.setMId(mId);
        q.setPId(pId);
        q.setCId(cId);
        q.setSubject(subject);
        q.setContext(context);
        q.setWritedate(LocalDateTime.now());

        return paskRepository.save(q);  // 저장 후 반환
    }

    // 특정 상품 문의 리스트 - 대호추가
    public List<PaskEntity> getQuestionList(Integer pId) {
        return paskRepository.findBypId(pId);
    }

    // 판매자 답변 등록 및 수정 로직 - 대호추가
    @Transactional
    public Optional<PaskEntity> updateSellerReply(Integer id, String replyContent) {
        return paskRepository.findById(id).map(ask -> {
            ask.setReply(replyContent); // 답변 내용 저장
            ask.setReplydate(LocalDateTime.now()); // 실시간 답변 날짜 주입
            return paskRepository.save(ask); // 반영 후 반환
        });
    }
}
