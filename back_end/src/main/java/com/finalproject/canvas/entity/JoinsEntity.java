package com.finalproject.canvas.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name="JOINS_ENTITY") // 테이블명을 지정:생략해도 됨

public class JoinsEntity {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Column(name="JOINS_ID", nullable=false)
    private Integer id; //number

    @Column(name="USERID", nullable=false, length=20, unique=true)
    private String userid;
    @Column(nullable=false, length=20)
    private String userpwd;
    @Column(nullable=false, length=20)
    private String username;
    @Column(nullable=false, length=45)
    private String email;
    @Column(nullable=false, length=500)
    private String addr;



    @UpdateTimestamp
    @Column(columnDefinition = "DATETIME default now()")
    private String writedate;
}
