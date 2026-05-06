import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
// Toast UI Editor
import { Editor } from '@toast-ui/react-editor'
import '@toast-ui/editor/dist/toastui-editor.css';
// 색상 플러그인
import colorSyntax from "@toast-ui/editor-plugin-color-syntax";
import "tui-color-picker/dist/tui-color-picker.css";
//import "@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css";
import "../../../node_modules/@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css";

import './../css/seul.css';

function AddProduct() {

        const [subject, setSubject] = useState(""); // 글제목
        const editorRef = useRef(null);

        // ✅ 등록 버튼
        const handleRegisterButton = () => {
                const editor = editorRef.current?.getInstance();
                if (!editor) return;

                const html = editor.getHTML();

                const markdown = editor.getMarkdown();

                console.log("HTML:", html);
                console.log("MARKDOWN:", markdown);

                const bbsData = {
                        joinsEntity: { id: sessionStorage.getItem("id") },
                        subject,
                        content: html,
                };
                console.log("등록할 데이터:", bbsData);
                if (bbsData.subject == '') {
                        alert("글제목을 입력하세요.");
                        return false;
                }
                if (bbsData.content == '' || bbsData.content == '<p><br></p>') {
                        alert("글내용을 입력하세요.");
                        return false;
                }
        }

        return (
                <div>
                        <div className="mb-3 mt-3">
                                <label htmlFor="subject" className="form-label">
                                        제목
                                </label>
                                <input
                                        type="text"
                                        name="subject"
                                        className="form-control"
                                        id="subject"
                                        placeholder="글제목"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                />
                        </div>

                        <div className="mb-3 mt-3">
                                <Editor
                                        ref={editorRef}
                                        initialValue=" "
                                        previewStyle="vertical"
                                        height="400px"
                                        initialEditType="wysiwyg"
                                        hideModeSwitch={true}
                                        useCommandShortcut={false}
                                        plugins={[colorSyntax]}
                                />
                        </div>

                        <div className="mb-3 mt-3 d-grid">
                                <input
                                        type="submit"
                                        value="뉴스등록"
                                        onClick={handleRegisterButton}
                                        className="btn btn-success btn-block"
                                />
                        </div>

                </div>
        )


}
export default AddProduct;