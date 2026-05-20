package com.finalproject.canvas.entity;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;


import java.time.LocalDateTime;

@Entity
@Data
@Table(name="p_ask")
public class PaskEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "m_id")
    private Integer mId;

    @Column(name = "p_id")
    private Integer pId;

    @Column(name = "c_id")
    private Integer cId;

    private String subject;

    @Column(length = 1000)
    private String context;

    private LocalDateTime writedate;

    // 판매자가 달아줄 답변 - 대호추가
    @Column(length = 1000)
    private String reply;

    // member 조인
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "m_id", insertable = false, updatable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private DataEntity member;

    // 어느 상품의 문의인지 추적하기 위한 상품 조인 설정
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "p_id", insertable = false, updatable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "fileList", "files", "delFile"})
    private ProductEntity product;

}
