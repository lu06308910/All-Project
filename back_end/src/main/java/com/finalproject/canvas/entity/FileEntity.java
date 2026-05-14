package com.finalproject.canvas.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name="FILE_ENTITY")
public class FileEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="FILE_ID")
    private Integer id;

    @Column(nullable = false,length = 200)
    private String filename;

    @Column(name = "color_name")
    private String colorName;

    @Column(nullable = false,length = 10)
    private String extname;

    @Column(nullable = false)
    private int size;

    // 프론트 보낼때 필요
    private String filePath;



    //원글 정보
    @ManyToOne
    @JoinColumn(name = "p_id")
    @JsonBackReference
    private ProductEntity productEntity;
}
