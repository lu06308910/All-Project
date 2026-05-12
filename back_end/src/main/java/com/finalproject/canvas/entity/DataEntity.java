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

    @Column(name ="user_id", unique= true, nullable = false)
    private String userId;

    @Column(nullable = false, length = 18)
    private String password;
    @Column(nullable = false)
    private String userName;
    @Column(nullable = false)
    private String email;
    @Column(nullable = true)
    private String address;

    @Column(nullable = false)
    private String role;
    
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



