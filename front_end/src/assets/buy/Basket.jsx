import './../css/gayoung.css'
import React, { useState } from "react";

function Basket() {
        const [count, setCount] = useState(1); // 기본 수량 1

        // 버튼 클릭 시 수량 조절
        const [cartList, setCartList] = useState([
                { id: 1, name: '제품명길게썼을때잘리는지안잘리는지테스트얼마나길게써야잘리는지확인하기어디까지길어지는거예요', price: 3089000, count: 1 , newdelivery:3000, checked: false, discount:0 },
                { id: 2, name: '제품명길게썼을때잘리는지테스트시도는성공했는데제대로적용이되는지주기적으로확인해야함', price: 1500000, count:1, newdelivery:3000, checked: false, discount:0}
        ]);

        // 직접 입력 시 숫자만 허용하고 수정된 수치 상태 반영 및 유지
        const handleInputChange = (id, e) => {
                const value = e.target.value.replace(/[^0-9]/g, '');
                const newCount = value === '' ? 1 : parseInt(value);
                
                setCartList(prevList => 
                        prevList.map(item => {
                        if (item.id === id) {
                                const currentCount = newCount === 0 ? 1 : newCount; // 최종 계산은 최소 1로
                                const newDelivery = (item.price * currentCount >= 50000) ? 0 : 3000;
                                return { ...item, count: newCount, newdelivery: newDelivery };
                        }
                        return item;
                        })
                );
        };

        // 특정 상품의 수량을 변경하는 함수
        const updateCount = (id, delta) => {
                setCartList(prevList => 
                        prevList.map(item => {
                        if (item.id === id) {
                                const newCount = Math.max(1, item.count + delta);
                                const updatedDelivery = (item.price * newCount < 50000) ? 3000 : 0;
                                return { ...item, count: newCount, newdelivery: updatedDelivery };
                        }
                        return item;
                        })
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
                        prevList.map(item => item.id === id ? { ...item, checked: isChecked } : item)
                );
        };

        // 체크된 상품들만 합산
        const checkedItems = cartList.filter(item => item.checked);

        const totalProductPrice = checkedItems.reduce((sum, item) => sum + (item.price * item.count), 0);
        const totalDiscount = checkedItems.reduce((sum, item) => sum + (item.discount || 0), 0);
        const totalDelivery = checkedItems.reduce((sum, item) => sum + item.newdelivery, 0);

        // 최종 결제 예정 금액
        const totalPayment = totalProductPrice - totalDiscount + totalDelivery;

        return (
                <>
                        <div className="footer-container" style={{backgroundColor:'white'}}>
                                <div>
                                        <h3 style={{fontWeight:'600'}}>장바구니</h3>
                                        <div style={{ position: 'relative' }}>
                                        <div className='stepper-line-active' style={{ width: '25%' }}></div>
                                        <div className="stepper-container">
                                                <div><span>●</span></div>
                                                <div><span style={{ color: '#ccc' }}>●</span></div>
                                                <div><span style={{ color: '#ccc' }}>●</span></div>
                                                </div>
                                        </div>
                                        <div style={{display:'flex', justifyContent:'space-evenly', marginTop:'-40px'}}>
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
                                        <h4 style={{textAlign:'center', marginTop:'50px'}}>총 {checkedItems.length}개의 상품이 담겨 있습니다.</h4>
                                        <div style={{marginTop:'50px'}}>
                                                <button className='button3' style={{marginRight:'10px'}}>전체 선택</button>
                                                <button className='button3'>선택 삭제</button>
                                        </div>
                                        <hr/>
                                        <h5 style={{ margin:'20px 30px'}}>장바구니 상품 ({checkedItems.length})</h5>
                                        <table style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse', marginTop:'20px'}}>
                                                <thead style={{height:'50px'}}>
                                                        <tr>
                                                                <th style={{backgroundColor:'#eeeeee', width: '10%', textAlign:'center' }}>
                                                                        <input
                                                                                type="checkbox" aria-label="전체 선택" style={{accentColor: "gray"}}
                                                                                checked={cartList.length > 0 && cartList.every(item => item.checked)}
                                                                                onChange={handleAllCheck}
                                                                        />
                                                                </th>
                                                                <th style={{backgroundColor:'#eeeeee', width: '40%', textAlign:'center' }}>상품명/옵션정보</th>
                                                                <th style={{backgroundColor:'#eeeeee', width: '10%', textAlign:'center' }}>수량</th>
                                                                <th style={{backgroundColor:'#eeeeee', width: '10%', textAlign:'center' }}>가격</th>
                                                                <th style={{backgroundColor:'#eeeeee', width: '10%', textAlign:'center' }}>배송비</th>
                                                                <th style={{backgroundColor:'#eeeeee', width: '10%', textAlign:'center' }}>최종구매가</th>
                                                                <th style={{backgroundColor:'#eeeeee', width: '10%', textAlign:'center' }}>주문관리</th>
                                                        </tr>
                                                </thead>
                                        {cartList.map((item)=>(
                                                <tbody key={item.id}>
                                                        <tr>
                                                                <td style={{ width: '10%', textAlign:'center' }}>
                                                                        <input type="checkbox" aria-label="항목 선택" style={{accentColor: "gray"}}
                                                                        checked={item.checked} // 각 아이템의 상태 연결
                                                                        onChange={(e) => handleSingleCheck(item.id, e)}
                                                                        />
                                                                </td>
                                                                <td style={{ width: '40%'}}>
                                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                                                <img src='image/bed.jpeg' className='img-basket' alt="제품" />
                                                                                <div style={{ 
                                                                                        display: 'flex', flexDirection: 'column', gap: '4px', 
                                                                                        flex: 1, minWidth: 0
                                                                                }}>
                                                                                        <button className='button3' style={{
                                                                                                width: 'fit-content', maxWidth: '90%', overflow: 'hidden',
                                                                                                textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block'
                                                                                        }}>
                                                                                                {item.name}
                                                                                        </button>
                                                                                        <span
                                                                                        style={{overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box',
                                                                                        WebkitBoxOrient: 'vertical', WebkitLineClamp: 1, whiteSpace: 'normal',
                                                                                        height: '1.5em', fontWeight: '500', width:'90%'}}>
                                                                                                {item.name}
                                                                                        </span>
                                                                                        <div>
                                                                                                <span>제품옵션 </span>
                                                                                                <span>옵션변경</span>
                                                                                        </div>
                                                                                </div>
                                                                        </div>
                                                                </td>
                                                                <td style={{ width: '10%', textAlign: 'center', verticalAlign: 'middle' }}>
                                                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                                                {/* 마이너스 버튼 */}
                                                                                <button 
                                                                                        onClick={() => updateCount(item.id, -1)}
                                                                                        style={{ padding: '1px 7px', backgroundColor: 'white', cursor: 'pointer' }}
                                                                                >
                                                                                        -
                                                                                </button>

                                                                                {/* 수량 입력창 */}
                                                                                <input type="text" value={item.count} onChange={(e)=>handleInputChange(item.id, e)}
                                                                                style={{ 
                                                                                        width: '40px', padding: '1px 5px', border: '1px solid black', textAlign: 'center'
                                                                                }} 
                                                                                />

                                                                                {/* 플러스 버튼 */}
                                                                                <button 
                                                                                onClick={() => updateCount(item.id, 1)}
                                                                                style={{ padding: '1px 5px', backgroundColor: 'white', cursor: 'pointer' }}>
                                                                                        +
                                                                                </button>
                                                                        </div>
                                                                </td>
                                                                <td style={{ width: '10%', textAlign: 'center' }}>
                                                                        {item.price.toLocaleString()}원
                                                                </td>
                                                                <td style={{ width: '10%', textAlign: 'center' }}>
                                                                        {item.newdelivery.toLocaleString()}원
                                                                </td>
                                                                <td style={{ width: '10%', textAlign: 'center' }}>
                                                                        {(item.price * item.count + item.newdelivery).toLocaleString()}
                                                                </td>
                                                                <td style={{ width: '10%' , textAlign:'center' }}>
                                                                        <button className='button3' style={{backgroundColor:'black', color:'white'}}>구매하기</button>
                                                                </td>
                                                        </tr>
                                                        <hr style={{width:'100%'}}/>
                                                </tbody>
                                        ))}
                                        </table>
                                        <div style={{textAlign:'center', backgroundColor:'#eeeeee', padding:'20px 0px'}}>
                                                <h5 style={{ fontWeight: '600' }}>
                                                        <span style={{marginLeft: '10px' }}>
                                                        {totalPayment.toLocaleString()}원
                                                        </span>
                                                </h5>
                                        </div>
                                </div>
                                <hr/>
                                <div class="row" style={{textAlign:'center'}}>
                                        <div class="col">총 판매가</div>
                                        <div class="col">총 할인금액</div>
                                        <div class="col">총 배송비</div>
                                        <div class="col">총 결제예정 금액</div>
                                </div>
                                <hr/>
                                <div class="row" style={{textAlign:'center', margin:'50px 0px', fontWeight:'600'}}>
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
                                <hr/>
                                <div style={{display:'flex', justifyContent:'center', gap:'30px'}}>
                                        <button className='button3' style={{backgroundColor:'black', color:'white', width:'150px'}}>
                                                선택상품주문
                                        </button>
                                        <button className='button3' style={{backgroundColor:'#CEB99C', color:'white', width:'150px', border:'1px solid #CEB99C'}}>
                                                전체상품주문
                                        </button>
                                </div>
                        </div>
                </>
        );
}

export default Basket;