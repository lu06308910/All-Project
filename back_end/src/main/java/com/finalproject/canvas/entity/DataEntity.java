package com.finalproject.canvas.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Data
public class DataEntity {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @Column(name ="userid", unique= true, length=20, nullable = false)
    private String userid;

    @Column(nullable = false, length = 20)
    private String userpwd;
    @Column(nullable = false, length=20)
    private String username;
    @Column(nullable = false, length=45)
    private String email;
    @Column(nullable = false, length=20)
    private String tel;
    @Column(nullable = false, length=20)
    private String zipcode;
    @Column(nullable = true, length=300)
    private String address;
    @Column(nullable = true, length=300)
    private String address_detail;

    @Column(nullable = false,columnDefinition = "varchar(20) default 'PERSONAL'")
    private String usertype = "PERSONAL";
    
    //탈퇴여부 확인
    public enum OutStatus {
        Y, N
    }
    @Enumerated(EnumType.STRING)
    @Column(name = "is_out", nullable = true, columnDefinition = "CHAR(1) DEFAULT 'N'")
    private CpDataEntity.OutStatus isOut = CpDataEntity.OutStatus.N;

    @CreationTimestamp
    @Column(columnDefinition = "DATETIME default now()")
    private String writedate;
}



