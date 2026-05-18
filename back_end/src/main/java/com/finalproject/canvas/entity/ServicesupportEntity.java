package com.finalproject.canvas.entity;


import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name="service_ask")
public class ServicesupportEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer s_id;       // 고유 번호 (PK)

    private String category;
    @Column(nullable = false)
    private String writer;
    @Column(nullable = false)
    private String subject;    // 제목

    @Column(nullable = false, columnDefinition = "TEXT")
    private String context;    // 문의 내용

    @Enumerated(EnumType.STRING)
    @Column(nullable = true, name = "answer_ok")
    private OutStatus answerOk = OutStatus.N;

    @Column(nullable = true, columnDefinition = "TEXT")
    private String answer;

    private String filename;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime writedate; // 작성일 자동 생성
//
//    @ManyToOne
//    @JoinColumn(name = "m_id", nullable = false)
//    private DataEntity member;
}