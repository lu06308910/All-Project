package com.finalproject.canvas.repository;

import com.finalproject.canvas.entity.PaskEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaskRepository extends JpaRepository<PaskEntity, Integer> {
    List<PaskEntity> findBypId(Integer pId);
}
