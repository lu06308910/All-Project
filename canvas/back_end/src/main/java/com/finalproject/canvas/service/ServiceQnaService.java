package com.finalproject.canvas.service;

import com.finalproject.canvas.entity.ServiceQnaEntity;
import com.finalproject.canvas.repository.ServiceQnaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ServiceQnaService {

    private final ServiceQnaRepository serviceQnaRepository;

    // 전체 조회 로직
    public List<ServiceQnaEntity> getQnaList() {
        return serviceQnaRepository.findAllByOrderByWritedateDesc();
    }

    // 검색 로직
    public List<ServiceQnaEntity> searchQna(String keyword) {
        return serviceQnaRepository.findBySubjectContainingOrderByWritedateDesc(keyword);
    }
}
