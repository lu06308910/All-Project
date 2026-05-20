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

    @Enumerated(EnumType.STRING)
    @Column(name = "is_buy")
    private OutStatus isBuy = OutStatus.N;
}
