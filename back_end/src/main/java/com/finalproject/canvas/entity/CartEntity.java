package com.finalproject.canvas.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "cart")
public class CartEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cart_id")
    private Integer cartId;

    @Column(nullable = false)
    private Integer pay;
    @Column(nullable = false)
    private Integer discount;
    @Column(nullable = false, columnDefinition = "INT DEFAULT 1")
    private Integer count;
    @Column(nullable = false, columnDefinition = "INT DEFAULT 3000")
    private Integer newdelivery;

    @CreationTimestamp
    @Column(name = "writedate", nullable = false, updatable = false)
    private LocalDateTime writedate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "m_id", insertable = false, updatable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private DataEntity member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "p_id", insertable = false, updatable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private ProductEntity product;
}
