package com.finalproject.canvas.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "buy")
public class BuyEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "b_id")
    private Integer bId;

    @CreationTimestamp
    @Column(name = "writedate")
    private LocalDateTime writedate;

    @Column(name = "status")
    private String status;
    @Column(name = "count")
    private Integer count;
    @Column(name = "discount")
    private Integer discount;
    @Column(name = "price")
    private String price;

    @Column(name = "m_id")
    private Integer mId;
    @Column(name = "p_id")
    private Integer pId;
    @Column(name = "cart_id")
    private Integer cartId;
    @Column(name = "d_id")
    private Integer dId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "d_id", insertable = false, updatable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private DeliveryEntity delivery;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "p_id", insertable = false, updatable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "files", "delFile"})
    private ProductEntity product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "m_id", insertable = false, updatable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private DataEntity member;

    @Enumerated(EnumType.STRING)
    @Column(name = "is_buy")
    private OutStatus isBuy = OutStatus.N;

    // 대호추가
    @Column(name = "cancel_reason")
    private String cancelReason; // 취소/반품 사유 (예: '단순 변심', '상품 파손' 등)

    @Column(name = "payment_method")
    private String paymentMethod = "신용카드"; // 환불/결제 수단

    @Column(name = "settle_status", nullable = false, columnDefinition = "VARCHAR(20) DEFAULT 'WAITING'")
    private String settleStatus = "WAITING";
}
