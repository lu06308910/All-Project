package com.finalproject.canvas.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "likes")
public class LikeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "m_id")
    private Integer mId;
    @Column(name = "p_id")
    private Integer pId;

    private LocalDateTime writedate;


}
