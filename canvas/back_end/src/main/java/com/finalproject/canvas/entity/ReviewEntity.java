package com.finalproject.canvas.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name="review")
public class ReviewEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "re_id")
    private Integer reId;

    @Column(name = "m_id")
    private Integer mId;

    @Column(name = "p_id")
    private Integer pId;

    private String context;
    private Integer star;

    @Column(length = 255)
    private String imgUrl; // 리뷰 이미지

    private LocalDateTime writedate;

    // member 조인
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "m_id", insertable = false, updatable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private DataEntity member;

}
