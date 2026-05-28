package com.finalproject.canvas.repository;

import com.finalproject.canvas.entity.CpDataEntity;
import com.finalproject.canvas.entity.EventEntity;
import com.finalproject.canvas.entity.OutStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface EventRepository extends JpaRepository<EventEntity, Integer> {

    @Query("SELECT e FROM EventEntity e WHERE e.e_id = :eid")
    public EventEntity findByEId(Integer eId);

    @Transactional
    void deleteByProduct_pId(Integer pId);

    @Query("SELECT e FROM EventEntity e WHERE e.updatedate <= :now AND e.enddate >= :now AND e.upload = com.finalproject.canvas.entity.OutStatus.Y")
    List<EventEntity> findActiveEventsByDate(@Param("now") LocalDateTime now);

    // 할인상품 리스트 불러오기 , 이슬추가
    @Query("SELECT e FROM EventEntity e JOIN FETCH e.product WHERE e.discountPercent > 0 AND e.upload = com.finalproject.canvas.entity.OutStatus.Y")
    List<EventEntity> findSaleProducts();

    // 제품 가격에 할인 가격 포함시키기 ,이슬 추가
    @Query("""
    SELECT e 
    FROM EventEntity e 
    WHERE e.pId = :pId 
    AND e.upload = com.finalproject.canvas.entity.OutStatus.Y
    ORDER BY e.updatedate DESC
    """)
    List<EventEntity> findActiveEvents(@Param("pId") Integer pId);

}