package com.finalproject.canvas.service;

import com.finalproject.canvas.entity.JoinsEntity;
import com.finalproject.canvas.repository.JoinsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class JoinsService {
    //해당 respository를 캡슐화 된 final 변수로 선언
    private final JoinsRepository joinsRepository;

    // 회원가입
    public JoinsEntity joinsInsert(JoinsEntity joinsEntity) {
        // JoinsEntity(id=null, userid= ~~ 콘트롤러에서 받음
        // save()메소드 id의 값이 null이면 insert문을 만들어 구현한다.
        //              id의 값이 있으면 update문을 만들어서 구현한다.
        // 응답결과는 insert문인 경우에서 새로추가한 레코드를 entity에 담아 리턴해준다.
        //           update문인 경우에는 새로 수정한 레코드를 entity에 담아 리턴해준다.
//        JoinsEntity resultEntity = joinsRepository.save(joinsEntity);
//        System.out.println("insert후 결과값=="+ resultEntity.toString());
//        return joinsRepository.save(joinsEntity);
        try {
            return joinsRepository.save(joinsEntity);
        } catch (Exception se) {
            se.printStackTrace();
        }
        return null;
    }

    // 로그인(db select)
    public JoinsEntity login(JoinsEntity joinsEntity) {
        return joinsRepository.findByUseridAndUserpwd(joinsEntity.getUserid(), joinsEntity.getUserpwd());
    }

    // 회원선택
    public JoinsEntity joinsSelect(String userid) {
        return joinsRepository.findByUserid(userid);
    }

    // 회원수정
    public JoinsEntity joinsUpdate(JoinsEntity entity) {
        //폼에서 가져온 비밀번호와 db에 있는 비밀번호가 같으면 update가 되도록 한다.
        JoinsEntity orgEntity = joinsRepository.findByUserid(entity.getUserid());
        if (entity.getUserpwd().equals(orgEntity.getUserpwd())) { //비밀번호가 일치
            // update joins_entity set id=?, userid=?, userpwd=?, username=?
            return joinsRepository.save(entity);
        } else {//비밀번호 불일치
            return null;
        }
    }

    // 회원탈퇴
    public Integer unregister(Integer id) {
        int result = id;
        try{
            //레코드를 삭제하는 deleteById()메소드는 반환형이 없다
            joinsRepository.deleteById(id);

            JoinsEntity entity = joinsRepository.findById(id).orElseThrow(() -> {
                throw new IllegalArgumentException("존재하지 않는 정보입니다.");
            });
            result = id;
        } catch (Exception e){
            result = 0;
        }
        System.out.println(result);
        return result;
    }
}
