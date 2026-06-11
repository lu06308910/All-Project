package com.finalproject.canvas.repository;

import com.finalproject.canvas.entity.ServiceQnaEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceQnaRepository extends JpaRepository<ServiceQnaEntity, Integer> {
    /**
     * 전체 목록을 최신순으로 조회
     * writedate 기준 내림차순(Desc) 정렬 */
    List<ServiceQnaEntity> findAllByOrderByWritedateDesc();

    /**
     * 제목(subject)에 검색어가 포함된 데이터 조회
     * Containing 키워드를 사용하면 SQL의 LIKE %keyword% 효과가 납니다.
     */
    List<ServiceQnaEntity> findBySubjectContainingOrderByWritedateDesc(String keyword);

    /**
     * 카테고리별 필터링 (필요 시)
     * 특정 카테고리(예: 회원/정보관리) 데이터만 모아볼 때 사용합니다.
     */
    List<ServiceQnaEntity> findByCategoryOrderByWritedateDesc(String category);
}
