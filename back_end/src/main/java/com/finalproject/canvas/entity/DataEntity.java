package com.finalproject.canvas.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import com.finalproject.canvas.entity.OutStatus;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "member")
public class DataEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "m_id")
    private Integer mId;

    @Column(nullable = false, length = 15)
    private String userid;
    @Column(nullable = false, length = 255)
    private String userpwd;
    @Transient // 따로 컬럼이 생성되진 않음
    private String newPassword; // 비밀번호 수정을 위한 임시 보관함
    @Column(nullable = false, length = 10)
    private String username;
    @Column(nullable = false, length = 45)
    private String tel;
    @Column(nullable = false, length = 45)
    private String email;
    @Column(nullable = false, length = 20)
    private String zipcode;
    @Column(nullable = false, length = 300)
    private String address;
    @Column(name = "address_detail") // DB에는 _로 되어있지만 작업시에는 addressDetail로 설정
    private String addressDetail;

    @Column(nullable = false, length = 20)
    private String usertype = "PERSONAL";

    @CreationTimestamp
    @Column(name = "writedate", nullable = false, updatable = false)
    private LocalDateTime writedate;

    @Enumerated(EnumType.STRING)
    @Column(name = "is_out", nullable = false)
    private OutStatus isOut = OutStatus.N;

    public enum OutStatus {
        Y, N
    }
}



