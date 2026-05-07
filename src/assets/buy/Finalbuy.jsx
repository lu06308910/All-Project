import { Link } from "react-router-dom"
import { Carousel } from "react-bootstrap";

function Finalbuy(){

        // 제품 데이터 배열, 관련상품 
        const products = [
                { id: 1, img: "public/p1.png", title: "글자수체크를위해서최대한글귀를늘려보고있습니다안녕하세요반갑습니다어서오세요", price: "89,900", discount: "17%", rating: '4.9', ratcut: '304' },
                { id: 2, img: "public/p2.png", title: "BILLY 빌리", price: "89,900", discount: "17%", rating: '4.9', ratcut: '304' },
                { id: 3, img: "public/p3.png", title: "BILLY 빌리", price: "89,900", discount: "17%", rating: '4.9', ratcut: '304' },
                { id: 4, img: "public/p4.png", title: "BILLY 빌리", price: "89,900", discount: "17%", rating: '4.9', ratcut: '304' },
                { id: 5, img: "public/p1.png", title: "BILLY 빌리", price: "89,900", discount: "17%", rating: '4.9', ratcut: '304' },
                { id: 6, img: "public/p2.png", title: "BILLY 빌리", price: "89,900", discount: "17%", rating: '4.9', ratcut: '304' },
                { id: 7, img: "public/p3.png", title: "BILLY 빌리", price: "89,900", discount: "17%", rating: '4.9', ratcut: '304' },
        ];

        const chunkProducts = (arr, size) => {
                const result = [];
                for (let i = 0; i < arr.length; i += size) {
                        result.push(arr.slice(i, i + size));
                }
                return result;
        };

        const productChunks = chunkProducts(products, 4);

        return (
                <>
                        <div className="footer-container" style={{backgroundColor:'white'}}>
                                <div>
                                        <h3 style={{fontWeight:'600'}}>결제 진행</h3>
                                        <div style={{ position: 'relative' }}>
                                        <div className='stepper-line-active' style={{ width: '75%' }}></div>
                                        <div className="stepper-container">
                                                <div><span>●</span></div>
                                                <div><span>●</span></div>
                                                <div><span>●</span></div>
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
                                </div>
                                <h4 style={{textAlign:'center', marginTop:'50px'}}>결제가 완료 되었습니다.</h4>
                                <div style={{marginTop:'50px', marginBottom:'100px', display:'flex', justifyContent:'center'}}>
                                        <Link to='/'>
                                                <button className='button3' style={{marginRight:'10px', width:'100px'}}>
                                                        메인 페이지
                                                </button>
                                        </Link>
                                        <Link to='/mypage'>
                                                <button className='button3' style={{width:'100px'}}>마이스토어</button>
                                        </Link>
                                </div>
                                <hr/>
                                        <h5 style={{ margin:'20px 30px'}}>관련 상품</h5>
                                <hr/>
                                <div style={{ padding: "40px 0", textAlign: "center" }}>
                                        <Carousel
                                                indicators={false} // 하단 점 숨기기
                                                interval={null}    // 자동 재생 끄기 (화살표로만 조작)
                                                variant="dark"     // 화살표 색상을 어둡게 (배경이 밝을 때)
                                        >
                                                {productChunks.map((chunk, index) => (
                                                        <Carousel.Item key={index}>
                                                                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', padding: '0 50px', marginTop: '100px', marginBottom: '100px' }}>
                                                                        {chunk.map((item) => (
                                                                                <Link to="" className="product-link" key={item.id} style={{ textDecoration: 'none', color: 'inherit', width: '25%' }}>
                                                                                        <div className="product-card">
                                                                                                <div className="product-img">
                                                                                                        <img src={item.img} alt={item.title} style={{ width: '100%' }} />
                                                                                                </div>
                                                                                                <div style={{ textAlign: 'left', marginTop: '10px' }}>
                                                                                                        <div style={{ color: "gray", fontSize: '0.8em' }}>한샘</div>
                                                                                                        <div className="title" style={{
                                                                                                                overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box',
                                                                                                                WebkitBoxOrient: 'vertical', WebkitLineClamp: 2, whiteSpace: 'normal',
                                                                                                                height: '2.8em', fontWeight: '500'
                                                                                                        }}>{item.title}</div>
                                                                                                        <div style={{ color: 'gray', textDecoration: 'line-through', fontSize: '0.8em' }}>
                                                                                                                {item.price}원
                                                                                                        </div>
                                                                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                                                                <span style={{ color: 'red', marginRight: '5px', fontWeight: 'bold' }}>{item.discount}</span>
                                                                                                                <span style={{ fontWeight: 'bold' }}>{item.price}원</span>
                                                                                                        </div>
                                                                                                        <div style={{ fontSize: '0.8em', color: 'gray' }}>
                                                                                                                <span>★</span>
                                                                                                                <span>{item.rating}</span>
                                                                                                                <span style={{ color: 'gray' }}>({item.ratcut})</span>
                                                                                                        </div>
                                                                                                </div>
                                                                                        </div>
                                                                                </Link>
                                                                        ))}
                                                                </div>
                                                        </Carousel.Item>
                                                ))}
                                        </Carousel>
                                </div>
                        </div>
                </>
        )
}

export default Finalbuy