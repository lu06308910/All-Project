package com.finalproject.canvas.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.finalproject.canvas.entity.CpDataEntity;
import com.finalproject.canvas.entity.FileEntity;
import com.finalproject.canvas.entity.ProductEntity;
import com.finalproject.canvas.service.ProductService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
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
    @PostMapping(value = "/mypage/addproduct", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public String productWrite(
            @ModelAttribute ProductEntity productEntity,
            @RequestParam("files") List<MultipartFile> files,
            @RequestParam("colors") String colorsJson,
            @RequestParam("size") String size,
            HttpSession session
    ){

        CpDataEntity cp = new CpDataEntity();
        cp.setCId(1);
        productEntity.setCompany(cp);

        String uploadPath = session.getServletContext().getRealPath("/uploads");
        List<FileEntity> fileEntities = null;

        try {

            // 1. 폴더 생성
            File uploadDir = new File(uploadPath);
            if (!uploadDir.exists()) uploadDir.mkdir();

            // 2. JSON 파싱 (딱 1번만!)
            ObjectMapper mapper = new ObjectMapper();

            List<Map<String, Object>> colors =
                    mapper.readValue(colorsJson, new TypeReference<List<Map<String, Object>>>() {});

            // 3. color DB 저장용 문자열
            productEntity.setColor(
                    String.join(",",
                            colors.stream()
                                    .map(c -> (String) c.get("colorName"))
                                    .toList()
                    )
            );

            // 4. size 저장
            productEntity.setSize(size);

            // 5. 상품 저장
            ProductEntity savedProduct = productService.productInsert(productEntity);

            // 6. 파일 + 색상 매칭
            fileEntities = fileUploadProcess(
                    files,
                    colors,
                    savedProduct.getPId(),
                    uploadPath
            );

            // 7. 파일 DB 저장
            productService.fileListInsert(fileEntities);

        } catch (Exception e) {
            e.printStackTrace();

            if (fileEntities != null) {
                for (FileEntity entity : fileEntities) {
                    File delFile = new File(uploadPath,
                            entity.getFilename() + "." + entity.getExtname());
                    if (delFile.exists()) delFile.delete();
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
    public List<FileEntity> fileUploadProcess(
            List<MultipartFile> fileList,
            List<Map<String, Object>> colors,
            Integer productId,
            String uploadPath
    ) throws Exception {

        List<FileEntity> uploadFiles = new ArrayList<>();
        for (int i = 0; i < fileList.size(); i++) {

            MultipartFile mf = fileList.get(i);
            Map<String, Object> color = colors.get(i);

            if (mf == null || mf.isEmpty()) continue;

            String colorName = (String) color.get("colorName");

            FileEntity fe = new FileEntity();

            fe.setColorName(colorName);

            String uploadFilename = mf.getOriginalFilename();
            int point = uploadFilename.lastIndexOf(".");

            String filename = uploadFilename.substring(0, point);
            String extname = uploadFilename.substring(point + 1);

            File f = new File(uploadPath, uploadFilename);

            // 중복 파일 처리
            if (f.exists()) {
                for (int num = 1; ; num++) {
                    String newFilename = filename + "(" + num + ")." + extname;
                    f = new File(uploadPath, newFilename);
                    if (!f.exists()) {
                        uploadFilename = newFilename;
                        break;
                    }
                }
            }

            mf.transferTo(f);

            int newPoint = uploadFilename.lastIndexOf(".");
            fe.setFilename(uploadFilename.substring(0, newPoint));
            fe.setExtname(uploadFilename.substring(newPoint + 1));
            fe.setSize((int) f.length());

            ProductEntity p = new ProductEntity();
            p.setPId(productId);
            fe.setProductEntity(p);

            uploadFiles.add(fe);
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

    @PostMapping("/product/edit")
    @Transactional(rollbackFor = {RuntimeException.class, SQLException.class})
    public ResponseEntity<String> productEdit(
            @ModelAttribute ProductEntity productEntity,
            @RequestParam("files") List<MultipartFile> files,
            @RequestParam("colors") String colorsJson,
            HttpSession session
    ){

        String uploadPath = session.getServletContext().getRealPath("/uploads");
        List<FileEntity> newUploadedFiles = null;

        try {

            // 1. 폴더 생성
            File uploadDir = new File(uploadPath);
            if (!uploadDir.exists()) uploadDir.mkdir();

            // 2. JSON → colors 변환
            ObjectMapper mapper = new ObjectMapper();

            List<Map<String, Object>> colors =
                    mapper.readValue(colorsJson, new TypeReference<List<Map<String, Object>>>() {});

            // 3. 상품 수정 (중요: insert 아님)
            productService.productUpdate(productEntity);

            // 4. 파일 업로드 + 색상 매칭
            newUploadedFiles = fileUploadProcess(
                    files,
                    colors,
                    productEntity.getPId(),
                    uploadPath
            );

            productService.fileListInsert(newUploadedFiles);

            // 5. 삭제 처리
            List<FileEntity> delFiles =
                    productService.fileIdSelect(productEntity.getDelFile());

            productService.fileDelete(productEntity.getDelFile());

            for (FileEntity f : delFiles) {
                File delFile = new File(uploadPath, f.getFilename() + "." + f.getExtname());
                if (delFile.exists()) delFile.delete();
            }

            return ResponseEntity.ok("OK");

        } catch (Exception e) {
            e.printStackTrace();
            TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
            return ResponseEntity.ok("FAIL");
        }
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