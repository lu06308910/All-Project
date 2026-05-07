import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Parchase(){

        const [cartList, setCartList] = useState([
                        { id: 1, name: '제품명길게썼을때잘리는지안잘리는지테스트얼마나길게써야잘리는지확인하기어디까지길어지는거예요', price: 3089000, count: 1 , newdelivery:3000, checked: false, discount:0, option:'브라운원목60cm' },
                        { id: 2, name: '제품명길게썼을때잘리는지테스트시도는성공했는데제대로적용이되는지주기적으로확인해야함', price: 1500000, count:1, newdelivery:0, checked: false, discount:5000, option:'브라운원목60cm'}
        ]);

        const [formData, setFormData] = useState({
                userType: 'PERSONAL',
                userid: '',
                userpwd: '',
                pwdCheck: '',
                username: '',
                email: '',
                tel: '',
                zipcode: '',
                address: '',
                address_detail: '',
                businessName: '',
                businessNum: ''
        });

        const totalProductPrice = cartList.reduce((sum, item) => sum + (item.price * item.count), 0);
        const totalDiscount = cartList.reduce((sum, item) => sum + (item.discount || 0), 0);
        const totalDelivery = cartList.reduce((sum, item) => sum + item.newdelivery, 0);

        // 최종 결제 예정 금액
        const totalPayment = totalProductPrice - totalDiscount + totalDelivery;

        // 주소입력창 라디오버튼 상태 확인 변수
        const [isAddressEditable, setIsAddressEditable] = useState(false);

        // 직접 요청사항 변수
        const [isDirectInput, setIsDirectInput] = useState(false);
        const [deliveryMsg, setDeliveryMsg] = useState("");
        
        // 요청사항 핸들러
        const handleSelectChange = (e) => {
        if (e.target.value === "direct") {
                setIsDirectInput(true);
        } else {
                setIsDirectInput(false);
                setDeliveryMsg(""); // 다른 옵션 선택 시 입력 내용 초기화
        }
        };

        // 라디오 버튼 변경 핸들러
        const handleRadioChange = (e) => {
                const { value } = e.target;

                if (value === "new") {
                        setIsAddressEditable(true);
                } else {
                        setIsAddressEditable(false);
                }
        };

        // ── 카카오 우편번호 API 실행 함수 ──
        const handleAddressSearch = () => {
                if (!isAddressEditable) {
                        alert("배송지 선택을 먼저 해주세요.");
                        return;
                }
                new window.daum.Postcode({
                        oncomplete: function (data) {
                                let fullAddr = data.address;
                                let extraAddr = '';

                                if (data.userSelectedType === 'R') {
                                        if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) extraAddr += data.bname;
                                        if (data.buildingName !== '' && data.apartment === 'Y') {
                                                extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                                        }
                                        fullAddr += (extraAddr !== '' ? ` (${extraAddr})` : '');
                                }

                                setFormData(prev => ({
                                        ...prev,
                                        zipcode: data.zonecode,
                                        address: fullAddr
                                }));

                                // 주소 입력 후 상세주소 칸으로 이동
                                document.getElementsByName('address_detail')[0].focus();
                        }
                }).open();
        };

        const handleChange = (e) => {
                const { name, value } = e.target;
                setFormData(prev => ({
                        ...prev,
                        [name]: value
                }));
        };


        return(
                <>
                        <div className="footer-container" style={{backgroundColor:'white'}}>
                                <div>
                                        <h3 style={{fontWeight:'600'}}>결제 진행</h3>
                                        <div style={{ position: 'relative' }}>
                                        <div className='stepper-line-active' style={{ width: '50%' }}></div>
                                        <div className="stepper-container">
                                                <div><span>●</span></div>
                                                <div><span>●</span></div>
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
                                        <h4 style={{textAlign:'center', marginTop:'50px'}}>총 {cartList.length}개의 상품이 담겨 있습니다.</h4>
                                </div>
                                <hr style={{border:'2px solid black', marginTop:'60px', opacity: 1}}/>
                                <div class="row" style={{marginLeft:'30px', marginBottom:'-5px', marginTop:'-5px', textAlign:'center'}}>
                                        <div class="col-7">상품 정보</div>
                                        <div class="col-1">수량</div>
                                        <div class="col-2">상품 금액</div>
                                        <div class="col-2">배송 정보</div>
                                </div>
                                <hr />
                                <div style={{marginLeft:'40px', marginTop:'-5px', marginBottom:'-15px'}}>
                                        <span>
                                                배송건수({cartList.length})
                                        </span>
                                        <span style={{color:'#eeeee', marginLeft:'10px', fontSize:'0.8em'}}>
                                                배송/설치일 지정 가능
                                        </span>
                                </div>
                                <hr style={{border:'1px solid black', marginTop:'30px', opacity: 1}}/>
                                {cartList.map((item)=>(
                                        <table style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse', marginTop:'20px'}}>
                                                <tbody key={item.id}>
                                                        <tr>
                                                                <td style={{ width: '45%'}}>
                                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                                                <img src='image/bed.jpeg' className='img-basket' alt="제품" />
                                                                                <div style={{ 
                                                                                        display: 'flex', flexDirection: 'column', gap: '4px', 
                                                                                        flex: 1, minWidth: 0
                                                                                }}>
                                                                                        <span
                                                                                        style={{overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box',
                                                                                        WebkitBoxOrient: 'vertical', WebkitLineClamp: 1, whiteSpace: 'normal',
                                                                                        height: '1.5em', fontWeight: '500', width:'90%'}}>
                                                                                                {item.name}
                                                                                        </span>
                                                                                        <div>
                                                                                                <span>{item.option}</span>
                                                                                        </div>
                                                                                </div>
                                                                        </div>
                                                                </td>
                                                                <td style={{ width: '5%', textAlign: 'center', verticalAlign: 'middle' }}>
                                                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                                                {item.count}
                                                                        </div>
                                                                </td>
                                                                <td style={{ width: '15%'}}>
                                                                        <div style={{display:'flex', flexDirection: 'column',
                                                                                justifyContent: 'center', textAlign:'center'
                                                                        }}>
                                                                                <span style={{fontWeight:'600'}}>
                                                                                        {(item.price * item.count - item.discount).toLocaleString()}원
                                                                                </span>
                                                                                <span style={{textDecoration:'line-through', color:'gray'}}>
                                                                                        {(item.price * item.count).toLocaleString()}원    
                                                                                </span>
                                                                        </div>
                                                                </td>
                                                                {item.newdelivery==0?(
                                                                        <td style={{ width: '10%', textAlign: 'center'}}>
                                                                                <div style={{display:'flex', flexDirection: 'column',
                                                                                        justifyContent: 'center', textAlign:'center'}}>
                                                                                        <span style={{color:'blue', fontWeight:'600'}}>무료배송</span>
                                                                                        <span style={{fontSize:'0.7em', fontWeight:'600'}}>지역별/옵션별 배송비 추가</span>
                                                                                        <span style={{fontSize:'0.7em', textDecoration:'underline', color:'#cccc'}}>지역별 배송비</span>
                                                                                </div>
                                                                                
                                                                        </td>
                                                                ):(     
                                                                        <td style={{ width: '10%', textAlign: 'center' }}>
                                                                                {item.newdelivery.toLocaleString()}원
                                                                        </td>
                                                                )}
                                                                
                                                        </tr>
                                                        <hr style={{width:'100%'}}/>
                                                </tbody>
                                        </table>
                                ))}
                                <span style={{fontSize:'0.8em', color:'#cccccc'}}>
                                        *배송일자 선택(배송일 예약) 가능 상품만 배송일 지정이 가능합니다. 단, 제주지역과 무통장입금의 경우에는 해당되지 않습니다.
                                </span>
                                <hr style={{border:'2px solid black', marginTop:'60px', opacity: 1}}/>
                                <div class="row" style={{marginLeft:'30px', marginBottom:'-5px', marginTop:'-5px', textAlign:'center'}}>
                                        <div class="col-3">총 상품금액</div>
                                        <div class="col-3">총 할인금액</div>
                                        <div class="col-3">총 배송비</div>
                                        <div class="col-3">총 결제금액</div>
                                </div>
                                <hr />
                                <div style={{marginLeft:'30px', marginBottom:'80px',
                                        marginTop:'80px', textAlign:'center', fontWeight:'600',
                                        display:'flex', justifyContent: 'space-evenly'
                                }}>
                                        <div>{totalProductPrice.toLocaleString()}원</div>
                                        <div style={{display:'flex', justifyContent: 'center',
                                                borderRadius:'50px', backgroundColor:'#eeeeee',
                                                width:'20px', height:'20px', alignItems: 'center'}}
                                        >-</div>
                                        <div>{totalDiscount.toLocaleString()}</div>
                                        <div style={{display:'flex', justifyContent: 'center',
                                                borderRadius:'50px', backgroundColor:'#eeeeee',
                                                width:'20px', height:'20px', alignItems: 'center'}}
                                        >+</div>
                                        <div>{totalDelivery.toLocaleString()}</div>
                                        <div style={{display:'flex', justifyContent: 'center',
                                                borderRadius:'50px', backgroundColor:'#eeeeee',
                                                width:'20px', height:'20px', alignItems: 'center'}}
                                        >=</div>
                                        <div>{totalPayment.toLocaleString()}원</div>
                                </div>
                                <hr />
                                <div style={{
                                        display:'flex', flexDirection: 'row',
                                        flexWrap: 'nowrap', justifyContent: 'space-between',
                                        alignItems:'center', boxSizing:'border-box', width: '100%',
                                        color:'#cccc'
                                }}>
                                        <div style={{ flex: 1, textAlign: 'center' }}>
                                                상품금액{'\u2003'}{'\u2003'}{totalProductPrice.toLocaleString()}원
                                        </div>
                                        <div className='v-line' style={{ borderLeft: '1px solid #ccc', height: '20px', flexShrink: 0 }}></div>
                                        <div style={{ flex: 1, textAlign: 'center' }}>
                                                기본할인{'\u2003'}{'\u2003'}{totalDiscount.toLocaleString()}원
                                        </div>
                                        <div className='v-line' style={{ borderLeft: '1px solid #ccc', height: '20px', flexShrink: 0 }}></div>
                                        <div style={{ flex: 1, textAlign: 'center' }}>
                                                배송비{'\u2003'}{'\u2003'}{totalDelivery.toLocaleString()}원
                                        </div>
                                </div>
                                <hr/>
                                <div style={{textDecoration:'underline', textAlign:'right'}}>주문 취소</div>
                                <div style={{backgroundColor:'#EDEDED', padding:'40px'}}>
                                        <div style={{padding:'40px', backgroundColor:'white', borderRadius:'20px'}}>
                                                <div style={{display:'flex'}}>
                                                        <h4 style={{fontWeight:'600', color:'red'}}>*</h4>
                                                        <h4 style={{fontWeight:'600'}}>배송지 입력</h4>
                                                </div>
                                                <hr />
                                                <div style={{marginLeft:'40px'}}>
                                                        {/* 주소 필드 */}
                                                        <div>
                                                                <div style={{display:'flex', justifyContent: 'left', alignItems: 'center'}}>
                                                                        <input type="radio" name="addressType" value="saved" onChange={handleRadioChange}/>
                                                                        <p>배송지(선택)</p>
                                                                </div>
                                                                <div>기존 주소</div>
                                                                <div style={{display:'flex', justifyContent: 'left', alignItems: 'center'}}>
                                                                        <input type="radio" name="addressType" value="new" onChange={handleRadioChange}/>
                                                                        <p>배송지(선택)</p>
                                                                </div>
                                                                <div>
                                                                        <div className="c-code">
                                                                                <input type="text" name="zipcode" placeholder="배송지를 입력하세요." value={formData.zipcode} disabled={!isAddressEditable} readOnly />
                                                                        </div>
                                                                        <input type="text" className="c-code" name="address" placeholder="기본 주소" value={formData.address} disabled={!isAddressEditable}  readOnly/>
                                                                        <br/>
                                                                        <input type="text" className="c-code" name="address_detail" placeholder="상세 주소" value={formData.address_detail} disabled={!isAddressEditable} onChange={handleChange} style={{marginTop:'-25px'}}/>
                                                                        <button type="button" className="button" onClick={handleAddressSearch} style={{width:'100px', 
                                                                                opacity: isAddressEditable ? 1 : 0.5,
                                                                                cursor: isAddressEditable ? 'pointer' : 'not-allowed'}}
                                                                        >우편번호 찾기</button>
                                                                </div>
                                                        </div>
                                                        {/* 배송요청사항 */}
                                                        <div style={{marginTop:'20px', display:'flex', flexDirection: 'column',
                                                                                        justifyContent: 'center'}}>
                                                                <p>배송 요청사항</p>
                                                                <select className="cat1"
                                                                        onChange={handleSelectChange}
                                                                        style={{width:'430px', padding:'3px', borderRadius:'10px', fontSize:'0.8em', height:'30px'}}
                                                                >
                                                                                <option value="null">요청사항 없음.</option>
                                                                                <option value="category">문앞에 배송해 주세요.</option>
                                                                                <option value="category">배송 시 벨 눌러주세요.</option>
                                                                                <option value="direct">직접 기입하기</option>
                                                                </select>
                                                                {isDirectInput&&(
                                                                        <input type='text' placeholder='배송요청사항을 입력해 주세요.' value={deliveryMsg}
                                                                                onChange={(e)=>setDeliveryMsg(e.target.value)}
                                                                                style={{width: '430px', padding: '3px', borderRadius: '5px',
                                                                                        border: '1px solid #000000', fontSize: '0.8em', marginTop:'10px'
                                                                                }}
                                                                        />
                                                                )}
                                                        </div>
                                                        {/* 받는사람 연락처 */}
                                                        <div style={{marginTop:'20px'}}>
                                                                <span style={{color:'red'}}>*</span>
                                                                <span>받는 사람</span>
                                                        </div>
                                                        <input type='text' placeholder='이름을 입력해 주세요.'
                                                                style={{width: '430px', padding: '3px', borderRadius: '5px',
                                                                        border: '1px solid #000000', fontSize: '0.8em', marginTop:'10px'
                                                                }}
                                                        />
                                                        <div style={{marginTop:'20px'}}>
                                                                <span style={{color:'red'}}>*</span>
                                                                <span>배송 연락용 전화번호</span>
                                                        </div>
                                                        <input type='text' placeholder='010-xxxx-xxxx'
                                                                style={{width: '430px', padding: '3px', borderRadius: '5px',
                                                                        border: '1px solid #000000', fontSize: '0.8em', marginTop:'10px'
                                                                }}
                                                        />
                                                        <div style={{marginTop:'20px'}}>
                                                                <span>추가 전화번호(선택)</span>
                                                        </div>
                                                        <input type='text' placeholder='전화번호를 입력하세요.'
                                                                style={{width: '430px', padding: '3px', borderRadius: '5px',
                                                                        border: '1px solid #000000', fontSize: '0.8em', marginTop:'10px'
                                                                }}
                                                        />
                                                </div>
                                        </div>
                                        <Link to={'/finalcheck'}>
                                                <button type="button" className="button" style={{
                                                        width:'80px', backgroundColor:'blue', border:'1px solid blue', marginLeft:'1050px',
                                                        marginTop:'20px'}}
                                                >결제 진행</button>
                                        </Link>
                                </div>

                        </div>
                </>
        )
}

export default Parchase