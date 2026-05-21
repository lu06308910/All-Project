package com.finalproject.canvas.service;

import com.finalproject.canvas.entity.OutStatus;
import com.finalproject.canvas.entity.ServicesupportEntity;
import com.finalproject.canvas.repository.ServicesupportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ServicesupportService {
    private final ServicesupportRepository repository;

    @Transactional // 저장 중 오류 발생 시 롤백 처리
    public ServicesupportEntity insertSupport(ServicesupportEntity entity) {
        return repository.save(entity);
    }

    public List<ServicesupportEntity> mypage(String writer) {
        return repository.findByWriterOrderByWritedateDesc(writer);
    }
    public List<ServicesupportEntity> getAllSupport() {
        return repository.findAll();
    }

    public ServicesupportEntity getSupportById(Integer sId) {
        return repository.findById(sId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 문의 글입니다. ID: " + sId));
    }

    // 관리자가 입력한 답변을 세팅하고 답변 상태(answerOk)를 Y로 변경하는 기능
    @Transactional
    public void updateAdminReply(Integer sId, String answer) {
        // 1. 기존 문의 글을 DB에서 꺼내옴
        ServicesupportEntity support = repository.findById(sId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 문의 글입니다. ID: " + sId));

        // 2. 관리자가 보낸 답변 데이터 세팅
        support.setAnswer(answer);

        // 3. 답변 유무 상태 코드를 'Y' (완료) 상태로 변경
        support.setAnswerOk(OutStatus.Y);

        // 4. 기존 작성된 insertSupport 메서드를 재활용하거나 직접 save 처리하여 DB 업데이트 실행
        repository.save(support);
    }

}
