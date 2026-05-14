package com.finalproject.canvas.service;

import com.finalproject.canvas.entity.CpDataEntity;
import com.finalproject.canvas.entity.DataEntity;
import com.finalproject.canvas.entity.SearchVO;
import com.finalproject.canvas.repository.CpDataRepository;
import com.finalproject.canvas.repository.DataRepository;
import lombok.Data;
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
        // DB에서 기존 정보를 가져옴
        DataEntity orgEntity = dataRepository.findByUserid(entity.getUserid());

        if (orgEntity != null && entity.getUserpwd().equals(orgEntity.getUserpwd())) {
            // 비밀번호가 일치하면 업데이트 수행
            entity.setMId(orgEntity.getMId()); // 기존의 PK를 세팅해줌
            return dataRepository.save(entity);
        } else {
            // 3. 비밀번호 불일치 혹은 회원이 없음
            return null;
        }
    }

    // 기업 회원 수정
    @Transactional
    public CpDataEntity businessUpdate(CpDataEntity entity) {
        // DB에서 기존 기업 정보 가져옴
        CpDataEntity orgEntity = cpDataRepository.findByUserid(entity.getUserid());

        if (orgEntity != null && entity.getUserpwd().equals(orgEntity.getUserpwd())) {
            // 비밀번호 일치 시 업데이트
            entity.setCId(orgEntity.getCId()); // 기존 기업 PK(c_id) 세팅
            return cpDataRepository.save(entity);
        } else {
            return null;
        }
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
    
    //일반회원 검색
    public List<DataEntity> searchMembers(SearchVO searchVO){
        String key = searchVO.getSearchKey();
        String word = searchVO.getSearchWord();

        if(word == null || word.isBlank()) return dataRepository.findAll();

        if ("userid".equals(key)) return dataRepository.findByUseridContaining(word);
        else if ("username".equals(key)) return dataRepository.findByUsernameContaining(word);
        else if ("email".equals(key)) return dataRepository.findByEmailContaining(word);
        else if ("tel".equals(key)) return dataRepository.findByTelContaining(word);
        else return dataRepository.findByUseridContaining(word);
    }
    //기업회원 검색
    public List<CpDataEntity> searchCpMembers(SearchVO searchVO) {
        String key = searchVO.getSearchKey();
        String word = searchVO.getSearchWord();

        if (word == null || word.isBlank()) return cpDataRepository.findAll();

        if ("userid".equals(key)) return cpDataRepository.findByUseridContaining(word);
        else if ("businessName".equals(key)) return cpDataRepository.findByBusinessNameContaining(word);
        else if ("email".equals(key)) return cpDataRepository.findByEmailContaining(word);
        else if ("tel".equals(key)) return cpDataRepository.findByTelContaining(word);
        else return cpDataRepository.findByUseridContaining(word);
    }
}