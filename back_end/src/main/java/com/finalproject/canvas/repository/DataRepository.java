package com.finalproject.canvas.repository;

import com.finalproject.canvas.entity.DataEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface DataRepository extends JpaRepository<DataEntity, Long>{
    Optional<DataEntity> findByUserId(String userId);
}
