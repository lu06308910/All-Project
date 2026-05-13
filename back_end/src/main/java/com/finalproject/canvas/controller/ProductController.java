package com.finalproject.canvas.controller;

import com.finalproject.canvas.entity.FileEntity;
import com.finalproject.canvas.entity.ProductEntity;
import com.finalproject.canvas.service.ProductService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.interceptor.TransactionAspectSupport;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.sql.SQLException;
import java.util.*;

@RestController
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins="*")
public class ProductController {

    private final ProductService productService;

    /**
     * 상품 등록
     */
    @PostMapping("/mypage/addproduct")
    @Transactional(rollbackFor = {RuntimeException.class, SQLException.class})
    public String productWrite(ProductEntity productEntity, HttpSession session){



        String uploadPath = session.getServletContext().getRealPath("/uploads");
        List<FileEntity> fileEntities = null;

        try {
            // 업로드 폴더 없으면 생성
            File uploadDir = new File(uploadPath);
            if(!uploadDir.exists()) uploadDir.mkdir();

            // 1) 상품 등록
            ProductEntity savedProduct = productService.productInsert(productEntity);

            // 2) 파일 업로드 처리
            fileEntities = fileUploadProcess(productEntity.getFiles(), savedProduct.getPId(), uploadPath);

            // 3) 파일 DB 저장
            productService.fileListInsert(fileEntities);

        } catch(Exception e){
            e.printStackTrace();

            // 이미 업로드된 파일 삭제
            if(fileEntities != null){
                for(FileEntity entity : fileEntities){
                    File delFile = new File(uploadPath, entity.getFilename()+"."+entity.getExtname());
                    if(delFile.exists()) delFile.delete();
                }
            }

            TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
            return "FAIL";
        }

        return "OK";
    }

    /**
     * 파일 업로드 처리
     */
    public List<FileEntity> fileUploadProcess(List<MultipartFile> fileList, Integer productId, String uploadPath) throws Exception{

        List<FileEntity> uploadFiles = new ArrayList<>();

        if(fileList != null){
            for(MultipartFile mf : fileList){

                if(mf != null && !mf.isEmpty()){

                    String uploadFilename = mf.getOriginalFilename();
                    int point = uploadFilename.lastIndexOf(".");

                    String filename = uploadFilename.substring(0, point);
                    String extname = uploadFilename.substring(point + 1);

                    File f = new File(uploadPath, uploadFilename);

                    // 동일 파일명 처리
                    if(f.exists()){
                        for(int num=1;;num++){
                            String newFilename = filename + "(" + num + ")." + extname;
                            f = new File(uploadPath, newFilename);
                            if(!f.exists()){
                                uploadFilename = newFilename;
                                break;
                            }
                        }
                    }

                    // 파일 업로드
                    mf.transferTo(f);

                    // FileEntity 생성
                    FileEntity fe = new FileEntity();
                    int newPoint = uploadFilename.lastIndexOf(".");
                    fe.setFilename(uploadFilename.substring(0, newPoint));
                    fe.setExtname(uploadFilename.substring(newPoint + 1));
                    fe.setSize((int) f.length());

                    ProductEntity p = new ProductEntity();
                    p.setPId(productId);

                    fe.setProductEntity(p);

                    uploadFiles.add(fe);
                }
            }
        }

        return uploadFiles;
    }

    /**
     * 상품 상세 조회
     */
    @GetMapping("/product/{id}")
    public Map<String, Object> productDetail(@PathVariable("id") int id){

        Map<String, Object> result = new HashMap<>();

        result.put("product", productService.productSelect(id).orElse(null));

        List<FileEntity> fileList = productService.fileSelect(id);
        result.put("fileList", fileList);

        return result;
    }

    /**
     * 상품 수정
     */
    @PostMapping("/product/edit")
    @Transactional(rollbackFor = {RuntimeException.class, SQLException.class})
    public ResponseEntity<String> productEdit(ProductEntity productEntity, HttpSession session){

        String uploadPath = session.getServletContext().getRealPath("/uploads");
        List<FileEntity> newUploadedFiles = null;

        try{
            // 1) 새 파일 업로드
            newUploadedFiles = fileUploadProcess(productEntity.getFiles(), productEntity.getPId(), uploadPath);
            productService.fileListInsert(newUploadedFiles);

            // 2) 삭제할 파일 목록 조회
            List<FileEntity> delFiles = productService.fileIdSelect(productEntity.getDelFile());

            // 3) 파일 DB 삭제
            productService.fileDelete(productEntity.getDelFile());

            // 4) 실제 파일 삭제
            for(FileEntity f : delFiles){
                File delFile = new File(uploadPath, f.getFilename()+"."+f.getExtname());
                if(delFile.exists()) delFile.delete();
            }

            // 5) 상품 정보 수정
            productService.productUpdate(productEntity);

        } catch(Exception e){
            e.printStackTrace();
            TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
            return ResponseEntity.ok("FAIL");
        }

        return ResponseEntity.ok("OK");
    }

    /**
     * 상품 삭제
     */
    @DeleteMapping("/product/{id}")
    public String deleteProduct(@PathVariable("id") Integer id, HttpSession session){

        String uploadPath = session.getServletContext().getRealPath("/uploads");

        try {
            // 상품에 연결된 파일 리스트
            List<FileEntity> fileList = productService.fileListDelete(id);

            // 파일 삭제
            for(FileEntity f : fileList){
                File delFile = new File(uploadPath, f.getFilename()+"."+f.getExtname());
                if(delFile.exists()) delFile.delete();
            }

            // 상품 삭제
            productService.productDelete(id);

        } catch(Exception e){
            e.printStackTrace();
            return "FAIL";
        }

        return "OK";
    }
}