import './../css/kdh.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function sale(){
        return(
                <>
                        <div style={{margin:'0 auto', marginTop:'100px', textAlign:'center'}}>
                                <h3 style={{fontWeight:'600'}}>CANVAS 특가 상품 기획</h3>
                                <div style={{display:'flex', gap:'20px', justifyContent: 'center'}}>
                                        <h1 style={{color:"white", backgroundColor:"black", padding:"2px 10px"}}>D-3</h1>
                                        <h1>09:09:48</h1>
                                </div>
                                {/* 슬라이드(Carousel) */}
                                <div style={{display:'flex', gap:'20px', justifyContent: 'center', marginTop:'100px'}}>
                                        <div className="sub-slider">
                                                <Carousel fade interval={3000}>
                                                        <Carousel.Item>
                                                                <Link to="/">
                                                                        <img className="d-block w-100" src="/image/banner1.jpg" alt="first slide" />
                                                                </Link>
                                                        </Carousel.Item>
                                                        <Carousel.Item>
                                                                <Link to="/">
                                                                        <img className="d-block w-100" src="/image/banner2.jpg" alt="twice slide" />
                                                                </Link>
                                                        </Carousel.Item>
                                                        <Carousel.Item>
                                                                <Link to="/">
                                                                        <img className="d-block w-100" src="/image/banner3.jpg" alt="twice slide" />
                                                                </Link>
                                                        </Carousel.Item>
                                                </Carousel>
                                        </div>
                                        <div className="sub-slider">
                                                <Carousel fade interval={3000}>
                                                        <Carousel.Item>
                                                                <Link to="/">
                                                                        <img className="d-block w-100" src="/image/banner1.jpg" alt="first slide" />
                                                                </Link>
                                                        </Carousel.Item>
                                                        <Carousel.Item>
                                                                <Link to="/">
                                                                        <img className="d-block w-100" src="/image/banner2.jpg" alt="twice slide" />
                                                                </Link>
                                                        </Carousel.Item>
                                                        <Carousel.Item>
                                                                <Link to="/">
                                                                        <img className="d-block w-100" src="/image/banner3.jpg" alt="twice slide" />
                                                                </Link>
                                                        </Carousel.Item>
                                                </Carousel>
                                        </div>
                                </div>
                        </div>
                        
                </>
        )
}

export default sale