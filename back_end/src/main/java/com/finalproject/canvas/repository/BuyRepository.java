package com.finalproject.canvas.repository;

import com.finalproject.canvas.entity.BuyEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BuyRepository extends JpaRepository<BuyEntity, Integer> {
    List<BuyEntity> findBymId(Integer mId);

    // 특정 회원의 취소/반품/교환 내역 조회 - 대호추가
    @Query("SELECT b FROM BuyEntity b WHERE b.mId = :mId AND b.status IN ('취소완료', '반품신청', '교환신청', '취소 완료', '반품 신청', '교환 신청')")
    List<BuyEntity> findCancelListByMember(@Param("mId") Integer mId);

    // 마이페이지 기업 판매현황조회 - 대호추가
    @Query("SELECT b FROM BuyEntity b " +
            "JOIN FETCH b.product p " +
            "JOIN FETCH p.company c " +
            "WHERE c.userid = :sellerId " +
            "ORDER BY b.writedate DESC")
    List<BuyEntity> findSalesBySeller(@Param("sellerId") String sellerId);

    List<BuyEntity> findByProduct_pId(Integer pId);
}
