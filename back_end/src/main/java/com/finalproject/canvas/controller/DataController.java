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
        String userid = (String) signupData.get("userid");

        if (usertype == null) {
            Map<String, String> err = new HashMap<>();
            err.put("message", "usertype 값이 필요합니다.");
            return ResponseEntity.badRequest().body(err);
        }

        if (userid == null || userid.trim().isEmpty()) {
            Map<String, String> err = new HashMap<>();
            err.put("message", "userid 값이 필요합니다.");
            return ResponseEntity.badRequest().body(err);
        }

        String cleanUserId = userid.trim();

        // 💡 [수정] 일반 회원 중복 검사 반환 형식을 객체(Map)로 변경
        DataEntity existingPersonal = dataService.dataSelect(cleanUserId);
        if (existingPersonal != null && existingPersonal.getUserid().equalsIgnoreCase(cleanUserId)) {
            Map<String, String> err = new HashMap<>();
            err.put("message", "이미 존재하는 아이디입니다.");
            return ResponseEntity.badRequest().body(err); // 프론트엔드가 에러 메시지를 정확히 읽을 수 있게 보냅니다.
        }

        // 💡 [수정] 기업 회원 중복 검사 반환 형식을 객체(Map)로 변경
        try {
            CpDataEntity existingBusiness = dataService.businessSelect(cleanUserId);
            if (existingBusiness != null && existingBusiness.getUserid().equalsIgnoreCase(cleanUserId)) {
                Map<String, String> err = new HashMap<>();
                err.put("message", "이미 존재하는 기업 아이디입니다.");
                return ResponseEntity.badRequest().body(err);
            }
        } catch (Exception e) {
            log.warn("기업 회원 중복 조회 중 예외 발생: " + e.getMessage());
        }

        // 일반 회원 가입
        if (usertype.equals("PERSONAL")) {
            DataEntity entity = new DataEntity();
            entity.setUserid(userid);
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

        Map<String, String> err = new HashMap<>();
        err.put("message", "지원하지 않는 usertype 입니다.");
        return ResponseEntity.badRequest().body(err);
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

            // 이슬 기업 로그인 아이디추가
            result.put("cId", biz.getCId());

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
        System.out.println("=========================================");
        System.out.println("★ 백엔드 카카오 엔드포인트 수신 성공! code: " + code);
        System.out.println("=========================================");

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
        try {
            String accessToken = getKakaoAccessToken(code);
            log.info("발급된 토큰: [{}]", accessToken);
            if (accessToken == null) return null;

            Map<String, Object> kakaoUserInfo = getKakaoUserInfo(accessToken);
            log.info("카카오 유저정보 객체 수신 여부: {}", (kakaoUserInfo != null));
            if (kakaoUserInfo == null) return null;

            String kakaoId = String.valueOf(kakaoUserInfo.get("id"));
            log.info("카카오 고유 ID: [{}]", kakaoId);

            String nickname = "카카오회원";
            // kakao_account나 profile이 null이어도 터지지 않도록 안전하게 검증 체인 추가
            if (kakaoUserInfo.get("kakao_account") != null) {
                Map<String, Object> kakaoAccount = (Map<String, Object>) kakaoUserInfo.get("kakao_account");
                if (kakaoAccount.get("profile") != null) {
                    Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");
                    if (profile.get("nickname") != null) {
                        nickname = String.valueOf(profile.get("nickname"));
                    }
                }
            }
            String email = "kakao_" + kakaoId + "@test.com";
            String generatedUserId = "k_" + kakaoId.substring(0, Math.min(kakaoId.length(), 13));

            // DB 조회 시 에러가 나더라도 catch 블록이 잡아서 로그를 찍어줄 것입니다.
            DataEntity existingMember = null;
            try {
                existingMember = dataService.dataSelect(generatedUserId);
            } catch (Exception e) {
                log.warn(" 기존 회원 조회 중 예외 발생 (무시하고 신규 가입 진행 가능): " + e.getMessage());
            }

            if (existingMember != null) {
                log.info("기존 카카오 가입 이력 확인 완료: {}", generatedUserId);
                return existingMember;
            } else {
                log.info("신규 카카오 회원가입 진행: {}", generatedUserId);
                DataEntity newMember = new DataEntity();
                newMember.setKakaoId(kakaoId);
                newMember.setUserid(generatedUserId);
                newMember.setUserpwd("12345678");
                newMember.setUsername(nickname);
                newMember.setEmail(email);
                newMember.setTel("010-0000-0000");
                newMember.setZipcode("00000");
                newMember.setAddress("소셜 가입 회원");
                newMember.setAddressDetail("카카오 로그인");
                newMember.setUsertype("PERSONAL");
                newMember.setIsOut(DataEntity.OutStatus.N);
                newMember.setWritedate(java.time.LocalDateTime.now());

                return dataService.dataInsert(newMember);
            }
        } catch (Exception e) {
            log.error("kakaoLoginLogic 내부에서 예외 발생 원인: ", e);
            return null;
        }
    }

    private String getKakaoAccessToken(String code) {
        String tokenUrl = "https://kauth.kakao.com/oauth/token";
        org.springframework.web.client.RestTemplate rt = new org.springframework.web.client.RestTemplate();
        org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
        headers.setContentType(org.springframework.http.MediaType.APPLICATION_FORM_URLENCODED);

        // 공백으로 인한 오류를 방지하기 위해 각 변수에 .trim()을 확실히 먹여서 검증합니다.
        String cleanClientId = (clientId != null) ? clientId.trim() : "";
        String cleanRedirectUri = (redirectUri != null) ? redirectUri.trim() : "";
        String cleanCode = (code != null) ? code.trim() : "";

        org.springframework.util.LinkedMultiValueMap<String, String> params = new org.springframework.util.LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", cleanClientId);
        params.add("redirect_uri", cleanRedirectUri);
        params.add("code", cleanCode);

        org.springframework.http.HttpEntity<org.springframework.util.MultiValueMap<String, String>> kakaoTokenRequest =
                new org.springframework.http.HttpEntity<>(params, headers);
        try {
            org.springframework.http.ResponseEntity<Map> response = rt.exchange(
                    tokenUrl, org.springframework.http.HttpMethod.POST, kakaoTokenRequest, Map.class
            );
            log.info("카카오 토큰 발급 성공완료!");
            return String.valueOf(response.getBody().get("access_token"));
        } catch (org.springframework.web.client.HttpClientErrorException e) {
            // 💡 [중요] 카카오가 보낸 에러 Body 내용을 상세하게 파싱해서 콘솔에 출력합니다.
            log.error(" 카카오 토큰 발급 HTTP 에러 발생! 상태코드: {}", e.getStatusCode());
            log.error(" 카카오가 뱉어낸 진짜 에러 원인 응답 바디: {}", e.getResponseBodyAsString());
            return null;
        } catch (Exception e) {
            log.error(" 알 수 없는 토큰 발급 예외 발생: ", e);
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

    //  아이디 찾기 엔드포인트
    @PostMapping("/find-id")
    public org.springframework.http.ResponseEntity<?> findId(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();

        String userType = request.get("userType");
        String username = request.get("username");
        String email = request.get("email");

        String userId = null;

        // 기업 회원 아이디 찾기
        if ("BUSINESS".equals(userType)) {
            // ※ 서비스단에 구현된 기업 전용 아이디 찾기 메서드를 매칭합니다.
            // ※ 이름(username) 자리에 프론트에서 보낸 상호명(businessName)이 전달됩니다.
            userId = dataService.findBusinessId(username, email);
        }
        // 일반 회원 아이디 찾기
        else {
            userId = dataService.findUserId(username, email);
        }

        if (userId != null) {
            response.put("status", "OK");
            response.put("userid", userId);
            return ResponseEntity.ok(response);
        } else {
            response.put("status", "FAIL");
            response.put("message", "일치하는 회원 정보가 없습니다.");
            return ResponseEntity.ok(response);
        }
    }

    // 비밀번호 찾기 엔드포인트
    @PostMapping("/find-pwd")
    public ResponseEntity<?> findPwd(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();

        String userType = request.get("userType"); // 유저 타입 추가 수신
        String userid = request.get("userid");
        String email = request.get("email");

        boolean result = false;

        // 기업 회원 임시 비밀번호 발급
        if ("BUSINESS".equals(userType)) {
            // ※ 서비스단에 구현된 기업 전용 비밀번호 찾기(및 메일 발송) 메서드 매칭
            result = dataService.findBusinessPwd(userid, email);
        }
        // 일반 회원 임시 비밀번호 발급 (기존 로직)
        else {
            result = dataService.findUserPwd(userid, email);
        }


        if (result) {
            response.put("status", "OK");
            response.put("message", "등록하신 이메일로 임시 비밀번호가 전송되었습니다.");
            return ResponseEntity.ok(response);
        } else {
            response.put("status", "FAIL");
            response.put("message", "아이디 또는 이메일 정보가 일치하지 않거나 메일 발송에 실패했습니다.");
            return ResponseEntity.ok(response);
        }
    }

    //장바구니 데이터 정보 조회
    @GetMapping("/info/{mId}")
    public ResponseEntity<?> getMemberById(@PathVariable Integer mId) {
        DataEntity user = dataService.dataSelectById(mId);
        if (user != null) return ResponseEntity.ok(user);
        return ResponseEntity.status(404).body("사용자를 찾을 수 없습니다.");
    }

}