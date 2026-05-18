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
    @Column(nullable = false)
    private String n_tel;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "m_id", insertable = false, updatable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private DataEntity member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "p_id", insertable = false, updatable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private ProductEntity product;
}
