import React, { useState, useRef } from "react";
import { Editor } from "@toast-ui/react-editor";
import axios from "axios";

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

        const [subject, setSubject] = useState("");
        const editorRef = useRef();

        // 등록
        const handleRegisterButton = () => {
                const editor = editorRef.current?.getInstance();
                if (!editor) return;

                const html = editor.getHTML();

                // 백엔드 NoticeEntity 참고
                const noticeData = {
                        subject: subject,
                        context: html,
                };

                if (subject.trim() === "") {
                        alert("제목을 입력하세요.");
                        return false;
                }

                if (html === "" || html === "<p><br></p>") {
                        alert("공지 내용을 입력하세요.");
                        return false;
                }

                // 비동기 호출
                axios.post("http://192.168.4.60:9991/notice/write", noticeData)
                        .then((response) => {
                                console.log("등록 성공:", response.data);
                                if (response.status === 200 || response.data) {
                                        alert("공지사항이 등록되었습니다.");
                                        window.location.href = "/qna/noticelist";
                                }
                        })
                        .catch((error) => {
                                console.log("글등록 에러발생==>", error);
                                alert("등록 중 오류가 발생하였습니다.");
                        });
        };

        return (
                <div style={{width: "900px", margin: "80px auto"}}>
                        {/* 제목 */}
                        <h2 style={{ textAlign: "center", fontWeight: "bold", marginBottom: "30px" }}>
                                공지사항 등록
                        </h2>

                        <hr />

                        {/* 제목 */}
                        <div className="mb-3 d-flex align-items-center gap-3">
                                <label style={{ width: "100px", fontWeight: "bold" }}>제목</label>
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
                                <button className="btn btn-dark"
                                        style={{ padding: '10px 40px', borderRadius: '30px' }}
                                        onClick={handleRegisterButton}
                                >등록</button>
                        </div>
                </div>
        )
}
export default NoticeWrite;