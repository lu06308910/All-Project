package com.finalproject.canvas.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name="service")
@Data
public class ServiceQnaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer s_id; // PK

    @Column(nullable = false)
    private Integer m_id; // 작성자(관리자) ID

    @Column(nullable = false, length = 50)
    private String category; // FAQ 구분 (회원/정보관리 등)

    @Column(nullable = false, length = 100)
    private String subject; // 제목

    @Column(nullable = false, columnDefinition = "longtext")
    private String context; // 내용 (답변)

    @CreationTimestamp
    @Column(name = "writedate", nullable = false, updatable = false)
    private LocalDateTime writedate; // 작성일
}
