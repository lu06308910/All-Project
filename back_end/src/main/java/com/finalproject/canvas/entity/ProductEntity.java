package com.finalproject.canvas.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
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
    private Integer pId;

    // --- 회사 FK ---
    @ManyToOne
    @JoinColumn(name = "c_id", nullable = false)
    private CpDataEntity company;

    private String name;
    private String b_category;

    @Column(name = "s_category")
    private String sCategory;

    private String price;
    private String color;
    private Integer count = 0;
    private String size;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime writedate;

    @Column(columnDefinition = "LONGTEXT")
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
}