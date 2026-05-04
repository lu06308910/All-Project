import './../css/gayoung.css'

function Basket() {
        return (
                <>
                        <div className="footer-container" style={{backgroundColor:'white'}}>
                                <div style={{marginLeft:'100px'}}>
                                        <h3 style={{fontWeight:'600'}}>장바구니</h3>
                                        {/* 단계별 진행 바 추가 */}
                                        <div style={{ position: 'relative' }}>
                                        {/* 검은 선 - 래퍼 기준으로 absolute */}
                                        <div className='stepper-line-active' style={{ width: '25%' }}></div>
                                        
                                        {/* 점 3개만 evenly */}
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
                                        <h4 style={{textAlign:'center', marginTop:'50px'}}>총 --개의 상품이 담겨 있습니다.</h4>
                                        <div style={{marginTop:'50px'}}>
                                                <button className='button3' style={{border:'1px solid white'}}>전체 선택</button>
                                                <button className='button3'>선택 삭제</button>
                                        </div>
                                        <hr/>
                                        <h5 style={{ margin:'20px 30px'}}>장바구니 상품 (---)</h5>
                                        <table style={{ width: '100%', tableLayout: 'fixed', borderCollapse: 'collapse', marginTop:'20px'}}>
                                                <thead>
                                                        <tr>
                                                                <th style={{backgroundColor:'#eeeeee', width: '10%', textAlign:'center' }}>
                                                                        <input type="checkbox" aria-label="전체 선택"/>
                                                                </th>
                                                                <th style={{backgroundColor:'#eeeeee', width: '40%', textAlign:'center' }}>상품명/옵션정보</th>
                                                                <th style={{backgroundColor:'#eeeeee', width: '10%', textAlign:'center' }}>수량</th>
                                                                <th style={{backgroundColor:'#eeeeee', width: '10%', textAlign:'center' }}>가격</th>
                                                                <th style={{backgroundColor:'#eeeeee', width: '10%', textAlign:'center' }}>배송비</th>
                                                                <th style={{backgroundColor:'#eeeeee', width: '10%', textAlign:'center' }}>최종구매가</th>
                                                                <th style={{backgroundColor:'#eeeeee', width: '10%', textAlign:'center' }}>주문관리</th>
                                                        </tr>
                                                </thead>
                                                <tbody>
                                                        <tr>
                                                                <td style={{ width: '10%', textAlign:'center' }}>
                                                                        <input type="checkbox" aria-label="항목 선택" />
                                                                </td>
                                                                <td style={{ width: '40%'}}>
                                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                                                <img src='image/bed.jpeg' className='img-basket' alt="제품" />
                                                                                <div style={{ 
                                                                                        display: 'flex', flexDirection: 'column', gap: '4px'
                                                                                }}>
                                                                                        <button className='button3'>제품명</button>
                                                                                        <span
                                                                                        style={{overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box',
                                                                                        WebkitBoxOrient: 'vertical', WebkitLineClamp: 1, whiteSpace: 'normal',
                                                                                        height: '1.5em', fontWeight: '500', width:'80%'}}>
                                                                                                제품명길게썼을때잘리는지안잘리는지테스트얼마나길게써야잘리는지
                                                                                        </span>
                                                                                        <div>
                                                                                                <span>제품옵션 </span>
                                                                                                <span>옵션변경</span>
                                                                                        </div>
                                                                                </div>
                                                                        </div>
                                                                </td>
                                                                <td style={{ width: '10%' , textAlign:'center' }}>수량</td>
                                                                <td style={{ width: '10%' , textAlign:'center' }}>3,089,000원</td>
                                                                <td style={{ width: '10%' , textAlign:'center' }}>3,000원</td>
                                                                <td style={{ width: '10%' , textAlign:'center' }}>3,092,000원</td>
                                                                <td style={{ width: '10%' , textAlign:'center' }}>
                                                                        <button className='button3' style={{backgroundColor:'black', color:'white'}}>구매하기</button>
                                                                </td>
                                                        </tr>
                                                        <hr style={{width:'100%'}}/>
                                                        <tr>
                                                                <td style={{ width: '10%', textAlign:'center'  }}>
                                                                        <input type="checkbox" aria-label="항목 선택" />
                                                                </td>
                                                                <td style={{ width: '40%'}}>
                                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                                                <img src='image/bed.jpeg' className='img-basket' alt="제품" />
                                                                                <div style={{ 
                                                                                        display: 'flex', flexDirection: 'column', gap: '4px'
                                                                                }}>
                                                                                        <button className='button3'>제품명</button>
                                                                                        <span
                                                                                        style={{overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box',
                                                                                        WebkitBoxOrient: 'vertical', WebkitLineClamp: 1, whiteSpace: 'normal',
                                                                                        height: '1.5em', fontWeight: '500', width:'80%'}}>
                                                                                                제품명길게썼을때잘리는지안잘리는지테스트얼마나길게써야잘리는지
                                                                                        </span>
                                                                                        <div>
                                                                                                <span>제품옵션 </span>
                                                                                                <span>옵션변경</span>
                                                                                        </div>
                                                                                </div>
                                                                        </div>
                                                                </td>
                                                                <td style={{ width: '10%' , textAlign:'center' }}>수량</td>
                                                                <td style={{ width: '10%' , textAlign:'center' }}>3,089,000원</td>
                                                                <td style={{ width: '10%' , textAlign:'center' }}>3,000원</td>
                                                                <td style={{ width: '10%' , textAlign:'center' }}>3,092,000원</td>
                                                                <td style={{ width: '10%' , textAlign:'center' }}>
                                                                        <button className='button3' style={{backgroundColor:'black', color:'white'}}>구매하기</button>
                                                                </td>
                                                        </tr>
                                                </tbody>
                                                
                                        </table>
                                        
                                </div>
                        </div>
                </>
        );
}

export default Basket;