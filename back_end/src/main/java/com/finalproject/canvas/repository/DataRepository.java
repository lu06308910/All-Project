package com.finalproject.canvas.repository;

import com.finalproject.canvas.entity.DataEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

public interface DataRepository extends JpaRepository<DataEntity, Long>{
}
