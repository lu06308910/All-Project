package com.finalproject.canvas.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "paymententity")
@Getter
@Setter
public class PaymentEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String orderId;
    private String tid;

    private Integer userId;

    private String itemName;
    private int amount;

    private String status; // READY / PAID / CANCEL
}
