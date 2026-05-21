package com.finalproject.canvas.repository;

import com.finalproject.canvas.entity.CpDataEntity;
import com.finalproject.canvas.entity.EventEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

public interface EventRepository extends JpaRepository<EventEntity, Integer> {

    @Query("SELECT e FROM EventEntity e WHERE e.e_id = :eid")
    public EventEntity findByEId(Integer eId);

    @Transactional
    void deleteByProduct_pId(Integer pId);

    @Query("SELECT e FROM EventEntity e WHERE e.updatedate <= :now AND e.enddate >= :now")
    List<EventEntity> findActiveEvents(@Param("now") LocalDateTime now);
}
