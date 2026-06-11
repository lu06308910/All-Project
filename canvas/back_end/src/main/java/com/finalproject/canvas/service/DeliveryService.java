package com.finalproject.canvas.service;

import com.finalproject.canvas.entity.DeliveryEntity;
import com.finalproject.canvas.repository.DeliveryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DeliveryService {
    private final DeliveryRepository deliveryRepository;

    // 단건 저장
    public DeliveryEntity addDelivery(DeliveryEntity delivery) {
        return deliveryRepository.save(delivery);
    }

    // 여러 건 저장 (상품 수만큼)
    public List<DeliveryEntity> addAllDelivery(List<DeliveryEntity> deliveries) {
        return deliveryRepository.saveAll(deliveries);
    }

    // 특정 회원 배송지 목록 조회
    public List<DeliveryEntity> getDeliveryByMember(Integer mId) {
        return deliveryRepository.findBymId(mId);
    }

    // 전체 배송지 조회 (관리자용)
    public List<DeliveryEntity> getAllDelivery() {
        return deliveryRepository.findAll();
    }
}