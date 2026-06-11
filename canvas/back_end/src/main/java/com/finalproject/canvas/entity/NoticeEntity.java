package com.finalproject.canvas.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name= "notice")
@Data
public class NoticeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer n_id;

    @Column(nullable = false, length = 100)
    private String subject;

    @Column(nullable = false, columnDefinition = "longtext")
    private String context;

    @Column(nullable = false)
    private Integer hit = 0;

    @CreationTimestamp
    @Column(name = "writedate", nullable = false, updatable = false)
    private LocalDateTime writedate;
}
