package com.finalproject.canvas.repository;

import com.finalproject.canvas.entity.CpDataEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CpDataRepository extends JpaRepository<CpDataEntity, Long> {
    CpDataEntity findByUseridAndUserpwd(String userid, String userpwd);
}