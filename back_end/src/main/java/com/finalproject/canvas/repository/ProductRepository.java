package com.finalproject.canvas.repository;

import com.finalproject.canvas.entity.CpDataEntity;
import com.finalproject.canvas.entity.ProductEntity;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<ProductEntity, Integer> {

    // 전체 상품 수
    int countBy();

    // 상품명 검색 (name LIKE %searchWord%)
    int countByNameContaining(String searchWord);

    // 상세설명 검색 (context LIKE %searchWord%)
    int countByContextContaining(String searchWord);

    // 상세설명 검색 + 최신순 정렬
    List<ProductEntity> findByContextContainingOrderByPIdDesc(String searchWord, PageRequest pageRequest);

    // 상품명 검색 + 최신순 정렬
    List<ProductEntity> findByNameContainingOrderByPIdDesc(String search, PageRequest page);

    // 모든 상품리스트
    @Query("select p from ProductEntity p join fetch p.fileList")
    Page<ProductEntity> findAllWithFiles(Pageable pageable);

    // 상품 수정
    @Modifying
    @Transactional
    @Query("update ProductEntity p set p.name = :name, p.context = :context, p.price = :price where p.pId = :id")
    int updateProduct(
            @Param("id") int id,
            @Param("name") String name,
            @Param("context") String context,
            @Param("price") String price
    );
    //상품명으로 검색
    List<ProductEntity> findByNameContaining(String name);
    //기업명으로 검색
    List<ProductEntity> findByCompany_BusinessNameContaining(String businessName);

    // 마이페이지 찜 쿼리문 - 대호추가
    @Query(value = "SELECT p.* FROM product p " +
            "JOIN likes l ON p.p_id = l.p_id " +
            "JOIN member m ON l.m_id = m.m_id " +
            "WHERE m.userid = :userid", nativeQuery = true)
    List<ProductEntity> findWishListByUserId(@Param("userid") String userid);

    @Query("SELECT p FROM ProductEntity p WHERE p.sCategory LIKE CONCAT('%', :sCategory, '%')")
    List<ProductEntity> findBysCategory(String sCategory); // 카테고리별 페이지
}