package com.finalproject.canvas.repository;

import com.finalproject.canvas.entity.CartEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CartRepository extends JpaRepository<CartEntity, Integer> {

    List<CartEntity> findBymId(Integer mId);

    @Query("SELECT c.mId FROM CartEntity c WHERE c.cartId = :cartId")
    Integer findMIdByCartId(@Param("cartId") Integer cartId);

    @Query("SELECT c.pId FROM CartEntity c WHERE c.cartId = :cartId")
    Integer findPIdByCartId(@Param("cartId") Integer cartId);

    // 여러 개의 ID를 한 번에 삭제하는 쿼리 메서드
    void deleteByCartIdIn(List<Integer> cartIds);
}
