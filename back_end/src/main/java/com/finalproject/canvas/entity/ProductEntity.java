package com.finalproject.canvas.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@Table(name="product")
@NoArgsConstructor
@AllArgsConstructor
public class ProductEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "p_id")
    private Integer pId;   // ← 필드명 CamelCase

    private String name;
    private String b_category;
    private String s_category;
    private String price;
    private String color;
    private Integer count = 0;
    private String size;
    private String img;
    private String context;

    // ───────── 파일 / 이미지 엔티티 관계 ─────────
    @OneToMany(
            mappedBy = "productEntity",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @JsonManagedReference
    private List<FileEntity> fileList = new ArrayList<>();


    // ───────── 업로드용 (DB 미저장) ─────────
    @Transient
    private List<MultipartFile> files;

    // 삭제할 파일 id 리스트
    @Transient
    private List<Integer> delFile;

    // ───────── 기업아이디 , 확인용 (DB 미저장) ─────────
    //@ManyToOne
    //@JoinColumn(name = "c_id", nullable = false)
    @Column(name = "c_id")
    private Integer cId;  // ← 숫자로 받아버림

}