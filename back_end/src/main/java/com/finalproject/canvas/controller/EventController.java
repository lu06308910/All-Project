package com.finalproject.canvas.controller;

import com.finalproject.canvas.dto.EventRequestDto;
import com.finalproject.canvas.entity.EventEntity;
import com.finalproject.canvas.entity.FileEntity;
import com.finalproject.canvas.service.EventService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.util.List;

@CrossOrigin(origins="*")
@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/event")
public class EventController {
    private final EventService eventService;

    //게시글 등록
    @GetMapping("/all")
    public List<EventEntity> getMembers() {
        return eventService.getAllEvent();
    }

    // 진행 중인 이벤트만 (sale.jsx용)
    @GetMapping("/active")
    public List<EventEntity> getActiveEvents() {
        return eventService.getActiveEvents();
    }

    //게시글 단건 삭제
    @DeleteMapping("/delete/{eId}")
    public String deleteEvent(@PathVariable Integer eId) {
        try {
            eventService.deleteEvent(eId);
            return "OK";
        } catch (Exception e) {
            e.printStackTrace();
            return "FAIL";
        }
    }

    //게시글 삭제
    @DeleteMapping("/delete")
    public String deleteEvents(@RequestBody List<Integer> eIds) {
        try {
            eventService.deleteEvents(eIds);
            return "OK";
        } catch (Exception e) {
            e.printStackTrace();
            return "FAIL";
        }
    }
    //게시글 등록
    @PostMapping("/add")
    public String addEvent(@RequestBody EventEntity eventEntity) {
        try {
            eventService.addEvent(eventEntity);
            return "OK";
        } catch (Exception e) {
            e.printStackTrace();
            return "FAIL";
        }
    }
    // 게시글 수정
    @PutMapping("/update/{eId}")
    public String updateEvent(@PathVariable Integer eId, @RequestBody EventRequestDto dto) {
        try {
            eventService.updateEvent(eId, dto);
            return "OK";
        } catch (Exception e) {
            e.printStackTrace();
            return "FAIL";
        }
    }
}
