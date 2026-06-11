package com.finalproject.canvas.repository;

import com.finalproject.canvas.entity.CartEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface CartRepository extends JpaRepository<CartEntity, Integer> {

    List<CartEntity> findBymId(Integer mId);

    @Query("SELECT c.mId FROM CartEntity c WHERE c.cartId = :cartId")
    Integer findMIdByCartId(@Param("cartId") Integer cartId);

    @Query("SELECT c.pId FROM CartEntity c WHERE c.cartId = :cartId")
    Integer findPIdByCartId(@Param("cartId") Integer cartId);

    // 여러 개의 ID를 한 번에 삭제하는 쿼리 메서드
    void deleteByCartIdIn(List<Integer> cartIds);

    // 장바구니 옵션변경시 해당 카트아이디 선택
    Optional<CartEntity> findById(Integer cartId);

    //프로덕트 삭제 시 같이 삭제
    @Transactional
    void deleteBypId(Integer pId);

    // 상세페이지에서 바로 구매하기 , 이슬추가
    @Query("select c from CartEntity c join fetch c.product p left join fetch p.fileList where c.cartId in :ids")
    List<CartEntity> findByCartIdIn(@Param("ids") List<Integer> ids);
}
