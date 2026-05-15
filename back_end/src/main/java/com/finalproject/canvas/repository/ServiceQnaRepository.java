package com.finalproject.canvas.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/service")
@CrossOrigin(origins= "*")
public interface ServiceQnaRepository {
    @Autowired
    private ServiceRepository serviceRepository; // 자주 묻는 질문

    @Autowired
    private NoticeRepository noticeRepository;   // 공지사항

    @Autowired
    private InquiryRepository inquiryRepository; // 1:1 문의

    // 자주 묻는 질문 목록 가져오기
    @GetMapping("/qna")
    public List<ServiceQnaRepository> getQnaList() {
        return serviceRepository.findAllByOrderByWritedateDesc();
    }

    // 공지사항 목록 가져오기 (기존에 만들어두신 것)
    @GetMapping("/notice")
    public List<NoticeEntity> getNoticeList() {
        return noticeRepository.findAllByOrderByWritedateDesc();
    }
}
