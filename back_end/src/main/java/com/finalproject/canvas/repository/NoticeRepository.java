package com.finalproject.canvas.repository;

import com.finalproject.canvas.entity.NoticeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NoticeRepository extends JpaRepository<NoticeEntity, Integer> {
    List<NoticeEntity> findBySubjectContaining(String keyword);
}
