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
    public Integer unregister(Integer mId) {
        try {
            DataEntity entity = dataRepository.findById(mId).orElse(null);
            if (entity == null) return 0;
            entity.setIsOut(DataEntity.OutStatus.Y);
            dataRepository.save(entity);
            return mId;
        } catch (Exception e) {
            return 0;
        }
    }

    //모든 일반회원 정보 가져오기
    public List<DataEntity> getAllMembers() {
        return dataRepository.findAll();
    }

    //모든 기업회원 정보 가져오기
    public List<CpDataEntity> getAllCpMembers() {
        return cpDataRepository.findAll();
    }


    /**
     * 카카오 소셜 로그인 비즈니스 로직
     *
     * @param code 리액트에서 넘겨준 카카오 인가 코드
     * @return 로그인 완료된 DataEntity 객체
     */
    @Transactional
    public DataEntity kakaoLogin(String code) {
        // 카카오 토큰 받기 요청
        String accessToken = getKakaoAccessToken(code);
        if (accessToken == null) return null;

        // 받은 토큰으로 카카오 사용자 정보(프로필, 이메일 등) 가져오기
        java.util.Map<String, Object> kakaoUserInfo = getKakaoUserInfo(accessToken);
        if (kakaoUserInfo == null) return null;

        String kakaoId = String.valueOf(kakaoUserInfo.get("id"));

        @SuppressWarnings("unchecked")
        java.util.Map<String, Object> kakaoAccount = (java.util.Map<String, Object>) kakaoUserInfo.get("kakao_account");
        @SuppressWarnings("unchecked")
        java.util.Map<String, Object> profile = (java.util.Map<String, Object>) kakaoAccount.get("profile");

        String nickname = (profile != null) ? String.valueOf(profile.get("nickname")) : "카카오회원";
        String email = (kakaoAccount != null && kakaoAccount.get("email") != null)
                ? String.valueOf(kakaoAccount.get("email")) : kakaoId + "@kakao.com";

        // 3. DB 조회: 이미 카카오로 가입한 회원인지 확인
        return dataRepository.findByKakaoId(kakaoId)
                .orElseGet(() -> {
                    // 최초 로그인 유저라면 자동 회원가입 진행!
                    DataEntity newMember = new DataEntity();
                    newMember.setKakaoId(kakaoId);

                    // Not Null 제약조건 충족을 위한 안전한 더미 데이터 세팅
                    newMember.setUserid("k_" + kakaoId.substring(0, Math.min(kakaoId.length(), 13))); // 고유 ID 조합 (최대 15자 제한 대응)
                    newMember.setUserpwd("kakao_oauth_pass_dummy");
                    newMember.setUsername(nickname);
                    newMember.setEmail(email);
                    newMember.setTel("010-0000-0000"); // 기본값 채우기
                    newMember.setZipcode("00000");
                    newMember.setAddress("소셜 가입 회원");
                    newMember.setAddressDetail("카카오 로그인");
                    newMember.setUsertype("PERSONAL");
                    newMember.setIsOut(DataEntity.OutStatus.N);

                    return dataRepository.save(newMember);
                });
    }

    // 카카오 Access Token 발급 요청
    private String getKakaoAccessToken(String code) {
        // ⚠️ 본인의 카카오 REST API 키와 리액트에 등록한 Redirect URI로 정확하게 일치시켜야 합니다!
        String clientId = "YOUR_KAKAO_REST_API_KEY";
        String redirectUri = "http://localhost:3000/oauth/callback/kakao";
        String tokenUrl = "https://kauth.kakao.com/oauth/token";

        org.springframework.web.client.RestTemplate rt = new org.springframework.web.client.RestTemplate();
        org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

        org.springframework.util.LinkedMultiValueMap<String, String> params = new org.springframework.util.LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", clientId);
        params.add("redirect_uri", redirectUri);
        params.add("code", code);

        org.springframework.http.HttpEntity<org.springframework.util.MultiValueMap<String, String>> kakaoTokenRequest =
                new org.springframework.http.HttpEntity<>(params, headers);

        try {
            org.springframework.http.ResponseEntity<java.util.Map> response = rt.exchange(
                    tokenUrl,
                    org.springframework.http.HttpMethod.POST,
                    kakaoTokenRequest,
                    java.util.Map.class
            );
            return String.valueOf(response.getBody().get("access_token"));
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    // ---- 카카오 로그인 -> Access Token으로 카카오 사용자 정보 조회 ----
    private java.util.Map<String, Object> getKakaoUserInfo(String accessToken) {
        String userInfoUrl = "https://kapi.kakao.com/v2/user/me";

        org.springframework.web.client.RestTemplate rt = new org.springframework.web.client.RestTemplate();
        org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
        headers.add("Authorization", "Bearer " + accessToken);
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

        org.springframework.http.HttpEntity<org.springframework.util.MultiValueMap<String, String>> kakaoProfileRequest =
                new org.springframework.http.HttpEntity<>(headers);

        try {
            org.springframework.http.ResponseEntity<java.util.Map> response = rt.exchange(
                    userInfoUrl,
                    org.springframework.http.HttpMethod.POST,
                    kakaoProfileRequest,
                    java.util.Map.class
            );
            return response.getBody();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

}