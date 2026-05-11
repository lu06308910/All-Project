package com.finalproject.canvas.controller;

import com.finalproject.canvas.entity.DataEntity;
import com.finalproject.canvas.repository.DataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/test")
public class DataController {

    @Autowired
    private DataRepository dataRepository;

    // 데이터 저장
    @PostMapping("/save")
    public DataEntity saveData(@RequestBody DataEntity data){
        return dataRepository.save(data);
    }

    @GetMapping("/all")
    public List<DataEntity> getAllData(){
        return dataRepository.findAll();
    }
}
