import React from 'react';
import './../css/home.css';
import 'bootstrap/dist/css/bootstrap.min.css';
// 아래 줄을 반드시 추가해야 합니다!
import { Container, Row, Col, Carousel } from 'react-bootstrap';

function Home() {
        const categories = [
                { id: 1, name: '수납가구', img: 'storage.jpg' },
                { id: 2, name: '침대/매트리스', img: 'bed.jpg' },
                { id: 3, name: '소파/암체어', img: 'sofa.jpg' },
                { id: 4, name: '식탁/테이블/의자', img: 'table.jpg' },
                { id: 5, name: '책상/사무용 의자', img: 'desk.jpg' },
                { id: 6, name: '조명', img: 'lighting.jpg' },
                { id: 7, name: '욕실', img: 'bath.jpg' },
        ];

        return (
                <div className="home-main">
                        {/* 이하 코드 동일 */}
                        <Container className="category-section py-5">
                                <Row className="justify-content-center">
                                        {categories.map((item) => (
                                                <Col key={item.id} xs={3} md={1} className="category-item text-center">
                                                        <div className="category-circle">
                                                                <img src={item.img} alt={item.name} />
                                                        </div>
                                                        <p className="category-name">{item.name}</p>
                                                </Col>
                                        ))}
                                </Row>
                        </Container>

                        <div className="main-slider">
                                <Carousel fade interval={3000}>
                                        <Carousel.Item>
                                                <img className="d-block w-100" src="banner1.jpg" alt="First slide" />
                                                <Carousel.Caption>
                                                        <h3>Premium Collection</h3>
                                                        <p>공간을 채우는 가구 그 이상의 가치</p>
                                                </Carousel.Caption>
                                        </Carousel.Item>
                                </Carousel>
                        </div>
                </div>
        );
}

export default Home;