import React from 'react';
// import { loginUser, setAuthToken } from '../API/api';
import LoginForm from '../LoginForm';
import { Container, Row } from 'react-bootstrap';
import "../styles/login-page.css"

function LoginPage() {
  // const [username] = useState('');
  // const [password] = useState('');

  // const handleLogin = async () => {
  //   try {
  //     const { token } = await loginUser(username, password);
  //     setAuthToken(token); // Сохранить токен для будущих запросов
  //     localStorage.setItem('token', token); // Сохранение токена
  //     alert('Login successful');
  //     window.location.href = '/dashboard'; // Перенаправление на панель управления
  //   } catch (error) {
  //     console.error('Ошибка входа', error);
  //     alert('Ошибка входа');
  //   }
  // };

  return (
    <Container className='d-flex justify-content-center align-items-center vertical'>
      <Row>
      </Row>
      <Row>
        <div>
          <h1 className='text-center col-12'>Авторизация</h1>
          {/* <h2>Вход</h2>
          <input
            type="text"
            placeholder="Логин"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin}>Войти</button> */}
          <LoginForm />
        </div>
      </Row>
    </Container>
    
  );
}

export default LoginPage;
