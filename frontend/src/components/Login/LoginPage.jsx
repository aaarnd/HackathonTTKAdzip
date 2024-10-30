import React from 'react';
import LoginForm from '../LoginForm';
import { Container, Row, Col } from 'react-bootstrap';
import "../styles/login-page.css";

function LoginPage() {
  return (
    <Container fluid className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Row className="w-100 justify-content-center mb-4">
        <Col xs="auto" className="d-flex justify-content-center">
          <img 
            src="https://static.tildacdn.com/tild3966-3232-4831-b935-316464613662/logo_2_1.svg" 
            alt="Logo" 
            style={{ height: "50px", width: "60%" }} // регулируем размер изображения
          />
        </Col>
      </Row>
      <Row className="w-100 justify-content-center">
        <Col xs="auto">
          <div className="text-center">
            <h1>Авторизация</h1>
            <LoginForm />
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default LoginPage;
