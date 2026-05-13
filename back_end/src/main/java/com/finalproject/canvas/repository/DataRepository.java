package com.finalproject.canvas.repository;

import com.finalproject.canvas.entity.DataEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DataRepository extends JpaRepository<DataEntity, Integer> {

    // 1. 로그인: 아이디와 비밀번호가 일치하는 데이터 한 건을 찾습니다.
    public DataEntity findByUseridAndUserpwd(String userid, String userpwd);

    // 2. 단일 조회: 아이디로 유저 한 명의 정보를 찾습니다.
    public DataEntity findByUserid(String userid);
}