package com.finalproject.canvas.service;

import com.finalproject.canvas.dto.EventRequestDto;
import com.finalproject.canvas.entity.EventEntity;
import com.finalproject.canvas.entity.OutStatus;
import com.finalproject.canvas.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

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
    public void addEvent(EventRequestDto dto) {
        EventEntity eventEntity = new EventEntity();
        eventEntity.setSubject(dto.getSubject());
        eventEntity.setContext(dto.getContext());
        eventEntity.setUpdatedate(dto.getUpdatedate());
        eventEntity.setEnddate(dto.getEnddate());
        eventEntity.setPId(dto.getP_id());

        LocalDateTime now = LocalDateTime.now();
        if (dto.getUpdatedate() != null && dto.getEnddate() != null) {
            if (!now.isBefore(dto.getUpdatedate()) && !now.isAfter(dto.getEnddate())) {
                eventEntity.setUpload(OutStatus.Y);
            }
        }
        eventRepository.save(eventEntity);
    }
    // 진행 중인 이벤트만 (sale.jsx용)
    public List<EventEntity> getActiveEvents() {
        return eventRepository.findActiveEventsByDate(LocalDateTime.now());
    }
    // 이벤트 수정
    public void updateEvent(Integer eId, EventRequestDto dto) {
        EventEntity event = eventRepository.findById(eId)
                .orElseThrow(() -> new RuntimeException("이벤트를 찾을 수 없습니다: " + eId));

        event.setSubject(dto.getSubject());
        event.setContext(dto.getContext());
        event.setUpdatedate(dto.getUpdatedate());
        event.setEnddate(dto.getEnddate());

        // upload 상태 재계산
        LocalDateTime now = LocalDateTime.now();
        if (dto.getUpdatedate() != null && dto.getEnddate() != null) {
            if (!now.isBefore(dto.getUpdatedate()) && !now.isAfter(dto.getEnddate())) {
                event.setUpload(OutStatus.Y);
            } else {
                event.setUpload(OutStatus.N);
            }
        } else {
            event.setUpload(OutStatus.N);
        }

        eventRepository.save(event);
    }

    // 할인 상품 가져오기 , 이슬추가
    public List<EventEntity> getSaleProducts() {
        return eventRepository.findSaleProducts();

    }

}