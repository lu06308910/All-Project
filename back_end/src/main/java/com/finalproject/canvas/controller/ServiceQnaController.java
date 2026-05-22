package com.finalproject.canvas.controller;

import com.finalproject.canvas.entity.ServiceQnaEntity;
import com.finalproject.canvas.repository.ServiceQnaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/service")

public class ServiceQnaController {

    @Autowired
    private ServiceQnaRepository serviceQnaRepository;

    /**
     * 전체 목록 조회 (최신순)
     */
    @GetMapping("")
    public List<ServiceQnaEntity> getAllQna() {
        return serviceQnaRepository.findAllByOrderByWritedateDesc();
    }

    /**
     * 검색 조회
     */
    @GetMapping("/search")
    public List<ServiceQnaEntity> searchQna(@RequestParam("keyword") String keyword) {
        return serviceQnaRepository.findBySubjectContainingOrderByWritedateDesc(keyword);
    }


    /**
     * FAQ 등록 (저장)
     */
    @PostMapping("/write")
    public ServiceQnaEntity createQna(@RequestBody ServiceQnaEntity serviceQnaEntity) {
        // 이제 hit 체크 없이 바로 저장하면 됩니다!
        return serviceQnaRepository.save(serviceQnaEntity);
    }
}
