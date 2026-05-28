package com.finalproject.canvas.repository;

import com.finalproject.canvas.entity.BuyEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BuyRepository extends JpaRepository<BuyEntity, Integer> {

    @Query("SELECT b FROM BuyEntity b " +
            "JOIN FETCH b.product p " +
            "LEFT JOIN FETCH p.fileList " + // 여기가 중요! p_fileList가 ProductEntity의 필드명과 일치해야 함
            "WHERE b.mId = :mId")
    List<BuyEntity> findBymId(@Param("mId") Integer mId);


    // 특정 회원의 취소/반품/교환 내역 조회 - 대호추가
    @Query("SELECT b FROM BuyEntity b WHERE b.mId = :mId AND b.status IN ('주문취소', '반품완료', '교환완료')")
    List<BuyEntity> findCancelListByMember(@Param("mId") Integer mId);

    // 마이페이지 기업 판매현황조회 - 대호추가
    @Query("SELECT b FROM BuyEntity b " +
            "JOIN FETCH b.product p " +
            "JOIN FETCH p.company c " +
            "WHERE c.userid = :sellerId " +
            "ORDER BY b.writedate DESC")
    List<BuyEntity> findSalesBySeller(@Param("sellerId") String sellerId);

    List<BuyEntity> findByProduct_pId(Integer pId);

    /**
     * orderId로 주문 조회 (결제 후 매칭용)
     */
    @Query("SELECT b FROM BuyEntity b WHERE b.orderId = :orderId")
    BuyEntity findByOrderId(@Param("orderId") String orderId);

    /**
     * orderId 기준 상태 업데이트 (선택 - 빠른 방식)
     */
    @Modifying
    @Query("UPDATE BuyEntity b SET b.status = :status WHERE b.orderId = :orderId")
    void updateStatusByOrderId(@Param("orderId") String orderId,
                               @Param("status") String status);


}
