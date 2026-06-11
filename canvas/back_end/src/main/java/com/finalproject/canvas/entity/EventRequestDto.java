package com.finalproject.canvas.entity;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class EventRequestDto {
    private String subject;
    private String context;
    private LocalDateTime updatedate;
    private LocalDateTime enddate;
    private Integer p_id;
    private Integer discountPercent = 0;  // 할인율 추가
}
