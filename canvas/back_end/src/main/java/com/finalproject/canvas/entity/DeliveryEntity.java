package com.finalproject.canvas.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "delivery")
public class DeliveryEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "d_id")
    private Integer dId;

    @Column(nullable = false)
    private String request;

    @Column(nullable = false, length = 20)
    private String n_zipcode;

    @Column(nullable = false, length = 300)
    private String n_address;

    @Column(name = "n_address_detail")
    private String n_addressDetail;

    @Column(name = "n_tel", nullable = false)
    private String n_tel;
    @Column(name = "n_name", nullable = false)
    private String n_name;

    @Column(name = "m_id")
    private Integer mId;

    @Column(name = "p_id")
    private Integer pId;

    // 대호 추가
    @Column(name = "tracking_no", length = 100)
    private String trackingNo; // 운송장 번호 (예: "1234-5678-9012")

    @Column(name = "status", length = 50, nullable = false)
    private String status = "배송 준비 중"; // 배송 상태 (기본값 설정)

    @Column(name = "delivery_date", length = 50)
    private String deliveryDate; // 화면 표시용 날짜 (예: "26.04.27")

    @Column(name = "delivery_status", length = 50)
    private String deliveryStatus; // 화면 표시용 요약 상태 (예: "도착(예정)")

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt; // 주문/배송 생성 일시 (상세보기 모달 결제일시용)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "m_id", insertable = false, updatable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private DataEntity member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "p_id", insertable = false, updatable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private ProductEntity product;
}