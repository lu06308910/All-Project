package com.finalproject.canvas.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
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
    private Integer discount;
    @Column(nullable = false, columnDefinition = "INT DEFAULT 1")
    private Integer count;
    @Column(nullable = true)
    private String color;
    @Column(nullable = true)
    private String size;
    @Column(nullable = false) // 가격추가 이슬
    private Integer price;

    @Column(name = "m_id")
    @JsonProperty("mId") // 이슬추가
    private Integer mId;

    @Column(name = "p_id")
    @JsonProperty("pId") // 이슬추가
    private Integer pId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "p_id", insertable = false, updatable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private ProductEntity product;

    @CreationTimestamp
    @Column(name = "writedate", nullable = false, updatable = false,
            columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime writedate;
}
