package com.finalproject.canvas.controller;

import com.finalproject.canvas.entity.PaskEntity;
import com.finalproject.canvas.repository.PaskRepository;
import com.finalproject.canvas.service.PaskService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/question")
@RequiredArgsConstructor
@Slf4j
public class PaskController {

    private final PaskService paskService;
    private final PaskRepository paskRepository; // 기업 조회를 위해 레포지토리 추가 - 대호

    // 문의 등록
    @PostMapping("/write")
    public ResponseEntity<?> writeAsk(
            @RequestParam Integer mId,
            @RequestParam Integer pId,
            @RequestParam Integer cId,
            @RequestParam String subject,
            @RequestParam String context
    ) {
        PaskEntity saved = paskService.saveAsk(mId, pId, cId, subject, context);
        return ResponseEntity.ok("ask saved");
    }

    // 특정 상품 문의 리스트
    @GetMapping("/list/{pId}")
    public ResponseEntity<?> getQuestionList(@PathVariable Integer pId) {
        return ResponseEntity.ok(
                paskService.getQuestionList(pId)
        );
    }


     // 기업용 고객 문의 조회 - 대호추가
    @Transactional(readOnly = true)
    @GetMapping("/seller/list")
    public List<PaskEntity> getSellerInquiries(@RequestParam("sellerId") String sellerId) {
        log.info("기업 판매자 [{}]의 고객 문의 관리 내역 요청 수신", sellerId);
        return paskRepository.findInquiriesBySeller(sellerId);
    }

    // 고객 문의사항에 답변 등록 및 수정하기 - 대호추가
    @Transactional
    @PutMapping("/seller/reply/{id}")
    public ResponseEntity<?> updateSellerReply(@PathVariable Integer id, @RequestBody Map<String, String> body) {
        String replyContent = body.get("reply");
        log.info("문의사항 번호 {}번에 답변 등록 요청: {}", id, replyContent);

        return paskService.updateSellerReply(id, replyContent)
                .map(updatedAsk -> ResponseEntity.ok().body("답변이 정상적으로 등록되었습니다."))
                .orElse(ResponseEntity.notFound().build());
    }

    // 일반 사용자 본인이 작성한 상품 문의 내역 전체 조회 - 대호 추가
    @Transactional(readOnly = true)
    @GetMapping("/user/list")
    public ResponseEntity<List<PaskEntity>> getUserInquiries(@RequestParam("mId") Integer mId) {
        log.info("일반 회원 일련번호 [{}]의 상품 문의 내역 요청 수신", mId);

        // Repository에 명명 규칙에 맞는 메서드가 이미 선언되어 있거나,
        // 없다면 paskRepository.findByMid(mId) 혹은 서비스단을 호출하여 회원이 작성한 리스트를 리턴합니다.
        List<PaskEntity> userInquiries = paskRepository.findByMemberId(mId);

        return ResponseEntity.ok(userInquiries);
    }
}
