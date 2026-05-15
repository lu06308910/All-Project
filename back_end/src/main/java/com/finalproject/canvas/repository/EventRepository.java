package com.finalproject.canvas.repository;

import com.finalproject.canvas.entity.CpDataEntity;
import com.finalproject.canvas.entity.EventEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

public interface EventRepository extends JpaRepository<EventEntity, Integer> {

    @Query("SELECT e FROM EventEntity e WHERE e.e_id = :eid")
    public EventEntity findByEId(Integer eId);

    @Transactional
    void deleteByProduct_pId(Integer pId);
}
