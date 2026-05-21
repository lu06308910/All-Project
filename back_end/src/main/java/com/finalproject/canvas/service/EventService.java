package com.finalproject.canvas.service;

import com.finalproject.canvas.entity.EventEntity;
import com.finalproject.canvas.entity.OutStatus;
import com.finalproject.canvas.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {
    private final EventRepository eventRepository;

    public List<EventEntity> getAllEvent() {
        return eventRepository.findAll();
    }

    //이벤트 단일 삭제
    public void deleteEvent(Integer eId) {
        eventRepository.deleteById(eId);
    }

    //이벤트 대량 삭제
    public void deleteEvents(List<Integer> eIds) {
        eventRepository.deleteAllById(eIds);
    }
    //이벤트(게시글) 등록
    public void addEvent(EventEntity eventEntity) {
        LocalDateTime now = LocalDateTime.now();
        if (eventEntity.getUpdatedate() != null && eventEntity.getEnddate() != null) {
            if (!now.isBefore(eventEntity.getUpdatedate()) && !now.isAfter(eventEntity.getEnddate())) {
                eventEntity.setUpload(OutStatus.Y);
            }
        }
        eventRepository.save(eventEntity);
    }
    // 진행 중인 이벤트만 (sale.jsx용)
    public List<EventEntity> getActiveEvents() {
        return eventRepository.findActiveEvents(LocalDateTime.now());
    }
}
