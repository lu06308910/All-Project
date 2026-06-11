package com.finalproject.canvas.service;

import com.finalproject.canvas.entity.NoticeEntity;
import com.finalproject.canvas.repository.NoticeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NoticeService {
    private final NoticeRepository noticeRepository;

    // 생성자 주입
    public NoticeService(NoticeRepository noticeRepository) {
        this.noticeRepository = noticeRepository;
    }

    // 모든 공지사항 리스트 가져오기
    public List<NoticeEntity> getAllNotices() {
        return noticeRepository.findAll();
    }

    // 공지사항 저장하기 (글쓰기용)
    public NoticeEntity saveNotice(NoticeEntity notice) {
        return noticeRepository.save(notice);
    }

    // 리스트 상세보기
    public NoticeEntity getNoticeById(Integer n_id) {
        return noticeRepository.findById(n_id)
                .map(notice -> {
                    notice.setHit(notice.getHit() + 1); // 조회수 1 증가
                    return noticeRepository.save(notice); // DB에 업데이트
                })
                .orElse(null);
    }

    // 검색 기능 추가
    public List<NoticeEntity> searchNotices(String keyword) {
        System.out.println("서비스단 검색어 확인: " + keyword);
        // 레포지토리에 새로 만든 최신순 정렬 검색 메서드를 호출합니다.
        return noticeRepository.findBySubjectContainingOrderByWritedateDesc(keyword);
    }
}
