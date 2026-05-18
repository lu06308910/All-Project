package com.finalproject.canvas.repository;

import com.finalproject.canvas.entity.CartEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartRepository extends JpaRepository<CartEntity, Integer> {
}
