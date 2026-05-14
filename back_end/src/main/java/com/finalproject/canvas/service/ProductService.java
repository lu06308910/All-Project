package com.finalproject.canvas.service;

import com.finalproject.canvas.entity.FileEntity;
import com.finalproject.canvas.entity.ProductEntity;
import com.finalproject.canvas.repository.FileRepository;
import com.finalproject.canvas.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final FileRepository fileRepository;

    // 상품 등록
    public ProductEntity productInsert(ProductEntity productEntity){
        return productRepository.save(productEntity);
    }

    // 파일 리스트 저장
    public int fileListInsert(List<FileEntity> fileList){
        int cnt = 0;
        for(FileEntity entity : fileList) {
            fileRepository.save(entity);
            cnt++;
        }
        return cnt;
    }

    // 모든상품 리스트
    public Page<ProductEntity> productList(Pageable pageable) {
        return productRepository.findAllWithFiles(pageable);
    }

    // 상품 상세 조회
    public Optional<ProductEntity> productSelect(int id){
        return productRepository.findById(id);
    }


    // 특정 상품에 연결된 파일 조회
    // FileEntity 필드명이 productEntity 로 되어있다고 가정
    public List<FileEntity> fileSelect(int productId){
        return fileRepository.findByProductEntity_pId(productId);
    }

    // 상품 수정
    public int productUpdate(ProductEntity productEntity){
        return productRepository.updateProduct(
                productEntity.getPId(),
                productEntity.getName(),
                productEntity.getContext(),
                productEntity.getPrice()
        );
    }

    // 삭제할 파일들 선택
    public List<FileEntity> fileIdSelect(List<Integer> delFile){
        return fileRepository.findByIdIn(delFile);
    }

    // 파일 삭제
    public int fileDelete(List<Integer> delFile){
        return fileRepository.deleteByIdIn(delFile);
    }

    // 특정 상품에 연결된 파일 전체 삭제
    public List<FileEntity> fileListDelete(Integer productId){
        return fileRepository.findByProductEntity_pId(productId);
    }

    // 상품 삭제
    public void productDelete(Integer id){
        ProductEntity entity = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("해당 상품이 없습니다."));
        productRepository.delete(entity);
    }


}