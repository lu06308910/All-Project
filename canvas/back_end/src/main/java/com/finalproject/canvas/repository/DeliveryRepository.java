package com.finalproject.canvas.repository;

import com.finalproject.canvas.entity.DeliveryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface DeliveryRepository extends JpaRepository<DeliveryEntity, Integer> {

    List<DeliveryEntity> findBymId(Integer mId);

    //프로덕트 삭제 시 딜리버리도 삭제
    @Transactional
    List<DeliveryEntity> findBypId(Integer pId);
    @Transactional
    void deleteBypId(Integer pId);
}