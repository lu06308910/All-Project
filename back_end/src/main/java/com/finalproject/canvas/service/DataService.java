package com.finalproject.canvas.service;

import com.finalproject.canvas.entity.CpDataEntity;
import com.finalproject.canvas.entity.DataEntity;
import com.finalproject.canvas.repository.CpDataRepository;
import com.finalproject.canvas.repository.DataRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DataService {

    private final DataRepository dataRepository;      // 일반회원
    private final CpDataRepository cpDataRepository;  // 기업회원

    // 일반 회원 회원가입
    public DataEntity dataInsert(DataEntity dataEntity) {
        try {
            return dataRepository.save(dataEntity);
        } catch (Exception se) {
            se.printStackTrace();
            return null;
        }
    }

    // 기업 회원 회원가입
    public CpDataEntity businessInsert(CpDataEntity cpEntity) {
        return cpDataRepository.save(cpEntity);
    }

    // 일반 회원 로그인
    public DataEntity loginPersonal(String userid, String userpwd) {
        return dataRepository.findByUseridAndUserpwd(userid, userpwd);
    }

    // 기업 회원 로그인
    public CpDataEntity loginBusiness(String userid, String userpwd) {
        return cpDataRepository.findByUseridAndUserpwd(userid, userpwd);
    }
    // 일반 회원 조회
    public DataEntity dataSelect(String userid) {
        return dataRepository.findByUserid(userid);
    }

    // 기업 회원 조회
    public CpDataEntity businessSelect(String userid) {
        return cpDataRepository.findByUserid(userid);
    }

    // 일반 회원 정보 수정
    @Transactional
    public DataEntity dataUpdate(DataEntity entity) {
        DataEntity orgEntity = dataRepository.findByUserid(entity.getUserid());

        // 1. 기존 비번(oldPassword)과 DB 비번이 일치하는지 확인
        if (orgEntity != null && entity.getUserpwd().equals(orgEntity.getUserpwd())) {

            // 2. 만약 새 비밀번호가 들어왔다면, 그걸로 교체!
            if (entity.getNewPassword() != null && !entity.getNewPassword().isEmpty()) {
                entity.setUserpwd(entity.getNewPassword());
            } else {
                // 새 비번을 안 적었다면 기존 비번 유지
                entity.setUserpwd(orgEntity.getUserpwd());
            }

            entity.setMId(orgEntity.getMId());
            return dataRepository.save(entity);
        }
        return null;
    }

    // 기업 회원 수정
    @Transactional
    public CpDataEntity businessUpdate(CpDataEntity entity) {
        CpDataEntity orgEntity = cpDataRepository.findByUserid(entity.getUserid());

        if (orgEntity != null && entity.getUserpwd().equals(orgEntity.getUserpwd())) {

            // 새 비밀번호가 넘어왔을 때만 교체하는 로직 추가
            if (entity.getNewPassword() != null && !entity.getNewPassword().isEmpty()) {
                entity.setUserpwd(entity.getNewPassword());
            } else {
                entity.setUserpwd(orgEntity.getUserpwd());
            }

            entity.setCId(orgEntity.getCId());
            return cpDataRepository.save(entity);
        }
        return null;
    }

    // 일반 회원 탈퇴
    public Integer unregister(Integer mId){
        try {
            DataEntity entity = dataRepository.findById(mId).orElse(null);
            if (entity == null) return 0;
            entity.setIsOut(DataEntity.OutStatus.Y);
            dataRepository.save(entity);
            return mId;
        }catch(Exception e){
            return 0;
        }
    }

    //모든 일반회원 정보 가져오기
    public List<DataEntity> getAllMembers(){
        return dataRepository.findAll();
    }
    //모든 기업회원 정보 가져오기
    public List<CpDataEntity> getAllCpMembers(){
        return cpDataRepository.findAll();
    }



}