package com.finalproject.canvas.controller;

import com.finalproject.canvas.entity.CpDataEntity;
import com.finalproject.canvas.entity.DataEntity;
import com.finalproject.canvas.service.DataService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins="*")
@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/member")

public class DataController {
    //해당 repository 검색하여
    private final DataService dataService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, Object> signupData) {
        String usertype = (String) signupData.get("usertype");

        if(usertype == null){
            return ResponseEntity.badRequest().body("usertype 값이 필요합니다.");
        }

        // 일반 회원 가입
        if(usertype.equals("PERSONAL")) {
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
        else if(usertype.equals("BUSINESS")) {
            CpDataEntity cpEntity = new CpDataEntity();
            cpEntity.setUserid((String) signupData.get("userid"));
            cpEntity.setUserpwd((String) signupData.get("userpwd"));
//            cpEntity.setOwnerName((String) signupData.get("ownername")); // 담당자명
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
            loginUser = dataService.loginBusiness(userId, userPwd);
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
    @PostMapping("/getJoins")
    public DataEntity getData(@RequestBody DataEntity entity){
        log.info("회원선택=>"+entity.getUserid());
        return dataService.dataSelect(entity.getUserid());
    }
    //회원수정
    @PostMapping("/joinsEdit")
    public DataEntity dataEdit(@RequestBody DataEntity entity){
        log.info("회원수정확인->"+entity.toString());

        return dataService.dataUpdate(entity);
    }
    //회원탈퇴
    @DeleteMapping("/unregister/{id}")
    public Integer unregister(@PathVariable("id") Integer id, HttpSession session){
        log.info("회원탈퇴ID"+id);
        int result = dataService.unregister(id);

        if(result !=0){
            session.invalidate();
        }
        return result;
    }
}
