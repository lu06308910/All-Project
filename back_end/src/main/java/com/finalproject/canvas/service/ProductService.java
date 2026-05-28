package com.finalproject.canvas.service;

import com.finalproject.canvas.entity.FileEntity;
import com.finalproject.canvas.entity.ProductEntity;
import com.finalproject.canvas.entity.*;
import com.finalproject.canvas.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final FileRepository fileRepository;
    private final EventRepository eventRepository;
    private final BuyRepository buyRepository;
    private final DeliveryRepository deliveryRepository;
    private final CartRepository cartRepository;

    // 상품 등록
    public ProductEntity productInsert(ProductEntity productEntity) {
        return productRepository.save(productEntity);
    }

    // 할인상품 할인가격 적용
    public Optional<EventEntity> getEventByProductId(Integer pId) {
        List<EventEntity> list = eventRepository.findActiveEvents(pId);
        if (list.isEmpty()) return Optional.empty();
        return Optional.of(list.get(0));
    }

    // 파일 리스트 저장
    public int fileListInsert(List<FileEntity> fileList) {
        int cnt = 0;
        for (FileEntity entity : fileList) {
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
    public Optional<ProductEntity> productSelect(int id) {
        return productRepository.findById(id);
    }

    // 특정 상품에 연결된 파일 조회
    // FileEntity 필드명이 productEntity 로 되어있다고 가정
    public List<FileEntity> fileSelect(int productId) {
        return fileRepository.findByProductEntity_pId(productId);
    }

    // 상품 수정
    public int productUpdate(ProductEntity productEntity) {
        return productRepository.updateProduct(
                productEntity.getPId(),
                productEntity.getName(),
                productEntity.getContext(),
                productEntity.getPrice()
        );
    }

    // 삭제할 파일들 선택
    public List<FileEntity> fileIdSelect(List<Integer> delFile) {
        return fileRepository.findByIdIn(delFile);
    }

    // 파일 삭제
    public int fileDelete(List<Integer> delFile) {
        return fileRepository.deleteByIdIn(delFile);
    }

    // 특정 상품에 연결된 파일 전체 삭제
    public List<FileEntity> fileListDelete(Integer productId) {
        return fileRepository.findByProductEntity_pId(productId);
    }

    // 상품 삭제
    public void productDelete(Integer id) {
        eventRepository.deleteByProduct_pId(id);

        List<FileEntity> files = fileRepository.findByProductEntity_pId(id);
        fileRepository.deleteAll(files);

        List<BuyEntity> buys = buyRepository.findByProduct_pId(id);
        buyRepository.deleteAll(buys);

        deliveryRepository.deleteBypId(id);
        cartRepository.deleteBypId(id);

        ProductEntity entity = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("해당 상품이 없습니다."));
        productRepository.delete(entity);
    }

    //모든 product 정보 가져오기(관리자 페이지)
    public List<ProductEntity> getAllProducts() {
        return productRepository.findAll();
    }

    //제품 검색
    public List<ProductEntity> searchProducts(SearchVO searchVO) {
        String key = searchVO.getSearchKey();
        String word = searchVO.getSearchWord();
        if (word == null || word.isBlank()) return productRepository.findAll();

        if ("name".equals(key)) return productRepository.findByNameContaining(word);
        if ("businessName".equals(key)) return productRepository.findByCompany_BusinessNameContaining(word);
        else return productRepository.findByCompany_BusinessNameContaining(word);
    }

    // 찜한 상품 목록 마이페이지 가져오기 - 대호추가
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public List<ProductEntity> getWishList(String userid) {
        List<ProductEntity> list = productRepository.findWishListByUserId(userid);

        for (ProductEntity product : list) {
            if (product.getFileList() != null) {
                int size = product.getFileList().size();
                System.out.println("상품명: " + product.getName() + " / 파일 개수: " + size); // ★ 추가해서 콘솔 확인
            }
        }
        return list;
    }

    // 특정 기업(판매자)이 등록한 상품 목록 조회

    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public List<ProductEntity> getProductsBySeller(String sellerId) {
        // 앞서 ProductRepository에 추가하기로 한 findProductsBySeller를 호출합니다.
        return productRepository.findProductsBySeller(sellerId);
    }


    // 상품 간이 수정 (마이페이지 관리 화면용: 이름, 가격, 재고, 상태)

    @org.springframework.transaction.annotation.Transactional
    public void updateProductSimple(Integer pId, ProductEntity updateDto) {
        ProductEntity product = productRepository.findById(pId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 상품입니다."));

        product.setName(updateDto.getName());
        product.setPrice(updateDto.getPrice());
        product.setCount(updateDto.getCount());
    }
    // 상품 삭제
    @org.springframework.transaction.annotation.Transactional
    public void deleteSellerProduct(Integer id) {
        // 기존에 연관된 이벤트 테이블 등을 지우는 로직이 이미 구현되어 있으므로
        // 서비스 내부에 만들어두신 기존 productDelete 메서드를 그대로 호출하여 안전하게 삭제합니다.
        this.productDelete(id);
    }
    // 이슬 카테고리 페이지
    public List<ProductEntity> getBysCategory(String sCategory) {
        return productRepository.findBysCategory(sCategory.trim());
    }

//    // 탑 상품 검색기능 , 이슬추가
//    public List<ProductEntity> searchProduct(String keyword) {
//        return productRepository.findByNameContaining(keyword);
//    }
}