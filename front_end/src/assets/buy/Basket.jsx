import { Link, useNavigate } from 'react-router-dom';
import './../css/gayoung.css'
import React, { useEffect, useState } from "react";
import axios from 'axios';

function Basket() {

        const navigate = useNavigate();
        const [cartList, setCartList] = useState([]);

        // 로그인 사용자
        const mId = sessionStorage.getItem("mId");

        // 옵션변경 선택시 저장할 정보
        const [editCartId, setEditCartId] = useState(null);
        const [editColor, setEditColor] = useState("");
        const [editSize, setEditSize] = useState("");
        const [editCount, setEditCount] = useState(1);
        const openEdit = (item) => {
                setEditCartId(item.cartId);
                setEditColor(item.color);
                setEditSize(item.size);
                setEditCount(item.count); // ⭐ 이거 필수
        };

        // 옵션 변경 시 가격 계산 함수
        const calcPrice = (item, size) => {
                const base = Number(String(item.product?.price || 0).replace(/,/g, ''));

                const sizes = JSON.parse(item.product?.size || "[]");
                const selected = sizes.find(s => s.size === size);

                const extra = Number(selected?.price || 0);

                return base + extra;
        };



        //  장바구니 목록 DB에서 가져오기
        useEffect(() => {
                if (!mId) {
                        console.log("mId 없음");
                        return;
                }

                axios.get(`http://localhost:9990/cart/list/${mId}`)
                        .then(res => {
                                console.log("cart response:", res.data);


                                setCartList(res.data.map(item => ({
                                        ...item,

                                        sizes: JSON.parse(item.product?.size || "[]"), // 사이즈 정보 파싱

                                        newdelivery: item.price * item.count >= 50000 ? 0 : 3000,
                                        checked: false
                                })));
                        })
                        .catch(err => console.log(err));

        }, [mId]);

        // 장바구니 정보 DB에 변경한 값으로 update(옵션변경 기능)
        const updateCartItem = async ({
                item,
                color = item.color,
                size = item.size,
                count = item.count
        }) => {



                const safeCount = Number(count || 1);

                // 1. 원가
                const basePrice = Number(item.product?.price || 0);

                // 2. 사이즈 목록에서 새 사이즈 추가금 찾기
                const sizes = JSON.parse(item.product?.size || "[]");



                const selectedSize = sizes.find(s => s.size === size);
                const sizeExtra = Number(selectedSize?.price || 0);

                console.log("사이즈 추가금액:", sizeExtra);

                // 3. 단가 = 원가 + 사이즈 추가금
                const unitPrice = basePrice + sizeExtra;

                // 4. 총 금액
                const totalPrice = unitPrice * safeCount;
                console.log("총 금액:", totalPrice);

                // 5. 배송비
                const newDelivery = totalPrice >= 50000 ? 0 : 3000;

                try {
                        await axios.put(`http://localhost:9990/cart/update/${item.cartId}`, {
                                color,
                                size,
                                count: safeCount,
                                price: totalPrice
                        });

                        setCartList(prev =>
                                prev.map(c =>
                                        c.cartId === item.cartId
                                                ? {
                                                        ...c,
                                                        color,
                                                        size,
                                                        count: safeCount,
                                                        price: totalPrice,
                                                        newdelivery: newDelivery
                                                }
                                                : c
                                )
                        );

                        setEditCartId(null);
                        setEditColor("");
                        setEditSize("");
                        setEditCount(1);


                } catch (err) {
                        console.log(err);
                }
        };


        // 콤마 제거 후 숫자로 변환하는 함수
        const toNumber = (value) => {
                if (value === null || value === undefined) return 0;
                return Number(String(value).replace(/,/g, ""));
        };

        // 직접 입력 시 숫자만 허용하고 수정된 수치 상태 반영 및 유지
        const handleInputChange = (item, e) => {
                const value = e.target.value.replace(/[^0-9]/g, '');
                const newCount = value === '' ? 1 : Number(value);

                const price = calcPrice(item, item.size);

                setCartList(prev =>
                        prev.map(c =>
                                c.cartId === item.cartId
                                        ? {
                                                ...c,
                                                count: newCount,
                                                price,
                                                newdelivery: price * newCount >= 50000 ? 0 : 3000
                                        }
                                        : c
                        )
                );
        };



        // 1. 전체 선택/해제 핸들러
        const handleAllCheck = (e) => {
                const isChecked = e.target.checked;
                setCartList(prevList =>
                        prevList.map(item => ({ ...item, checked: isChecked }))
                );
        };

        // 2. 개별 체크 핸들러
        const handleSingleCheck = (id, e) => {
                const isChecked = e.target.checked;
                setCartList(prevList =>
                        prevList.map(item => item.cartId === id ? { ...item, checked: isChecked } : item)
                );
        };

        // 전체선택 버튼 클릭 시 호출할 함수
        const toggleAllCheck = () => {
                const isAllChecked = cartList.length > 0 && cartList.every(item => item.checked);

                setCartList(prevList =>
                        // 전체가 체크되어 있으면 모두 해제(false), 하나라도 비어있으면 모두 선택(true)
                        prevList.map(item => ({ ...item, checked: !isAllChecked }))
                );
        };

        //선택 후 삭제
        const deleteSelected = async () => {
                const selectedIds = cartList.filter(item => item.checked).map(item => item.cartId);
                const remainingItems = cartList.filter(item => !item.checked);

                if (selectedIds.length === 0) {
                        alert("삭제할 상품을 선택해 주세요.");
                        return;
                }

                if (window.confirm("선택한 상품을 장바구니에서 삭제하시겠습니까?")) {
                        try {
                                await axios.delete('http://localhost:9990/cart/delete', { data: selectedIds });
                                setCartList(remainingItems);
                        } catch (err) {
                                console.error("삭제 실패:", err);
                                alert("삭제 중 오류가 발생했습니다.");
                        }
                }
        }

        //선택상품 주문
        const handleBuySelected = () => {
                const selected = cartList.filter(item => item.checked);
                if (selected.length === 0) return alert('상품을 선택해주세요.');

                sessionStorage.setItem('buyItems', JSON.stringify(selected));
                navigate('/parchase');
        }

        // 단건 주문하기
        const handleBuySingle = (item) => {
                sessionStorage.setItem('buyItems', JSON.stringify([item]));
                navigate('/parchase');
        }


        // 전체상품 주문
        const handleBuyAll = () => {
                if (cartList.length === 0) return alert('장바구니가 비어있습니다.');

                sessionStorage.setItem('buyItems', JSON.stringify(cartList));
                navigate('/parchase');

        }
        const checkedItems = cartList.filter(item => item.checked);

        const totalProductPrice = checkedItems.reduce((acc, item) => {
                const price = Number(item?.price ?? 0);
                const discount = Number(item?.discount ?? 0);
                const delivery = Number(item?.newdelivery ?? 0);

                return acc + (price - discount + delivery);
        }, 0);

        const totalDelivery = checkedItems.reduce(
                (sum, item) => sum + (item.newdelivery || 0),
                0
        );

        const totalDiscount = checkedItems.reduce(
                (sum, item) => sum + (item.discount || 0),
                0
        );

        // 최종 결제 예정 금액
        const totalPayment = totalProductPrice - totalDiscount + totalDelivery;



        return (
                <>
                        <div className="footer-container" style={{ backgroundColor: 'white' }}>
                                <div>
                                        <h3 style={{ fontWeight: '600' }}>장바구니</h3>
                                        <div style={{ position: 'relative' }}>
                                                <div className='stepper-line-active' style={{ width: '25%' }}></div>
                                                <div className="stepper-container">
                                                        <div><span>●</span></div>
                                                        <div><span style={{ color: '#ccc' }}>●</span></div>
                                                        <div><span style={{ color: '#ccc' }}>●</span></div>
                                                </div>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-evenly', marginTop: '-40px' }}>
                                                <div>
                                                        <span>장바구니</span>
                                                </div>
                                                <div>
                                                        <span>주문결제</span>
                                                </div>
                                                <div>
                                                        <span>주문완료</span>
                                                </div>
                                        </div>
                                        <h4 style={{ textAlign: 'center', marginTop: '50px' }}>총 {cartList.length}개의 상품이 담겨 있습니다.</h4>
                                        <div style={{ marginTop: '50px', marginLeft: '30px' }}>
                                                <button className='button3' style={{ marginRight: '10px' }} onClick={toggleAllCheck}>
                                                        {cartList.length > 0 && cartList.every(item => item.checked) ? '전체 해제' : '전체 선택'}
                                                </button>
                                                <button className='button3' onClick={deleteSelected}>선택 삭제</button>
                                        </div>
                                        <hr />
                                        <h5 style={{ margin: '20px 30px' }}>장바구니 상품 ({checkedItems.length})</h5>
                                        <table style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse', marginTop: '20px' }}>
                                                <thead style={{ height: '50px' }}>
                                                        <tr>
                                                                <th style={{ backgroundColor: '#eeeeee', width: '10%', textAlign: 'center' }}>
                                                                        <input
                                                                                type="checkbox" aria-label="전체 선택" style={{ accentColor: "gray" }}
                                                                                checked={cartList.length > 0 && cartList.every(item => item.checked)}
                                                                                onChange={handleAllCheck}
                                                                        />
                                                                </th>
                                                                <th style={{ backgroundColor: '#eeeeee', width: '40%', textAlign: 'center' }}>상품명/옵션정보</th>
                                                                <th style={{ backgroundColor: '#eeeeee', width: '10%', textAlign: 'center' }}>수량</th>
                                                                <th style={{ backgroundColor: '#eeeeee', width: '10%', textAlign: 'center' }}>가격</th>
                                                                <th style={{ backgroundColor: '#eeeeee', width: '10%', textAlign: 'center' }}>배송비</th>
                                                                <th style={{ backgroundColor: '#eeeeee', width: '10%', textAlign: 'center' }}>최종구매가</th>
                                                                <th style={{ backgroundColor: '#eeeeee', width: '10%', textAlign: 'center' }}>주문관리</th>
                                                        </tr>
                                                </thead>
                                                {cartList.length == 0 ? (
                                                        <tbody>
                                                                <tr>
                                                                        <td colSpan="8" style={{ textAlign: 'center', padding: '50px 0', color: '#888' }}>
                                                                                장바구니에 담긴 상품이 없습니다.
                                                                        </td>
                                                                </tr>
                                                        </tbody>
                                                ) : (
                                                        cartList.map((item) => (


                                                                <tbody key={item.cartId}>
                                                                        <tr>
                                                                                <td style={{ width: '10%', textAlign: 'center' }}>
                                                                                        <input type="checkbox" aria-label="항목 선택" style={{ accentColor: "gray" }}
                                                                                                checked={item.checked} // 각 아이템의 상태 연결
                                                                                                onChange={(e) => handleSingleCheck(item.cartId, e)}
                                                                                        />
                                                                                </td>
                                                                                <td style={{ width: '40%' }}>
                                                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '20px' }}>
                                                                                                <img src={item.product.fileList?.[0]
                                                                                                        ? `http://localhost:9990/upload/${item.product.fileList[0].filename}.${item.product.fileList[0].extname}`
                                                                                                        : "/no-image.png"
                                                                                                }
                                                                                                        className='img-basket' alt="제품" />

                                                                                                <div
                                                                                                        style={{
                                                                                                                display: 'flex',
                                                                                                                flexDirection: 'column',
                                                                                                                gap: '6px',
                                                                                                                flex: 1,
                                                                                                                minWidth: 0
                                                                                                        }}
                                                                                                >
                                                                                                        {/* 상품명 버튼 */}
                                                                                                        <button
                                                                                                                className='button3'
                                                                                                                style={{
                                                                                                                        width: 'fit-content',
                                                                                                                        maxWidth: '90%',
                                                                                                                        overflow: 'hidden',
                                                                                                                        textOverflow: 'ellipsis',
                                                                                                                        whiteSpace: 'nowrap',
                                                                                                                        display: 'block',
                                                                                                                        fontWeight: '600',
                                                                                                                }}
                                                                                                                onClick={() => navigate(`/productDetail/${item.product.pid}`)}
                                                                                                        >
                                                                                                                {item.product.name}
                                                                                                        </button>

                                                                                                        {/* 옵션 + 옵션변경 */}
                                                                                                        <div style={{ fontSize: '14px', color: '#555' }}>
                                                                                                                <span>{item.color} / {item.size || "옵션 없음"}</span>
                                                                                                                <span
                                                                                                                        style={{
                                                                                                                                marginLeft: '8px',
                                                                                                                                color: '#007bff',
                                                                                                                                cursor: 'pointer',
                                                                                                                                textDecoration: 'underline'
                                                                                                                        }}
                                                                                                                        onClick={() => openEdit(item)}
                                                                                                                >
                                                                                                                        옵션변경
                                                                                                                </span>
                                                                                                                {/* 옵션변경 클릭시 */}
                                                                                                                {editCartId === item.cartId && (
                                                                                                                        <div
                                                                                                                                style={{
                                                                                                                                        display: 'flex',
                                                                                                                                        flexDirection: 'column',
                                                                                                                                        gap: '12px',
                                                                                                                                        marginTop: '10px',
                                                                                                                                        padding: '15px',
                                                                                                                                        border: '1px solid #ddd',
                                                                                                                                        borderRadius: '10px',
                                                                                                                                        backgroundColor: '#fafafa'
                                                                                                                                }}
                                                                                                                        >

                                                                                                                                {/* 옵션 영역 */}
                                                                                                                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>

                                                                                                                                        <select
                                                                                                                                                value={editColor}
                                                                                                                                                onChange={(e) => setEditColor(e.target.value)}
                                                                                                                                                style={{
                                                                                                                                                        padding: '6px',
                                                                                                                                                        borderRadius: '6px',
                                                                                                                                                        border: '1px solid #ccc'
                                                                                                                                                }}
                                                                                                                                        >
                                                                                                                                                <option value="">색상 선택</option>
                                                                                                                                                {item.product.color.split(",").map((c, i) => (
                                                                                                                                                        <option key={i} value={c}>{c}</option>
                                                                                                                                                ))}
                                                                                                                                        </select>

                                                                                                                                        <select
                                                                                                                                                value={editSize}
                                                                                                                                                onChange={(e) => setEditSize(e.target.value)}
                                                                                                                                                style={{
                                                                                                                                                        padding: '6px',
                                                                                                                                                        borderRadius: '6px',
                                                                                                                                                        border: '1px solid #ccc'
                                                                                                                                                }}
                                                                                                                                        >

                                                                                                                                                <option value="">사이즈 선택</option>

                                                                                                                                                {/* 실제 옵션 */}
                                                                                                                                                {JSON.parse(item.product.size || "[]").map((s, i) => (
                                                                                                                                                        <option key={i} value={s.size}>
                                                                                                                                                                {s.size} {s.price ? `( +${s.price}원 )` : ""}
                                                                                                                                                        </option>
                                                                                                                                                ))}
                                                                                                                                        </select>

                                                                                                                                </div>

                                                                                                                                {/* 수량 + 버튼 */}
                                                                                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>

                                                                                                                                        <button
                                                                                                                                                onClick={() => setEditCount(prev => Math.max(1, prev - 1))}
                                                                                                                                                style={{
                                                                                                                                                        width: '28px',
                                                                                                                                                        height: '28px',
                                                                                                                                                        border: '1px solid #ccc',
                                                                                                                                                        backgroundColor: 'white',
                                                                                                                                                        cursor: 'pointer'
                                                                                                                                                }}
                                                                                                                                        >
                                                                                                                                                -
                                                                                                                                        </button>

                                                                                                                                        <input
                                                                                                                                                value={editCount}
                                                                                                                                                onChange={(e) => {
                                                                                                                                                        const value = e.target.value.replace(/[^0-9]/g, '');
                                                                                                                                                        setEditCount(value === '' ? 1 : Number(value));
                                                                                                                                                }}
                                                                                                                                                style={{
                                                                                                                                                        width: '50px',
                                                                                                                                                        textAlign: 'center',
                                                                                                                                                        border: '1px solid #ccc',
                                                                                                                                                        padding: '4px'
                                                                                                                                                }}
                                                                                                                                        />

                                                                                                                                        <button
                                                                                                                                                onClick={() => setEditCount(prev => prev + 1)}
                                                                                                                                                style={{
                                                                                                                                                        width: '28px',
                                                                                                                                                        height: '28px',
                                                                                                                                                        border: '1px solid #ccc',
                                                                                                                                                        backgroundColor: 'white',
                                                                                                                                                        cursor: 'pointer'
                                                                                                                                                }}
                                                                                                                                        >
                                                                                                                                                +
                                                                                                                                        </button>

                                                                                                                                </div>

                                                                                                                                {/* 버튼 영역 */}
                                                                                                                                <div style={{ display: 'flex', gap: '8px' }}>

                                                                                                                                        <button
                                                                                                                                                onClick={() =>
                                                                                                                                                        updateCartItem({
                                                                                                                                                                item,
                                                                                                                                                                color: editColor,
                                                                                                                                                                size: editSize,
                                                                                                                                                                count: editCount
                                                                                                                                                        })
                                                                                                                                                }
                                                                                                                                                style={{
                                                                                                                                                        flex: 1,
                                                                                                                                                        backgroundColor: 'black',
                                                                                                                                                        color: 'white',
                                                                                                                                                        padding: '8px',
                                                                                                                                                        borderRadius: '6px',
                                                                                                                                                        border: 'none',
                                                                                                                                                        cursor: 'pointer'
                                                                                                                                                }}
                                                                                                                                        >
                                                                                                                                                저장
                                                                                                                                        </button>

                                                                                                                                        <button
                                                                                                                                                onClick={() => setEditCartId(null)}
                                                                                                                                                style={{
                                                                                                                                                        flex: 1,
                                                                                                                                                        backgroundColor: '#ccc',
                                                                                                                                                        color: 'black',
                                                                                                                                                        padding: '8px',
                                                                                                                                                        borderRadius: '6px',
                                                                                                                                                        border: 'none',
                                                                                                                                                        cursor: 'pointer'
                                                                                                                                                }}
                                                                                                                                        >
                                                                                                                                                취소
                                                                                                                                        </button>

                                                                                                                                </div>

                                                                                                                        </div>
                                                                                                                )}
                                                                                                        </div>
                                                                                                </div>
                                                                                        </div>
                                                                                </td>
                                                                                <td style={{ width: '10%', textAlign: 'center', verticalAlign: 'middle' }}>
                                                                                        {item.count}
                                                                                </td>
                                                                                <td style={{ width: '10%', textAlign: 'center' }}>
                                                                                        {Number(String(item.price).replace(/,/g, '')).toLocaleString()}원
                                                                                </td>

                                                                                <td style={{ width: '10%', textAlign: 'center' }}>
                                                                                        {Number(item.newdelivery || 0).toLocaleString()}원
                                                                                </td>

                                                                                <td style={{ width: '10%', textAlign: 'center' }}>
                                                                                        {(
                                                                                                Number(item.price || 0) +
                                                                                                Number(item.newdelivery || 0)
                                                                                        ).toLocaleString()}원
                                                                                </td>
                                                                                <td style={{ width: '10%', textAlign: 'center' }}>
                                                                                        <button className='button3' style={{ backgroundColor: 'black', color: 'white' }}
                                                                                                onClick={() => handleBuySingle(item)}
                                                                                        >
                                                                                                구매하기
                                                                                        </button>
                                                                                </td>
                                                                        </tr>

                                                                </tbody>
                                                        ))
                                                )}
                                        </table>
                                        <hr style={{ width: '100%' }} />
                                        <div style={{ textAlign: 'center', backgroundColor: '#eeeeee', padding: '20px 0px' }}>
                                                <h5 style={{ fontWeight: '600' }}>
                                                        <span style={{ marginLeft: '10px' }}>
                                                                {cartList
                                                                        .reduce((acc, item) => {
                                                                                const price = Number(item?.price ?? 0);
                                                                                const discount = Number(item?.discount ?? 0);
                                                                                const delivery = Number(item?.newdelivery ?? 0);

                                                                                return acc + (price - discount + delivery);
                                                                        }, 0)
                                                                        .toLocaleString()} 원
                                                        </span>
                                                </h5>
                                        </div>
                                </div>
                                <hr />
                                <div className="row" style={{ textAlign: 'center' }}>
                                        <div className="col">총 판매가</div>
                                        <div className="col">총 할인금액</div>
                                        <div className="col">총 배송비</div>
                                        <div className="col">총 결제예정 금액</div>
                                </div>
                                <hr />
                                <div className="row" style={{ textAlign: 'center', margin: '50px 0px', fontWeight: '600' }}>
                                        <div className="col">
                                                {totalProductPrice.toLocaleString()}원
                                        </div>
                                        <div className="col">
                                                {totalDiscount > 0 ? `-${totalDiscount.toLocaleString()}원` : '0원'}

                                        </div>
                                        <div className="col">
                                                {totalDelivery.toLocaleString()}원

                                        </div>
                                        <div className="col">
                                                {totalPayment.toLocaleString()}원
                                        </div>
                                </div>
                                <hr />
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginTop: '30px' }}>
                                        <button onClick={handleBuySelected} className='button3'
                                                style={{ backgroundColor: 'black', color: 'white', width: '150px' }}>
                                                선택상품주문
                                        </button>
                                        <button onClick={handleBuyAll} className='button3'
                                                style={{ backgroundColor: '#CEB99C', color: 'white', width: '150px', border: '1px solid #CEB99C' }}>
                                                전체상품주문
                                        </button>
                                </div>
                                <div style={{ backgroundColor: '#eeeeee', padding: '50px', marginTop: '30px' }}>
                                        <span style={{ fontWeight: '600' }}>장바구니 유의사항</span>
                                        <span style={{ whiteSpace: 'pre-wrap', display: 'block', lineHeight: '1.6' }}>
                                                • 장바구니 내 상품은 최대 60일까지 유지되며 100개까지 담으실 수 있습니다.
                                        </span>
                                        <span style={{ whiteSpace: 'pre-wrap', display: 'block', lineHeight: '1.6' }}>
                                                • 1개 상품 당 최대 구매 가능 개수는 99개입니다.
                                        </span>
                                        <span style={{ whiteSpace: 'pre-wrap', display: 'block', lineHeight: '1.6' }}>
                                                • 장바구니의 상품별 할인금액은 ‘미리 계산된 가격’입니다. 주문서에서의 쿠폰 변경 시 실제 가격은 달라질 수 있습니다.
                                        </span>
                                        <span style={{ whiteSpace: 'pre-wrap', display: 'block', lineHeight: '1.6', color: 'red' }}>
                                                • 패키지 상품의 경우 가격할인에 따른 조건이 있으니 삭제 시 주의하시기 바랍니다.
                                        </span>
                                        <span style={{ whiteSpace: 'pre-wrap', display: 'block', lineHeight: '1.6', color: 'red' }}>
                                                • 패키지 상품 구매 후 고객 변심의 의한 부분취소 및 반품이 불가능합니다.
                                        </span>
                                        <span style={{ whiteSpace: 'pre-wrap', display: 'block', lineHeight: '1.6' }}>
                                                • 수량변경 시 원하는 수량 조절하면 자동으로 반영되고, 반영 시 결정금액도 수량에 맞추어 변경됩니다.
                                        </span>
                                        <span style={{ whiteSpace: 'pre-wrap', display: 'block', lineHeight: '1.6' }}>
                                                • 옵션변경은 옵션이 있는 상품이 있을 시 노출되며, 선택 시 원하는 옵션으로 변경하실 수 있습니다.
                                        </span>
                                        <span style={{ whiteSpace: 'pre-wrap', display: 'block', lineHeight: '1.6', color: 'red' }}>
                                                • 사은품의 선택은 주문서에서 가능합니다. (※CanVas 관련 상품은 제외)
                                        </span>
                                        <span style={{ whiteSpace: 'pre-wrap', display: 'block', lineHeight: '1.6' }}>
                                                • 배송비는 주문서에서 통합 적용됩니다.
                                        </span>
                                        <span style={{ whiteSpace: 'pre-wrap', display: 'block', lineHeight: '1.6' }}>
                                                • 배송시간은 택배사 사정에 의해 특정시간으로 지정하실 수 없습니다.
                                        </span>
                                </div>
                        </div>
                </>
        );
}

export default Basket;