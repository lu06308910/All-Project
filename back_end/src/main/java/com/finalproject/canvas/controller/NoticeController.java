package com.finalproject.canvas.controller;

import com.finalproject.canvas.entity.NoticeEntity;
import com.finalproject.canvas.repository.NoticeRepository;
import com.finalproject.canvas.service.NoticeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notice")
@CrossOrigin(origins = "*")
public class NoticeController {

    private final NoticeService noticeService;

    public NoticeController(NoticeService noticeService) {
        this.noticeService = noticeService;
    }

    // 리스트 불러오기 (GET)
    @GetMapping("/list")
    public List<NoticeEntity> getList() {
        System.out.println("리스트 요청 들어옴!");
        return noticeService.getAllNotices();
    }

    // 글 등록하기 (POST)
    @PostMapping("/write")
    public NoticeEntity write(@RequestBody NoticeEntity notice) {
        return noticeService.saveNotice(notice);
    }

    // 공지사항 상세 보기
    @GetMapping("/view/{n_id}")
    public NoticeEntity getNotice(@PathVariable Integer n_id) {
        System.out.println("요청받은 n_id: " + n_id);
        return noticeService.getNoticeById(n_id);
    }
}
