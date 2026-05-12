package com.finalproject.canvas.service;

import com.finalproject.canvas.entity.DataEntity;
import com.finalproject.canvas.repository.DataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DataService {

    @Autowired
    private DataRepository dataRepository;

    public DataEntity login(String userId, String password){
        DataEntity user = dataRepository.findByUserId(userId)
                .orElse(null);
// [확인용 로그]
        if(user == null) {
            System.out.println(">>> 서비스 결과: DB에 '" + userId + "' 라는 아이디가 없음");
        } else {
            System.out.println(">>> 서비스 결과: 아이디는 있음 비번 일치 여부: " + user.getPassword().equals(password));
            System.out.println(">>> DB비번: [" + user.getPassword() + "], 입력비번: [" + password + "]");
        }
        if(user != null && user.getPassword().trim().equals(password.trim())){
            return user; //로그인 성공
        }
        return null; //로그인 실패
    }
}
