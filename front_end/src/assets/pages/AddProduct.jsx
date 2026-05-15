import React, { useState, useRef } from "react";
import axios from "axios";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";

// 색상 플러그인
import colorSyntax from "@toast-ui/editor-plugin-color-syntax";
import "tui-color-picker/dist/tui-color-picker.css";
import "@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css";

import "./../css/seul.css";

function AddProduct() {

        const fileRef = useRef(null);

        // 공통 input 스타일
        const inputStyle = {
                height: "38px",
                width: '70%'
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

        // 색상
        const [colorInput, setColorInput] = useState("");
        const [colorImg, setColorImg] = useState("");
        const [colors, setColors] = useState([]);
        const [colorFile, setColorFile] = useState(null);

        // 사이즈
        const [sizeInput, setSizeInput] = useState("");
        const [addPrice, setAddPrice] = useState("");
        const [sizes, setSizes] = useState([]);

        // 수량 / 가격
        const [count, setCount] = useState(0);
        const [price, setPrice] = useState("");

        const editorRef = useRef(null);

        // 색상 추가
        const handleAddColor = () => {

                if (!colorInput.trim()) return;
                if (!colorFile) return;

                const newColor = {
                        color: colorInput,
                        imgName: colorFile.name,
                        imgFile: colorFile,
                };

                setColors(prev => [...prev, newColor]);

                setColorInput("");
                setColorImg("");
                setColorFile(null);

        };

        // 색상 삭제
        const handleDeleteColor = (index) => {
                setColors(colors.filter((_, i) => i !== index));
        };

        // 사이즈 추가
        const handleAddSize = () => {
                if (sizeInput.trim() === "") return;

                const newSize = {
                        size: sizeInput,
                        price: addPrice,
                };

                setSizes([...sizes, newSize]);

                setSizeInput("");
                setAddPrice("");
        };

        // 사이즈 삭제
        const handleDeleteSize = (index) => {
                setSizes(sizes.filter((_, i) => i !== index));
        };

        const [files, setFiles] = useState([]); // ['a.gif','b.txt', 'c.exe']]
        // 첨부파일을 선택하면
        function handleFileChange(event) {
                setFiles(Array.from(event.target.files));
        }

        // 등록
        const handleRegisterButton = () => {

                const editor = editorRef.current?.getInstance();

                if (!editor) return;

                const html = editor.getHTML();

                const productData = {
                        category,
                        subCategory,
                        subject,
                        colors,
                        sizes,
                        count,
                        price,
                        content: html,
                };

                console.log(productData);

                if (subject === "") {
                        alert("상품명을 입력하세요.");
                        return;
                }

                if (price === "") {
                        alert("판매가를 입력하세요.");
                        return;
                }

                if (html === "" || html === "<p><br></p>") {
                        alert("상품 상세 내용을 입력하세요.");
                        return;
                }

                const hasFile = colors.some(c => c.imgFile);

                if (!hasFile) {
                        alert("첨부파일은 반드시 1개 이상이여야 합니다.");
                        return;
                }


                const formData = new FormData();

                formData.append("b_category", category);
                formData.append("s_category", subCategory);
                formData.append("name", subject);
                formData.append("context", html);
                formData.append("count", count);
                formData.append("price", price);
                formData.append("cId", 1);


                // 1️ 컬러 정보 (이미지 제외, JSON)
                formData.append(
                        "colors",
                        JSON.stringify(
                                colors.map(c => ({
                                        colorName: c.color
                                }))
                        )
                );


                // 2️ 이미지 파일 (순서 유지 중요)
                colors.forEach((c) => {
                        formData.append("files", c.imgFile);
                });


                formData.append(
                        "size",
                        JSON.stringify(sizes)
                );


                //  전송
                axios.post("http://localhost:9989/mypage/addproduct", formData)
                        .then((response) => {
                                console.log("response.data", response.data);

                                if (response.data === "OK") {
                                        alert('등록이 되었습니다.');
                                        window.history.back();
                                }
                        })
                        .catch((error) => {
                                console.log("글등록 에러발생==>", error);
                        });
        };

        return (
                <div
                        style={{
                                width: "900px",
                                margin: "80px auto",
                        }}
                >
                        <div
                                style={{
                                        width: "900px",
                                        margin: "80px auto",
                                }}
                        >

                                {/* 제목 */}
                                <h2
                                        style={{
                                                textAlign: "center",
                                                fontWeight: "bold",
                                                marginBottom: "30px",
                                        }}
                                >
                                        상품등록
                                </h2>

                                <hr />

                                {/* 카테고리 */}
                                <div className="mb-3 d-flex align-items-center gap-3">

                                        <label style={{ width: "100px", fontWeight: "bold" }}>
                                                카테고리
                                        </label>

                                        {/* 대분류 */}
                                        <select
                                                className="form-select b_category"
                                                style={{ width: "200px", height: "38px" }}
                                                value={category}
                                                onChange={(e) => {
                                                        setCategory(e.target.value);
                                                        setSubCategory(""); // 대분류 바뀌면 소분류 초기화
                                                }}
                                        >
                                                <option value="">대분류 선택</option>

                                                {Object.keys(categoryData).map((item, index) => (
                                                        <option key={index} value={item}>
                                                                {item}
                                                        </option>
                                                ))}
                                        </select>

                                        {/* 소분류 */}
                                        <select
                                                className="form-select s_category"
                                                style={{ width: "200px", height: "38px" }}
                                                value={subCategory}
                                                onChange={(e) => setSubCategory(e.target.value)}
                                        >
                                                <option value="">소분류 선택</option>

                                                {category &&
                                                        categoryData[category].map((item, index) => (
                                                                <option key={index} value={item}>
                                                                        {item}
                                                                </option>
                                                        ))}
                                        </select>

                                </div>

                                {/* 상품명 */}
                                <div className="mb-3 d-flex align-items-center gap-3">

                                        <label style={{ width: "100px", fontWeight: "bold" }}>
                                                상품명
                                        </label>

                                        <input
                                                type="text"
                                                className="form-control name"
                                                style={inputStyle}
                                                placeholder="상품명을 입력하세요."
                                                value={subject}
                                                onChange={(e) => setSubject(e.target.value)}
                                        />

                                </div>

                                {/* 색상 */}
                                <div className="mb-3">

                                        <div className="d-flex align-items-center gap-3">

                                                <label style={{ width: "100px", fontWeight: "bold" }}>
                                                        색상
                                                </label>

                                                {/* 색상명 */}
                                                <input
                                                        type="text"
                                                        className="form-control color"
                                                        style={{ width: "180px", height: "38px" }}
                                                        placeholder="상품 컬러 입력"
                                                        value={colorInput}
                                                        onChange={(e) => setColorInput(e.target.value)}
                                                />

                                                {/* 이미지 파일명 */}
                                                <input
                                                        type="text"
                                                        className="form-control img"
                                                        style={{ width: "220px", height: "38px" }}
                                                        placeholder="해당 이미지 등록"
                                                        value={colorImg}
                                                        readOnly
                                                />

                                                {/* 파일 선택 */}
                                                <label
                                                        className="btn btn-dark"
                                                        style={{
                                                                height: "38px",
                                                                lineHeight: "24px",
                                                                whiteSpace: "nowrap",
                                                                marginBottom: "0",
                                                        }}
                                                >
                                                        이미지찾기
                                                        <input
                                                                type="file"
                                                                hidden
                                                                onClick={(e) => (e.target.value = null)}
                                                                onChange={(e) => {
                                                                        const file = e.target.files[0];
                                                                        if (!file) return;

                                                                        setColorFile(file);
                                                                        setColorImg(file.name);
                                                                }}
                                                        />
                                                </label>

                                                {/* 색상 추가 버튼 */}
                                                <button
                                                        type="button"
                                                        className="btn btn-primary"
                                                        style={{ height: "38px", whiteSpace: "nowrap" }}
                                                        onClick={handleAddColor}
                                                >
                                                        색상 옵션 추가
                                                </button>

                                        </div>

                                        {/* 태그 출력 */}
                                        <div
                                                style={{
                                                        marginLeft: "115px",
                                                        marginTop: "10px",
                                                        display: "flex",
                                                        gap: "10px",
                                                        flexWrap: "wrap",
                                                }}
                                        >
                                                {colors.map((item, index) => (
                                                        <div
                                                                key={index}
                                                                style={{
                                                                        display: "flex",
                                                                        alignItems: "center",
                                                                        gap: "10px",
                                                                        backgroundColor: "#ddd",
                                                                        borderRadius: "20px",
                                                                        padding: "8px 14px",
                                                                        fontSize: "14px",
                                                                }}
                                                        >
                                                                <span>{item.color}</span>

                                                                {item.imgName && (
                                                                        <span style={{ color: "#555", fontSize: "13px" }}>
                                                                                ({item.imgName})
                                                                        </span>
                                                                )}

                                                                <span
                                                                        style={{
                                                                                cursor: "pointer",
                                                                                fontWeight: "bold",
                                                                        }}
                                                                        onClick={() => handleDeleteColor(index)}
                                                                >
                                                                        ×
                                                                </span>
                                                        </div>
                                                ))}
                                        </div>

                                </div>

                                {/* 사이즈 */}
                                <div className="mb-3">

                                        <div className="d-flex align-items-center gap-3">

                                                <label style={{ width: "100px", fontWeight: "bold" }}>
                                                        사이즈
                                                </label>

                                                <input
                                                        type="text"
                                                        className="form-control"
                                                        style={{ width: "220px", height: "38px" }}
                                                        placeholder="상품 사이즈 입력"
                                                        value={sizeInput}
                                                        onChange={(e) => setSizeInput(e.target.value)}
                                                />

                                                <input
                                                        type="text"
                                                        className="form-control"
                                                        style={{ width: "220px", height: "38px" }}
                                                        placeholder="추가 가격 입력"
                                                        value={addPrice}
                                                        onChange={(e) => setAddPrice(e.target.value)}
                                                />

                                                <span>원</span>

                                                <button
                                                        type="button"
                                                        className="btn btn-primary"
                                                        style={{ height: "38px", whiteSpace: "nowrap" }}
                                                        onClick={handleAddSize}
                                                >
                                                        크기 옵션 추가
                                                </button>

                                        </div>

                                        {/* 사이즈 태그 */}
                                        <div
                                                style={{
                                                        marginLeft: "115px",
                                                        marginTop: "10px",
                                                        display: "flex",
                                                        gap: "10px",
                                                        flexWrap: "wrap",
                                                }}
                                        >
                                                {sizes.map((item, index) => (
                                                        <div
                                                                key={index}
                                                                style={{
                                                                        display: "flex",
                                                                        alignItems: "center",
                                                                        gap: "10px",
                                                                        backgroundColor: "#eee",
                                                                        borderRadius: "20px",
                                                                        padding: "8px 14px",
                                                                        fontSize: "14px",
                                                                }}
                                                        >
                                                                <span>{item.size}</span>
                                                                {item.price && (
                                                                        <span style={{ fontSize: "13px", color: "#555" }}>
                                                                                (+{item.price}원)
                                                                        </span>
                                                                )}
                                                                <span
                                                                        onClick={() => handleDeleteSize(index)}
                                                                        style={{ cursor: "pointer", fontWeight: "bold" }}
                                                                >
                                                                        ×
                                                                </span>
                                                        </div>
                                                ))}
                                        </div>

                                </div>

                        </div>


                        {/* 상품수량 */}
                        <div className="mb-3 d-flex align-items-center gap-3">

                                <label style={{ width: "100px", fontWeight: "bold" }}>
                                        상품수량
                                </label>

                                <div
                                        style={{
                                                display: "flex",
                                                alignItems: "center",
                                                border: "1px solid #ccc",
                                                borderRadius: "5px",
                                                overflow: "hidden",
                                                width: "140px",
                                                height: "38px",
                                        }}
                                >

                                        <input
                                                type="text"
                                                value={count}
                                                onChange={(e) => setCount(Number(e.target.value))}
                                                style={{
                                                        width: "90px",
                                                        height: "100%",
                                                        border: "none",
                                                        textAlign: "center",
                                                        outline: "none",
                                                }}
                                        />

                                        <div
                                                style={{
                                                        width: "50px",
                                                        height: "100%",
                                                        borderLeft: "1px solid #ccc",
                                                        display: "flex",
                                                        flexDirection: "column",
                                                }}
                                        >

                                                <button
                                                        type="button"
                                                        onClick={() => setCount(Number(count) + 1)}
                                                        style={{
                                                                flex: 1,
                                                                border: "none",
                                                                background: "#f8f8f8",
                                                                fontSize: "12px",
                                                        }}
                                                >
                                                        ▲
                                                </button>

                                                <button
                                                        type="button"
                                                        onClick={() =>
                                                                setCount(count > 0 ? Number(count) - 1 : 0)
                                                        }
                                                        style={{
                                                                flex: 1,
                                                                border: "none",
                                                                borderTop: "1px solid #ccc",
                                                                background: "#f8f8f8",
                                                                fontSize: "12px",
                                                        }}
                                                >
                                                        ▼
                                                </button>

                                        </div>

                                </div>

                        </div>

                        {/* 판매가 */}
                        <div className="mb-4 d-flex align-items-center gap-3">

                                <label style={{ width: "100px", fontWeight: "bold" }}>
                                        판매가
                                </label>

                                <input
                                        type="text"
                                        className="form-control"
                                        style={{
                                                width: "300px",
                                                height: "38px",
                                        }}
                                        placeholder="가격을 입력하세요."
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                />

                                <span>원</span>

                        </div>

                        <hr />

                        {/* 에디터 */}
                        <div className="mt-4">

                                <h5 style={{ marginBottom: "15px" }}>
                                        상품 상세 내용
                                </h5>

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
        );
}

export default AddProduct;