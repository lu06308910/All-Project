package com.finalproject.canvas.repository;

import com.finalproject.canvas.entity.CpDataEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CpDataRepository extends JpaRepository<CpDataEntity, Integer> {

    public CpDataEntity findByUseridAndUserpwd(String userid, String userpwd);

    public CpDataEntity findByUserid(String userid);

    //아이디로 검색
    List<CpDataEntity> findByUseridContaining(String userid);
    //이름으로 검색
    List<CpDataEntity> findByBusinessNameContaining(String businessName);
    //이메일로 검색
    List<CpDataEntity> findByEmailContaining(String email);
    //전화번호로 검색
    List<CpDataEntity> findByTelContaining(String tel);

    // 상호명과 이메일로 기업 회원 찾기 (아이디 찾기용)
    Optional<CpDataEntity> findByBusinessNameAndEmail(String businessName, String email);

    // 아이디와 이메일로 기업 회원 찾기 (비밀번호 찾기용)
    Optional<CpDataEntity> findByUseridAndEmail(String userid, String email);
}