package com.finalproject.canvas.repository;

import com.finalproject.canvas.entity.PaymentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentRepository extends JpaRepository<PaymentEntity, Long> {

    /**
     * 주문번호(orderId)로 결제 정보 조회
     * - approve 단계에서 사용
     */
    Optional<PaymentEntity> findByOrderId(String orderId);
}
