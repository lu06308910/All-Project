package com.finalproject.canvas.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Data
public class CpDataEntity {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;

    @Column(name ="userid", unique= true, nullable = false)
    private String userid;

    @Column(nullable = false, length = 18)
    private String userpwd;
    @Column(nullable = false)
    private String businessName;
//    @Column(nullable = false)
//    private String ownerName;
    @Column(nullable = false)
    private String businessNum; //texId가 구별은 더 나을 것 같은데 프론트에 맞추려고 일단 주석처리
    @Column(nullable = false)
    private String email;
    @Column(nullable = false)
    private String tel;
    @Column(nullable = false, length=20)
    private String zipcode;
    @Column(nullable = true, length=300)
    private String address;
    @Column(nullable = true, length=300)
    private String address_detail;

    @Column(nullable = false,columnDefinition = "varchar(20) default 'BUSINESS'")
    private String usertype = "BUSINESS";

    //탈퇴여부 확인
    public enum OutStatus {
        Y, N
    }
    @Enumerated(EnumType.STRING)
    @Column(name = "is_out", nullable = true, columnDefinition = "CHAR(1) DEFAULT 'N'")
    private OutStatus isOut = OutStatus.N;

    @CreationTimestamp
    @Column(columnDefinition = "DATETIME default now()")
    private String writedate;

}