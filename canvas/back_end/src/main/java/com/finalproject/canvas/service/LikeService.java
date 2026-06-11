package com.finalproject.canvas.service;

import com.finalproject.canvas.entity.LikeEntity;
import com.finalproject.canvas.repository.LikeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LikeService {

    @Autowired
    private LikeRepository likeRepository;

    // 좋아요 토글 기능
    public boolean toggleLike(Integer memberId, Integer productId) {

        LikeEntity find = likeRepository.findLike(memberId, productId);

        if (find != null) {
            likeRepository.delete(find);
            return false;
        }

        LikeEntity like = new LikeEntity();
        like.setMId(memberId);
        like.setPId(productId);
        like.setWritedate(LocalDateTime.now());



        System.out.println("memberId = " + memberId);
        System.out.println("entity mId = " + like.getMId());

        likeRepository.save(like);
        return true;
    }

    // 유저가 좋아요한 상품 ID 리스트 가져오기
    public List<Integer> getLikedProductIds(Integer memberId) {

        return likeRepository.findBymId(memberId)
                .stream()
                .map(LikeEntity::getPId)
                .toList();
    }
}