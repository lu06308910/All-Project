package com.finalproject.canvas.repository;

import com.finalproject.canvas.entity.PaskEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PaskRepository extends JpaRepository<PaskEntity, Integer> {
    List<PaskEntity> findBypId(Integer pId);

    // 마이페이지 기업용 고객 문의 관리 조회 전용 쿼리 - 대호추가
    @Query("SELECT ask FROM PaskEntity ask " +
            "JOIN FETCH ask.product p " +
            "JOIN FETCH p.company c " +
            "LEFT JOIN FETCH ask.member m " +
            "WHERE c.userid = :sellerId " +
            "ORDER BY ask.writedate DESC")
    List<PaskEntity> findInquiriesBySeller(@Param("sellerId") String sellerId);
}
