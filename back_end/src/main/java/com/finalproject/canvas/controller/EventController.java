package com.finalproject.canvas.controller;

import com.finalproject.canvas.entity.EventEntity;
import com.finalproject.canvas.service.EventService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin(origins="*")
@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/event")
public class EventController {
    private final EventService eventService;

    @GetMapping("/all")
    public List<EventEntity> getMembers() {
        return eventService.getAllEvent();
    }

}
