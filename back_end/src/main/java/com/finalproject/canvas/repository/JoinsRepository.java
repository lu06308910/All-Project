package com.finalproject.canvas.repository;

import com.finalproject.canvas.entity.JoinsEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JoinsRepository extends JpaRepository<JoinsEntity, Integer> {
    // select userid, username from joins_entity where userid=? and userpwd=?
    // findByUseridAndUserpwd(userid, userpwd)
    public JoinsEntity findByUseridAndUserpwd(String userid, String userpwd);
    //회원1명선택하는 메소드
    //select*from joins_entity where userid=?
    public JoinsEntity findByUserid(String userid);

    List<JoinsEntity> findByUsername(String username);
}
