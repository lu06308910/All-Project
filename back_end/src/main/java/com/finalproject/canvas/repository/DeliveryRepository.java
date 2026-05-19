package com.finalproject.canvas.repository;

import com.finalproject.canvas.entity.DeliveryEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DeliveryRepository extends JpaRepository<DeliveryEntity, Integer> {

    List<DeliveryEntity> findBymId(Integer mId);
}