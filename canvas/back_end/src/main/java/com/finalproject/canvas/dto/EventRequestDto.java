package com.finalproject.canvas.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class EventRequestDto {
    private String subject;
    private String context;
    private LocalDateTime updatedate;
    private LocalDateTime enddate;
    private Integer p_id;  // 프론트에서 p_id: Number(...) 로 넘어오는 값
}
