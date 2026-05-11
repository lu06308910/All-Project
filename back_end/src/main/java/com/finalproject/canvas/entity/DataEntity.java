package com.finalproject.canvas.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class DataEntity {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    @Column(unique= true, nullable = false)
    private String userId;

    private String password;
    private String userName;
    private String email;
}



