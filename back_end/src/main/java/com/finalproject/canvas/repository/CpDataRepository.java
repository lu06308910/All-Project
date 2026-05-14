package com.finalproject.canvas.repository;

import com.finalproject.canvas.entity.CpDataEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

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
}