package com.finalproject.canvas.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name="company")
public class CpDataEntity {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Column(name = "c_id")
    private Integer cId;

    @Column(nullable = false, length =15)
    private String userid;
    @Column(nullable = false, length = 20)
    private String userpwd;
    @Transient // 따로 컬럼이 생성되진 않음
    private String newPassword; // 비밀번호 수정을 위한 임시 보관함
    @Column(name = "businessName", nullable = false, length =10)
    private String businessName;
    @Column(name ="businessNum", nullable = false, length=20)
    private String businessNum;
    @Column(nullable = false, length =45)
    private String tel;
    @Column(nullable = false, length = 45)
    private String email;
    @Column(nullable = false, length=20)
    private String zipcode;
    @Column (nullable = false, length=300)
    private String address;
    @Column(name = "address_detail")
    private String addressDetail;
    @Column(nullable = false, length=300)
    private String usertype ="BUSINESS";

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime writedate;

    // 탈퇴 여부 : Y(탈퇴), N(정상)
    @Enumerated(EnumType.STRING)
    @Column(name = "is_out")
    private OutStatus isOut = OutStatus.N;

    public enum OutStatus{
        Y, N
    }
}