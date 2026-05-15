package com.finalproject.canvas.entity;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;


import java.time.LocalDateTime;

@Entity
@Data
@Table(name="p_ask")
public class PaskEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "m_id")
    private Integer mId;

    @Column(name = "p_id")
    private Integer pId;

    @Column(name = "c_id")
    private Integer cId;

    private String subject;
    private String context;
    private LocalDateTime writedate;

    // member 조인
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "m_id", insertable = false, updatable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private DataEntity member;

}
