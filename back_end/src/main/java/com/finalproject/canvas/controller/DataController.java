package com.finalproject.canvas.controller;

import com.finalproject.canvas.entity.CpDataEntity;
import com.finalproject.canvas.entity.DataEntity;
import com.finalproject.canvas.service.DataService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;


import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/member")

public class DataController {
    //해당 repository 검색하여
    private final DataService dataService;

    @Value("${kakao.client_id}")
    private String clientId;

    @Value("${kakao.redirect_uri}")
    private String redirectUri;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, Object> signupData) {
        String usertype = (String) signupData.get("usertype");

        if (usertype == null) {
            return ResponseEntity.badRequest().body("usertype 값이 필요합니다.");
        }

        // 일반 회원 가입
        if (usertype.equals("PERSONAL")) {
            DataEntity entity = new DataEntity();
            entity.setUserid((String) signupData.get("userid"));
            entity.setUserpwd((String) signupData.get("userpwd"));
            entity.setUsername((String) signupData.get("username"));
            entity.setTel((String) signupData.get("tel"));
            entity.setEmail((String) signupData.get("email"));
            entity.setZipcode((String) signupData.get("zipcode"));
            entity.setAddress((String) signupData.get("address"));
            entity.setAddressDetail((String) signupData.get("address_detail"));
            entity.setUsertype("PERSONAL");

            DataEntity saved = dataService.dataInsert(entity);
            return ResponseEntity.ok(saved);
        }

        // 기업 회원 가입
        else if (usertype.equals("BUSINESS")) {
            CpDataEntity cpEntity = new CpDataEntity();
            cpEntity.setUserid((String) signupData.get("userid"));
            cpEntity.setUserpwd((String) signupData.get("userpwd"));
            cpEntity.setBusinessName((String) signupData.get("businessName"));
            cpEntity.setBusinessNum((String) signupData.get("businessNum"));
            cpEntity.setTel((String) signupData.get("tel"));
            cpEntity.setEmail((String) signupData.get("email"));
            cpEntity.setZipcode((String) signupData.get("zipcode"));
            cpEntity.setAddress((String) signupData.get("address"));
            cpEntity.setAddressDetail((String) signupData.get("address_detail"));
            cpEntity.setUsertype("BUSINESS");

            CpDataEntity saved = dataService.businessInsert(cpEntity);
            return ResponseEntity.ok(saved);
        }

        return ResponseEntity.badRequest().body("지원하지 않는 usertype 입니다.");
    }

    // 로그인(DB조회:select)
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> loginData, HttpSession session) {

        String userId = loginData.get("userid");
        String userPwd = loginData.get("userpwd");
        String userType = loginData.get("usertype"); // PERSONAL / BUSINESS

        Map<String, Object> result = new HashMap<>();

        if (userId == null || userPwd == null || userType == null) {
            result.put("status", "ERROR");
            result.put("message", "필수 정보가 누락되었습니다.");
            return result;
        }

        log.info("로그인 요청 → " + loginData.toString());

        Object loginUser = null;

        // 일반 회원 로그인
        if (userType.equals("PERSONAL")) {
            loginUser = dataService.loginPersonal(userId, userPwd);
        }
        // 기업 회원 로그인
        else if (userType.equals("BUSINESS")) {
            loginUser = dataService.businessLogin(userId, userPwd);
        }

        // 로그인 실패
        if (loginUser == null) {
            session.setAttribute("logStatus", "N");
            result.put("status", "FAIL");
            result.put("message", "아이디 또는 비밀번호를 확인하세요.");
            return result;
        }

        // 로그인 성공
        session.setAttribute("logStatus", "Y");

        if (userType.equals("PERSONAL")) {
            DataEntity user = (DataEntity) loginUser;
            session.setAttribute("logId", user.getUserid());
            session.setAttribute("logName", user.getUsername());

            result.put("username", user.getUsername());
            result.put("userid", user.getUserid());
            result.put("usertype", "PERSONAL");

            result.put("mId", user.getMId());
        } else {
            CpDataEntity biz = (CpDataEntity) loginUser;
            session.setAttribute("logId", biz.getUserid());
            session.setAttribute("logName", biz.getBusinessName());

            result.put("username", biz.getBusinessName());
            result.put("userid", biz.getUserid());
            result.put("usertype", "BUSINESS");

        }

        result.put("status", "OK");
        return result;
    }


    // 로그아웃
    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "OK";
    }

    //회원선택
    @PostMapping("/getmember")
    public DataEntity getData(@RequestBody DataEntity entity) {
        log.info("회원선택=>" + entity.getUserid());
        return dataService.dataSelect(entity.getUserid());
    }

    // 기존 정보 가져오기
    @GetMapping("/edit")
    public ResponseEntity<?> getEditData(@RequestParam("userid") String userid,
                                         @RequestParam("usertype") String usertype) {
        log.info("수정 데이터 조회 요청 -> ID: {}, Type: {}", userid, usertype);

        if ("PERSONAL".equals(usertype)) {
            DataEntity user = dataService.dataSelect(userid);
            if (user != null) return ResponseEntity.ok(user);
        } else if ("BUSINESS".equals(usertype)) {
            CpDataEntity biz = dataService.businessSelect(userid);
            if (biz != null) return ResponseEntity.ok(biz);
        }
        return ResponseEntity.status(404).body("사용자 정보를 찾을 수 없습니다.");
    }

    //회원수정
    @PostMapping("/edit")
    public ResponseEntity<?> updateMemberData(@RequestBody DataEntity entity) {
        log.info("수정 요청 ID: {}", entity.getUserid());

        DataEntity updated = dataService.dataUpdate(entity);
        if (updated != null) return ResponseEntity.ok(updated);
        return ResponseEntity.status(401).body("비밀번호 불일치 또는 수정 실패");
    }

    // 기업 회원 수정
    @PostMapping("/businessedit")
    public ResponseEntity<?> businessEdit(@RequestBody CpDataEntity entity) {
        log.info("기업 회원 수정 요청 아이디: {}", entity.getUserid());
        log.info("기업 새비번: {}", entity.getNewPassword());

        CpDataEntity updated = dataService.businessUpdate(entity);
        if (updated != null) return ResponseEntity.ok(updated);
        return ResponseEntity.status(401).body("수정 실패");
    }

    //회원탈퇴
    //is_out만 탈퇴 형식으로 바꾸기
    @PatchMapping("/unregister/{id}")
    public ResponseEntity<?> unregister(@PathVariable("id") Integer id) {
        int result = dataService.unregister(id);
        if (result != 0) {
            return ResponseEntity.ok("탈퇴처리 완료");
        }
        return ResponseEntity.badRequest().body("탈퇴처리 실패");
    }

    //모든 회원 정보 가져오기 (관리자 페이지)
    @GetMapping("/all/member")
    public List<DataEntity> getMembers() {
        return dataService.getAllMembers();
    }

    @GetMapping("/all/business")
    public List<CpDataEntity> getCpMembers() {
        return dataService.getAllCpMembers();
    }

    @GetMapping("/kakao")
    public ResponseEntity<?> kakaoLogin(@RequestParam("code") String code, HttpSession session) {
        log.info("=== 백엔드 수신 완료: 카카오 인가 코드 -> " + code);

        DataEntity result = kakaoLoginLogic(code);

        Map<String, Object> response = new HashMap<>();
        if (result != null) {
            session.setAttribute("logStatus", "Y");
            session.setAttribute("logId", result.getUserid());
            session.setAttribute("logName", result.getUsername());

            response.put("status", "OK");
            response.put("userid", result.getUserid());
            response.put("username", result.getUsername());
            response.put("usertype", "PERSONAL");
            response.put("mId", result.getMId());
            return ResponseEntity.ok(response);
        } else {
            response.put("status", "FAIL");
            response.put("message", "카카오 인증 및 회원 등록에 실패했습니다.");
            return ResponseEntity.ok(response);
        }
    }

    @Transactional
    public DataEntity kakaoLoginLogic(String code) {
        String accessToken = getKakaoAccessToken(code);
        if (accessToken == null) return null;

        Map<String, Object> kakaoUserInfo = getKakaoUserInfo(accessToken);
        if (kakaoUserInfo == null) return null;

        String kakaoId = String.valueOf(kakaoUserInfo.get("id"));

        @SuppressWarnings("unchecked")
        Map<String, Object> kakaoAccount = (Map<String, Object>) kakaoUserInfo.get("kakao_account");
        @SuppressWarnings("unchecked")
        Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");

        String nickname = (profile != null) ? String.valueOf(profile.get("nickname")) : "카카오회원";
        String email = "kakao_" + kakaoId + "@test.com";

        // 기존에 등록된 카카오 회원이 있는지 dataService(또는 직접 엮인 매커니즘)를 활용하여 조회 및 가입 진행
        DataEntity existingMember = dataService.dataSelect("k_" + kakaoId.substring(0, Math.min(kakaoId.length(), 13)));

        if (existingMember != null) {
            return existingMember;
        } else {
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

            return dataService.dataInsert(newMember);
        }
    }

    private String getKakaoAccessToken(String code) {
        String tokenUrl = "https://kauth.kakao.com/oauth/token";
        org.springframework.web.client.RestTemplate rt = new org.springframework.web.client.RestTemplate();
        org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
        headers.setContentType(org.springframework.http.MediaType.APPLICATION_FORM_URLENCODED);

        org.springframework.util.LinkedMultiValueMap<String, String> params = new org.springframework.util.LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", clientId.trim());
        params.add("redirect_uri", redirectUri.trim());
        params.add("code", code.trim());

        org.springframework.http.HttpEntity<org.springframework.util.MultiValueMap<String, String>> kakaoTokenRequest =
                new org.springframework.http.HttpEntity<>(params, headers);
        try {
            org.springframework.http.ResponseEntity<Map> response = rt.exchange(
                    tokenUrl, org.springframework.http.HttpMethod.POST, kakaoTokenRequest, Map.class
            );
            return String.valueOf(response.getBody().get("access_token"));
        } catch (Exception e) {
            log.error("카카오 토큰 발급 실패: ", e);
            return null;
        }
    }

    private Map<String, Object> getKakaoUserInfo(String accessToken) {
        String userInfoUrl = "https://kapi.kakao.com/v2/user/me";
        org.springframework.web.client.RestTemplate rt = new org.springframework.web.client.RestTemplate();
        org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
        headers.add("Authorization", "Bearer " + accessToken);
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

        org.springframework.http.HttpEntity<org.springframework.util.MultiValueMap<String, String>> kakaoProfileRequest =
                new org.springframework.http.HttpEntity<>(headers);
        try {
            org.springframework.http.ResponseEntity<Map> response = rt.exchange(
                    userInfoUrl, org.springframework.http.HttpMethod.POST, kakaoProfileRequest, Map.class
            );
            return response.getBody();
        } catch (Exception e) {
            log.error("카카오 유저 정보 조회 실패: ", e);
            return null;
        }
    }

}