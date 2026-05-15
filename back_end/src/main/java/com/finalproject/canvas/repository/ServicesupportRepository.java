package com.finalproject.canvas.repository;

import com.finalproject.canvas.entity.ServicesupportEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServicesupportRepository extends JpaRepository<ServicesupportEntity, Integer> {
    // 작성자 이름을 기준으로 최신순 정렬해서 가져오기
    List<ServicesupportEntity> findByWriterOrderByWritedateDesc(String writer);
}
