package com.finalproject.canvas.repository;

import com.finalproject.canvas.entity.ReviewEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReviewRepository extends JpaRepository<ReviewEntity, Integer> {
    List<ReviewEntity> findBypId(Integer pId);

    // 평균 별점
    @Query("SELECT COALESCE(AVG(r.star), 0) FROM ReviewEntity r WHERE r.pId = :pId")
    Double getAverageStar(@Param("pId") Integer pId);
}
