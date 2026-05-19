package com.finalproject.canvas.repository;

import com.finalproject.canvas.entity.BuyEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BuyRepository extends JpaRepository<BuyEntity, Integer> {
        List<BuyEntity> findBymId(Integer mId);
        List<BuyEntity> findBypId(Integer pId);
}
