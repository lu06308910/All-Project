package com.finalproject.canvas.service;

import com.finalproject.canvas.entity.PaskEntity;
import com.finalproject.canvas.repository.PaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

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

    public List<PaskEntity> getQuestionList(Integer pId) {
        return paskRepository.findBypId(pId);
    }
}
