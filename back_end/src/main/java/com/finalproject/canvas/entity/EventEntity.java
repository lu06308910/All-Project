package com.finalproject.canvas.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import com.finalproject.canvas.entity.OutStatus;
import java.time.LocalDateTime;

@Entity
@Table(name= "event")
@Data
public class EventEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer e_id;

    // 할인 상품 아이디 필요 ,이슬 추가
    @Column(name = "p_id", nullable = false)
    private Integer pId;

    @Column(nullable = false, length = 100)
    private String subject;

    @Column(nullable = false, columnDefinition = "longtext")
    private String context;

    @Column(nullable = false)
    private Integer hit = 0;

    @Column(name = "discount_percent")
    private Integer discountPercent;  // 예: 20 → 20% 할인


    @CreationTimestamp
    @Column(name = "writedate", nullable = false, updatable = false,
    columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime writedate;

    @Column(name = "enddate", nullable = true)
    private LocalDateTime enddate;

    @Column(name = "updatedate", nullable = true)
    private LocalDateTime updatedate;

    @Enumerated(EnumType.STRING)
    @Column(name = "upload")
    private OutStatus upload = OutStatus.N;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "p_id", insertable = false, updatable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "fileList", "files", "delFile"})
    private ProductEntity product;
}
