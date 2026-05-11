package com.finalproject.canvas.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class DataEntity {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    private String testMessage;
}



