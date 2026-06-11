package com.finalproject.canvas.repository;

import com.finalproject.canvas.entity.LikeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface LikeRepository extends JpaRepository<LikeEntity, Integer> {

    // 특정 유저 + 상품 좋아요 여부 확인
    @Query("SELECT l FROM LikeEntity l WHERE l.mId = :mId AND l.pId = :pId")
    LikeEntity findLike(@Param("mId") Integer mId,
                        @Param("pId") Integer pId);

    // 특정 유저가 좋아요한 전체 목록
    List<LikeEntity> findBymId(Integer mId);
}