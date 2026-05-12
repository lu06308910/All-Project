package com.finalproject.canvas.controller;

import com.finalproject.canvas.entity.JoinsEntity;
import com.finalproject.canvas.service.JoinsService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins="*")
@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/member") //모든 매핑주소에 공통으로 들어가는 매핑
public class JoinsController {
    //해당 repository 검색하여
    private final JoinsService joinsService;
    // 회원가입 : /joins/joinsForm
    // 로그인 : /joins/login
    // 회원정보수정 : /joins/joinsEdit
    @PostMapping("/joinsForm")
    public JoinsEntity joinsForm(@RequestBody JoinsEntity joinsEntity){
        // JoinsEntity(id=null, userid= ~~ 서비스로 보냄
        return joinsService.joinsInsert(joinsEntity);
    }
    // 로그인(DB조회:select)
    @PostMapping("/login")
    public JoinsEntity joinsLogin(@RequestBody JoinsEntity joinsEntity, HttpSession session){
        log.info("로그인->"+ joinsEntity.toString());
        JoinsEntity resultEntity= joinsService.login(joinsEntity);
        log.info("로그인결과=>"+resultEntity.toString());
        //로그인 성공하면 session 정보 기록 : userid, username, logStatus="Y" or "N"
        if(resultEntity != null){ //로그인성공
            session.setAttribute("id", resultEntity.getId());
            session.setAttribute("logId", resultEntity.getUserid());
            session.setAttribute("logName", resultEntity.getUsername());
            session.setAttribute("logStatus",  "Y");


        }else{ //로그인실패
            session.setAttribute("logStatus", "N");
        }
        return resultEntity;
    }
    //로그아웃
    @GetMapping("/logout")
    public String logout(HttpSession session){
        session.invalidate();
        return "Ok";
    }
    //회원선택
    @PostMapping("/getJoins")
    public JoinsEntity getJoins(@RequestBody JoinsEntity entity){
        log.info("회원선택=>"+entity.getUserid());
        return joinsService.joinsSelect(entity.getUserid());
    }
    //회원수정
    @PostMapping("/joinsEdit")
    public JoinsEntity joinsEdit(@RequestBody JoinsEntity entity){
        log.info("회원수정확인->"+entity.toString());

        return joinsService.joinsUpdate(entity);
    }
    //회원탈퇴
    @DeleteMapping("/unregister/{id}")
    public Integer unregister(@PathVariable("id") Integer id, HttpSession session){
        log.info("회원탈퇴ID"+id);
        int result = joinsService.unregister(id);

        if(result==0){
            session.invalidate();
        }
        return result;
    }

}
