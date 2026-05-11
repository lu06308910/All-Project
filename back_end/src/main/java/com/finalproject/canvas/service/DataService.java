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

        if(user != null&& user.getPassword().equals(password)){
            return user; //로그인 성공
        }
        return null; //로그인 실패
    }
}
