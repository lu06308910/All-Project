package com.finalproject.canvas.repository;

import com.finalproject.canvas.entity.CpDataEntity;
import com.finalproject.canvas.entity.DataEntity;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface DataRepository extends JpaRepository<DataEntity, Integer> {
    // select userid, username from joins_entity where userid=? anduserpwd=?
    // findByUseridAndUserpwd(userid, userpwd)
    public DataEntity findByUseridAndUserpwd(String userid, String userpwd);
    //회원1명선택하는 메소드
    //select*from joins_entity where userid=?
    public DataEntity findByUserid(String userid);

    List<DataEntity> findByUsername(String username);
}
