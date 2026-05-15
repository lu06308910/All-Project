package com.finalproject.canvas.repository;

import com.finalproject.canvas.entity.ReviewEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<ReviewEntity, Integer> {
    List<ReviewEntity> findBypId(Integer pId);
}
