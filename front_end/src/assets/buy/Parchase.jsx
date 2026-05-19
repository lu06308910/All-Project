import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Parchase(){
        const navigate = useNavigate();

        // 장바구니 아이템
        const [cartList, setCartList] = useState([]);
        useEffect(() => {
                const items = sessionStorage.getItem('buyItems');
                if (items) setCartList(JSON.parse(items));
        }, []);

        // 로그인 유저 정보 (기존 주소 표시용)
        const [userInfo, setUserInfo] = useState(null);
        useEffect(() => {
                const mId = sessionStorage.getItem('mId');
                const logId = sessionStorage.getItem('logId');
                const logName = sessionStorage.getItem('logName');
                const usertype = sessionStorage.getItem('usertype');

                if (mId) {
                        setUserInfo({ mId, logId, logName, usertype });

                        axios.get(`http://localhost:9991/member/info/${mId}`)
                                .then(res=> setUserInfo(prev=>({...prev,...res.data})))
                                .catch(err=>console.log(err));
                }
        }, []);

        // DeliveryEntity에 저장할 배송지 데이터
        const [delivery, setDelivery] = useState({
                request: '',
                n_zipcode: '',
                n_address: '',
                n_addressDetail: '',
                n_tel: '',
                n_name: '',
        });

        const handleDeliveryChange = (e) => {
                const { name, value } = e.target;
                setDelivery(prev => ({ ...prev, [name]: value }));
        };

        // 총액 계산
        const totalProductPrice = cartList.reduce((sum, item) =>
                sum + (parseInt(item.product.price) * item.count), 0);
        const totalDiscount = cartList.reduce((sum, item) => sum + (item.discount || 0), 0);
        const totalDelivery = cartList.reduce((sum, item) => sum + (item.newdelivery || 0), 0);
        const totalPayment = totalProductPrice - totalDiscount + totalDelivery;

        // 주소입력창 라디오버튼 상태
        const [isAddressEditable, setIsAddressEditable] = useState(false);
        const handleRadioChange = (e) => {
                if (e.target.value === 'new') {
                        setIsAddressEditable(true);
                } else {
                        setIsAddressEditable(false);
                        if (userInfo) {
                                setDelivery(prev => ({
                                        ...prev,
                                        n_zipcode: userInfo.zipcode || '',
                                        n_address: userInfo.address || '',
                                        n_addressDetail: userInfo.address_detail || ''
                                }));
                        }
                }
        };

        // 직접 요청사항
        const [isDirectInput, setIsDirectInput] = useState(false);
        const [deliveryMsg, setDeliveryMsg] = useState('');
        const handleSelectChange = (e) => {
                const val = e.target.value;
                if (val === 'direct') {
                        setIsDirectInput(true);
                } else {
                        setIsDirectInput(false);
                        setDeliveryMsg('');
                        setDelivery(prev => ({ ...prev, request: val === 'null' ? '' : val }));
                }
        };

        // 카카오 우편번호 API
        const handleAddressSearch = () => {
                if (!isAddressEditable) {
                        alert('배송지 선택을 먼저 해주세요.');
                        return;
                }
                new window.daum.Postcode({
                        oncomplete: function (data) {
                                let fullAddr = data.address;
                                let extraAddr = '';
                                if (data.userSelectedType === 'R') {
                                        if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) extraAddr += data.bname;
                                        if (data.buildingName !== '' && data.apartment === 'Y')
                                                extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                                        fullAddr += (extraAddr !== '' ? ` (${extraAddr})` : '');
                                }
                                setDelivery(prev => ({ ...prev, n_zipcode: data.zonecode, n_address: fullAddr }));
                                document.getElementsByName('n_addressDetail')[0].focus();
                        }
                }).open();
        };

        //결제 진행
        const handleSubmit = () => {
                const mId = sessionStorage.getItem('mId');
                if (!delivery.n_address) return alert('배송지를 선택하거나 입력해주세요.');
                if (!delivery.n_tel) return alert('전화번호를 입력해주세요.');

                let requestMsg = '요청사항 없음';
                if (isDirectInput) {
                        if (!deliveryMsg.trim()) return alert('배송 요청사항을 입력해주세요.');
                        requestMsg = deliveryMsg;
                } else if (delivery.request) {
                        requestMsg = delivery.request;
                }

                const payloads = cartList.map(item => ({
                        request: requestMsg,
                        n_zipcode: delivery.n_zipcode,
                        n_address: delivery.n_address,
                        n_addressDetail: delivery.n_addressDetail,
                        n_tel: delivery.n_tel,
                        n_name: delivery.n_name,
                        mid: parseInt(mId),
                        pid: item.pid
                }));

                // 여러 개 한 번에 POST
                axios.post('http://localhost:9991/delivery/add/all', payloads)
                        .then(res => {
                                const savedDeliveries = res.data;
                                const dIds    = savedDeliveries.map(d => d.did);
                                const cartIds = cartList.map(item => item.cartId);
                                const counts  = cartList.map(item => item.count);
                                const discounts = cartList.map(item => item.discount || 0);

                                return axios.post('http://localhost:9991/buy/add', {
                                cartIds, dIds, counts, discounts
                                });
                        })
                        .then(() => {
                                // ✅ buy 저장 성공 후 장바구니 삭제
                                const cartIds = cartList.map(item => item.cartId);
                                return axios.delete('http://localhost:9991/cart/delete', {
                                data: cartIds  // axios delete는 data로 body 전송
                                });
                        })
                        .then(() => {
                                sessionStorage.setItem('deliveryInfo', JSON.stringify(delivery));
                                navigate('/finalcheck');
                        })
                        .catch(err => console.log(err));
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
                                                <div><span>장바구니</span></div>
                                                <div><span>주문결제</span></div>
                                                <div><span>주문완료</span></div>
                                        </div>
                                        <h4 style={{textAlign:'center', marginTop:'50px'}}>총 {cartList.length}개의 상품이 담겨 있습니다.</h4>
                                </div>
                                <hr style={{border:'2px solid black', marginTop:'60px', opacity: 1}}/>
                                <table style={{width:'100%', tableLayout:'fixed', borderCollapse:'collapse', textAlign:'center'}}>
                                        <thead>
                                                <tr>
                                                        <th style={{width:'55%'}}>상품 정보</th>
                                                        <th style={{width:'10%'}}>수량</th>
                                                        <th style={{width:'20%'}}>상품 금액</th>
                                                        <th style={{width:'15%'}}>배송 정보</th>
                                                </tr>
                                        </thead>
                                </table>
                                <hr />
                                <div style={{marginLeft:'40px', marginTop:'-5px', marginBottom:'-15px'}}>
                                        <span>배송건수({cartList.length})</span>
                                        <span style={{color:'#eeeee', marginLeft:'10px', fontSize:'0.8em'}}>배송/설치일 지정 가능</span>
                                </div>
                                <hr style={{border:'1px solid black', marginTop:'30px', opacity: 1}}/>
                                {cartList.map((item)=>(
                                        <table key={item.cartId} style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse', marginTop:'20px', textAlign:'center'}}>
                                                <tbody>
                                                        <tr>
                                                                <td style={{ width: '55%'}}>
                                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                                                <img src='image/bed.jpeg' className='img-basket' alt="제품"/>
                                                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: 0, textAlign:'left' }}>
                                                                                        <span style={{overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box',
                                                                                                WebkitBoxOrient: 'vertical', WebkitLineClamp: 1, whiteSpace: 'normal',
                                                                                                height: '1.5em', fontWeight: '500', width:'90%'}}>
                                                                                                {item.product.name}
                                                                                        </span>
                                                                                        <div><span>{item.product.option}</span></div>
                                                                                </div>
                                                                        </div>
                                                                </td>
                                                                <td style={{ width: '10%', textAlign: 'center', verticalAlign: 'middle' }}>
                                                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                                                {item.count}
                                                                        </div>
                                                                </td>
                                                                <td style={{ width: '20%'}}>
                                                                        <div style={{display:'flex', flexDirection: 'column', justifyContent: 'center', textAlign:'center'}}>
                                                                                <span style={{fontWeight:'600'}}>
                                                                                        {(item.product.price * item.count - item.discount).toLocaleString()}원
                                                                                </span>
                                                                                <span style={{textDecoration:'line-through', color:'gray'}}>
                                                                                        {(item.product.price * item.count).toLocaleString()}원
                                                                                </span>
                                                                        </div>
                                                                </td>
                                                                {item.newdelivery === 0 ? (
                                                                        <td style={{ width: '15%', textAlign: 'center'}}>
                                                                                <div style={{display:'flex', flexDirection: 'column', justifyContent: 'center', textAlign:'center'}}>
                                                                                        <span style={{color:'blue', fontWeight:'600'}}>무료배송</span>
                                                                                        <span style={{fontSize:'0.7em', fontWeight:'600'}}>지역별/옵션별 배송비 추가</span>
                                                                                        <span style={{fontSize:'0.7em', textDecoration:'underline', color:'#cccc'}}>지역별 배송비</span>
                                                                                </div>
                                                                        </td>
                                                                ) : (
                                                                        <td style={{ width: '15%', textAlign: 'center' }}>
                                                                                {item.newdelivery.toLocaleString()}원
                                                                        </td>
                                                                )}
                                                        </tr>
                                                        <tr>
                                                                <td colSpan="7" style={{padding:0, borderBottom:'1px solid #ddd'}}></td>
                                                        </tr>
                                                </tbody>
                                        </table>
                                ))}
                                <span style={{fontSize:'0.8em', color:'#cccccc'}}>
                                        *배송일자 선택(배송일 예약) 가능 상품만 배송일 지정이 가능합니다.
                                </span>
                                <hr style={{border:'2px solid black', marginTop:'60px', opacity: 1}}/>
                                <div className="row" style={{marginLeft:'30px', marginBottom:'-5px', marginTop:'-5px', textAlign:'center'}}>
                                        <div className="col-3">총 상품금액</div>
                                        <div className="col-3">총 할인금액</div>
                                        <div className="col-3">총 배송비</div>
                                        <div className="col-3">총 결제금액</div>
                                </div>
                                <hr />
                                <div style={{marginLeft:'30px', marginBottom:'80px', marginTop:'80px', textAlign:'center', fontWeight:'600',
                                        display:'flex', justifyContent: 'space-evenly'}}>
                                        <div>{totalProductPrice.toLocaleString()}원</div>
                                        <div style={{display:'flex', justifyContent: 'center', borderRadius:'50px', backgroundColor:'#eeeeee', width:'20px', height:'20px', alignItems: 'center'}}>-</div>
                                        <div>{totalDiscount.toLocaleString()}</div>
                                        <div style={{display:'flex', justifyContent: 'center', borderRadius:'50px', backgroundColor:'#eeeeee', width:'20px', height:'20px', alignItems: 'center'}}>+</div>
                                        <div>{totalDelivery.toLocaleString()}</div>
                                        <div style={{display:'flex', justifyContent: 'center', borderRadius:'50px', backgroundColor:'#eeeeee', width:'20px', height:'20px', alignItems: 'center'}}>=</div>
                                        <div>{totalPayment.toLocaleString()}원</div>
                                </div>
                                <hr />
                                <div style={{display:'flex', flexDirection: 'row', flexWrap: 'nowrap', justifyContent: 'space-between',
                                        alignItems:'center', boxSizing:'border-box', width: '100%', color:'#cccc'}}>
                                        <div style={{ flex: 1, textAlign: 'center' }}>상품금액{'\u2003'}{'\u2003'}{totalProductPrice.toLocaleString()}원</div>
                                        <div className='v-line' style={{ borderLeft: '1px solid #ccc', height: '20px', flexShrink: 0 }}></div>
                                        <div style={{ flex: 1, textAlign: 'center' }}>기본할인{'\u2003'}{'\u2003'}{totalDiscount.toLocaleString()}원</div>
                                        <div className='v-line' style={{ borderLeft: '1px solid #ccc', height: '20px', flexShrink: 0 }}></div>
                                        <div style={{ flex: 1, textAlign: 'center' }}>배송비{'\u2003'}{'\u2003'}{totalDelivery.toLocaleString()}원</div>
                                </div>
                                <hr/>
                                <div style={{textDecoration:'underline', textAlign:'right'}}>주문 취소</div>

                                {/* 배송지 입력 섹션 */}
                                <div style={{backgroundColor:'#EDEDED', padding:'40px', marginTop:'50px'}}>
                                        <div style={{padding:'40px', backgroundColor:'white', borderRadius:'20px'}}>
                                                <div style={{display:'flex'}}>
                                                        <h4 style={{fontWeight:'600', color:'red'}}>*</h4>
                                                        <h4 style={{fontWeight:'600'}}>배송지 입력</h4>
                                                </div>
                                                <hr />
                                                <div style={{marginLeft:'40px'}}>

                                                        {/* 기존 주소 라디오 */}
                                                        <div style={{display:'flex', justifyContent: 'left', alignItems: 'center'}}>
                                                                <input type="radio" name="addressType" value="saved" onChange={handleRadioChange}/>
                                                                <span style={{marginLeft:'3px'}}>배송지(기존 주소)</span>
                                                        </div>
                                                        {userInfo && (
                                                                <div style={{margin:'8px 0 8px 20px', color:'#999999'}}>
                                                                        <span>{userInfo.address} </span>
                                                                        <span>{userInfo.address_detail}</span>
                                                                        <span style={{marginLeft:'10px'}}>{userInfo.zipcode} </span>
                                                                </div>
                                                        )}
                                                        {/* 새 주소 라디오 & 입력폼 */}
                                                        <div style={{display:'flex', justifyContent: 'left', alignItems: 'center', marginTop:'20px'}}>
                                                                <input type="radio" name="addressType" value="new" onChange={handleRadioChange}/>
                                                                <span style={{marginLeft:'3px'}}>배송지(선택)</span>
                                                        </div>
                                                        <div style={{marginTop:'5px'}}>
                                                                <input type="text" className="c-code" name="n_address" placeholder="주소"
                                                                        value={delivery.n_address}
                                                                        disabled={!isAddressEditable}
                                                                        onChange={handleDeliveryChange} readOnly />
                                                                <br/>
                                                                <input type="text" className="c-code" name="n_addressDetail" placeholder="상세 주소"
                                                                        value={delivery.n_addressDetail}
                                                                        disabled={!isAddressEditable}
                                                                        onChange={handleDeliveryChange}
                                                                        style={{marginTop:'-25px'}} />
                                                                <div className="c-code">
                                                                        <input type="text" className="c-code" name="n_zipcode" placeholder="우편번호"
                                                                                value={delivery.n_zipcode} style={{width:'50%'}}
                                                                                disabled={!isAddressEditable}
                                                                                onChange={handleDeliveryChange} readOnly />
                                                                </div>
                                                                <button type="button" className="button" onClick={handleAddressSearch}
                                                                        style={{width:'100px',
                                                                                opacity: isAddressEditable ? 1 : 0.5,
                                                                                cursor: isAddressEditable ? 'pointer' : 'not-allowed'}}>
                                                                        우편번호 찾기
                                                                </button>
                                                        </div>

                                                        {/* 배송 요청사항 */}
                                                        <div style={{marginTop:'20px', display:'flex', flexDirection: 'column', justifyContent: 'center'}}>
                                                                <span>배송 요청사항</span>
                                                                <select className="cat1" onChange={handleSelectChange}
                                                                        style={{width:'50%', padding:'3px', borderRadius:'10px', fontSize:'0.8em', height:'30px'}}>
                                                                        <option value="null">요청사항 없음.</option>
                                                                        <option value="문앞에 배송해 주세요.">문앞에 배송해 주세요.</option>
                                                                        <option value="배송 시 벨 눌러주세요.">배송 시 벨 눌러주세요.</option>
                                                                        <option value="direct">직접 기입하기</option>
                                                                </select>
                                                                {isDirectInput && (
                                                                        <input type='text' placeholder='배송요청사항을 입력해 주세요.'
                                                                                value={deliveryMsg}
                                                                                onChange={(e) => setDeliveryMsg(e.target.value)}
                                                                                style={{width: '50%', padding: '3px', borderRadius: '5px',
                                                                                        border: '1px solid #000000', fontSize: '0.8em', marginTop:'10px'}} />
                                                                )}
                                                        </div>

                                                        {/* 받는 사람 */}
                                                        <div style={{marginTop:'20px'}}>
                                                                <span style={{color:'red'}}>*</span>
                                                                <span>받는 사람</span>
                                                        </div>
                                                        <input type='text' name='n_name' placeholder='이름을 입력해 주세요.'
                                                                value={delivery.n_name}
                                                                onChange={handleDeliveryChange}
                                                                style={{width: '50%', padding: '3px', borderRadius: '5px',
                                                                        border: '1px solid #000000', fontSize: '0.8em', marginTop:'10px'}} />

                                                        {/* 배송 연락용 전화번호 */}
                                                        <div style={{marginTop:'20px'}}>
                                                                <span style={{color:'red'}}>*</span>
                                                                <span>배송 연락용 전화번호</span>
                                                        </div>
                                                        <input type='text' name='n_tel' placeholder='010-xxxx-xxxx'
                                                                value={delivery.n_tel}
                                                                onChange={handleDeliveryChange}
                                                                style={{width: '50%', padding: '3px', borderRadius: '5px',
                                                                        border: '1px solid #000000', fontSize: '0.8em', marginTop:'10px'}} />

                                                        {/* 추가 전화번호 (선택) */}
                                                        <div style={{marginTop:'20px'}}>
                                                                <span>추가 전화번호(선택)</span>
                                                        </div>
                                                        <input type='text' name='n_tel2' placeholder='전화번호를 입력하세요.'
                                                                onChange={handleDeliveryChange}
                                                                style={{width: '50%', padding: '3px', borderRadius: '5px',
                                                                        border: '1px solid #000000', fontSize: '0.8em', marginTop:'10px'}} />
                                                </div>
                                        </div>
                                        <button type="button" onClick={handleSubmit}
                                                style={{width:'80px', backgroundColor:'blue', color:'white',
                                                        border:'1px solid blue', marginLeft:'90%', marginTop:'20px'}}>
                                                결제 진행
                                        </button>
                                </div>
                        </div>
                </>
        )
}

export default Parchase