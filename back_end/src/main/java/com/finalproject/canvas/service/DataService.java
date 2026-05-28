package com.finalproject.canvas.service;

import com.finalproject.canvas.entity.CpDataEntity;
import com.finalproject.canvas.entity.DataEntity;
import com.finalproject.canvas.entity.OutStatus;
import com.finalproject.canvas.repository.CpDataRepository;
import com.finalproject.canvas.repository.DataRepository;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value; // 💡 어노테이션 임포트 체크
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class DataService {

    private final DataRepository dataRepository;      // 일반회원
    private final CpDataRepository cpDataRepository;  // 기업회원

    @Autowired
    private JavaMailSender mailSender;

    // 💡 [@Value 변수 위치 조정] properties에서 세팅값을 정상적으로 주입받도록 최상단으로 이동합니다.
    @Value("${kakao.client_id}")
    private String clientId;

    @Value("${kakao.redirect_uri}")
    private String redirectUri;

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
    public CpDataEntity businessLogin(String userid, String userpwd) {
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

        if (orgEntity != null && entity.getUserpwd().equals(orgEntity.getUserpwd())) {
            if (entity.getNewPassword() != null && !entity.getNewPassword().isEmpty()) {
                entity.setUserpwd(entity.getNewPassword());
            } else {
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
    //기업 회원 탈퇴
    public Integer cpUnregister(Integer cId) {
        try {
            CpDataEntity entity = cpDataRepository.findById(cId).orElse(null);
            if (entity == null) return 0;
            entity.setIsOut(OutStatus.Y);
            cpDataRepository.save(entity);
            return cId;
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

        // DB 조회: 이미 카카오로 가입한 회원인지 확인
        return dataRepository.findByKakaoId(kakaoId)
                .orElseGet(() -> {
                    // 최초 로그인 유저라면 자동 회원가입 진행
                    DataEntity newMember = new DataEntity();
                    newMember.setKakaoId(kakaoId);

                    newMember.setUserid("k_" + kakaoId.substring(0, Math.min(kakaoId.length(), 13)));
                    newMember.setUserpwd("kakao_oauth_pass_dummy");
                    newMember.setUsername(nickname);
                    newMember.setEmail(email);
                    newMember.setTel("010-0000-0000");
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
        String tokenUrl = "https://kauth.kakao.com/oauth/token";

        org.springframework.web.client.RestTemplate rt = new org.springframework.web.client.RestTemplate();
        org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

        org.springframework.util.LinkedMultiValueMap<String, String> params = new org.springframework.util.LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");

        // 하드코딩을 전부 지우고 위에서 정의한 런타임 변수(clientId, redirectUri)를 주입받아 사용합니다.
        params.add("client_id", clientId);
        log.info("카카오 토큰 요청 시 사용하는 redirectUri: {}", redirectUri);
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
            System.err.println("카카오 토큰 발급 중 예외 발생!");
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

    // 아이디 찾기 : 일반
    public String findUserId(String username, String email) {
        return dataRepository.findByUsernameAndEmail(username, email)
                .map(DataEntity::getUserid)
                .orElse(null); // 못 찾으면 null 반환
    }

    // 아이디 찾기 로직 : 기업
    public String findBusinessId(String businessName, String email) {
        return cpDataRepository.findByBusinessNameAndEmail(businessName, email)
                .map(CpDataEntity::getUserid)
                .orElse(null);
    }
    // 비밀번호 찾기 메일 설정
    private void sendEmail(String email, String username, String tempPwd) throws Exception {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, "utf-8");

        helper.setFrom("eogh8995@naver.com");
        helper.setTo(email);
        helper.setSubject("[Canvas] 요청하신 임시 비밀번호 발급 안내입니다.");
        helper.setText("안녕하세요. Canvas 서비스입니다.\n\n" +
                username + "님의 임시 비밀번호는 [" + tempPwd + "] 입니다.\n" +
                "로그인 후 회원정보 수정에서 반드시 비밀번호를 변경해 주세요.", false);

        mailSender.send(message);
    }
    // 일반 회원 비밀번호 찾기
    @Transactional
    public boolean findUserPwd(String userid, String email) {
        Optional<DataEntity> memberOpt = dataRepository.findByUseridAndEmail(userid, email);

        if (memberOpt.isPresent()) {
            DataEntity member = memberOpt.get();
            String tempPwd = java.util.UUID.randomUUID().toString().substring(0, 4); // 4자리 발급

            member.setUserpwd(tempPwd);
            dataRepository.save(member); // DB 저장

            try {
                sendEmail(email, member.getUsername(), tempPwd);
                return true;
            } catch (Exception e) {
                e.printStackTrace();
                return false;
            }
        }
        return false;
    }

    // 기업 회원 비밀번호 찾기
    @Transactional
    public boolean findBusinessPwd(String userid, String email) {
        Optional<CpDataEntity> optBiz = cpDataRepository.findByUseridAndEmail(userid, email);

        if (optBiz.isPresent()) {
            CpDataEntity biz = optBiz.get();
            String tempPwd = java.util.UUID.randomUUID().toString().substring(0, 4); // 통일감 있게 4자리 발급

            biz.setUserpwd(tempPwd);
            cpDataRepository.save(biz); // DB 저장

            try {
                sendEmail(email, biz.getBusinessName(), tempPwd);
                return true;
            } catch (Exception e) {
                log.error("기업 회원 메일 발송 중 예외 발생: ", e);
                return false;
            }
        }
        return false;
    }


    //장바구니 데이터 연결
    public DataEntity dataSelectById(Integer mId) {
        return dataRepository.findById(mId).orElse(null);
    }
}