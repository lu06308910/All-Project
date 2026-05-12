import React, { useState, useRef } from "react";
import { Editor } from "@toast-ui/react-editor";


// 색상 플러그인
import "@toast-ui/editor/dist/toastui-editor.css";
import colorSyntax from "@toast-ui/editor-plugin-color-syntax";
import "tui-color-picker/dist/tui-color-picker.css";
import "@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css";

import "./../css/seul.css";

function NoticeWrite() {

        // 공통 input 스타일
        const inputStyle = {
                height: "38px",
                width: '100%'
        };

        // 카테고리
        const [category, setCategory] = useState("");
        const [subCategory, setSubCategory] = useState("");
        const categoryData = {
                "수납가구": ["책장", "수납장", "옷장"],
                "침대/매트리스": ["싱글 침대", "퀸 침대", "매트리스"],
                "소파/암체어": ["2인용 소파", "3인용 소파", "암체어"],
                "식탁/테이블/의자": ["식탁", "거실용 테이블", "의자"],
                "책상/사무용 의자": ["책상/컴퓨터 책상", "의자/사무실 의자", "책상/의자 세트"],
                "조명": ["일반 조명", "시스템 조명", "장식 조명"],
                "욕실": ["욕실 벽수납장", "욕실 세면대하부장", "욕실 거울"]
        };
        // 상품명
        const [subject, setSubject] = useState("");

        const editorRef = useRef();

        // 등록
        const handleRegisterButton = () => {

                const editor = editorRef.current?.getInstance();

                if (!editor) return;

                const html = editor.getHTML();

                const noticewriteData = {
                        joinsEntity: { id: sessionStorage.getItem("id") },
                        subject,
                        content: html,
                };

                console.log(productData);

                if (subject === "") {
                        alert("제목을 입력하세요.");
                        return false;
                }

                if (html === "" || html === "<p><br></p>") {
                        alert("공지 내용을 입력하세요.");
                        return false;
                }

                alert("등록 완료!");

                // 비동기 호출
                axios.post("http://localhost:9990/qna/noticewrite", noticewriteData)

                .then((response) => {
                        console.log("response.data", response.data);
                        if (response.data.id > 0) {
                                window.location.href = "/qna/noticelist"
                        }
                })
                .catch((error) => {
                        console.log("글등록 에러발생==>", error)
                })
        };
        return (
                <div
                        style={{
                                width: "900px",
                                margin: "80px auto",
                        }}
                >
                        {/* 제목 */}
                        <h2 style={{ textAlign: "center", fontWeight: "bold", marginBottom: "30px" }}>
                                공지사항 등록
                        </h2>

                        <hr />

                        {/* 제목 */}
                        <div className="mb-3 d-flex align-items-center gap-3">

                                <label style={{ width: "100px", fontWeight: "bold" }}>
                                        제목
                                </label>

                                <input
                                        type="text"
                                        className="form-control"
                                        style={inputStyle}
                                        placeholder="제목을 입력하세요."
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                />

                        </div>

                        {/* 에디터 */}
                        <div className="mt-4">

                                <Editor
                                        ref={editorRef}
                                        initialValue=" "
                                        height="600px"
                                        initialEditType="wysiwyg"
                                        hideModeSwitch={true}
                                        useCommandShortcut={false}
                                        plugins={[colorSyntax]}
                                />

                        </div>

                        {/* 등록 버튼 */}
                        <div style={{ textAlign: 'center', margin: '30px 0' }}>

                                <button
                                        className="btn btn-dark"
                                        style={{ padding: '10px 40px', borderRadius: '30px' }}
                                        onClick={handleRegisterButton}
                                >
                                        등록
                                </button>

                        </div>

                </div>
        )
}
export default NoticeWrite;