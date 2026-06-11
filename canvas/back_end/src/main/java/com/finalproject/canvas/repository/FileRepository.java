package com.finalproject.canvas.repository;

import com.finalproject.canvas.entity.FileEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FileRepository extends JpaRepository<FileEntity, Integer> {


    List<FileEntity> findByProductEntity_pId(Integer pId);

    List<FileEntity> findByIdIn(List<Integer> ids);

    int deleteByIdIn(List<Integer> ids);

}

