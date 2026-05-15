package com.finalproject.canvas.service;

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
        // 리포지토리에 이 이름의 메서드를 만들러 가야 합니다.
        return repository.findByWriterOrderByWritedateDesc(writer);
    }
    public List<ServicesupportEntity> getAllSupport() {
        return repository.findAll();
    }

}
