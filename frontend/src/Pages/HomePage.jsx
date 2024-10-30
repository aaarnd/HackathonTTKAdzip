import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import ModalReg from '../components/ModalReg';
import ModalPost from '../components/ModalPost';
import ModalSession from '../components/ModalSession';
import TariffModal from '../components/Tariffs/TariffModal';
import ServiceModal from '../components/Services/ServiceModal';
import ManageUsers from '../components/ManageUsers';
import IntentForm from '../components/IntentForm';
import NavBar from '../components/NavBar';

const HomePage = () => {
  const [curUser, setCurUser] = useState(JSON.parse(localStorage.getItem("userData")));
  const [isModalRegOpen, setIsModalRegOpen] = useState(false);
  const [isModalPostOpen, setIsModalPostOpen] = useState(false);
  const [isModalSessionOpen, setIsModalSessionOpen] = useState(false);
  const [isManageUsersOpen, setIsManageUsersOpen] = useState(false);
  const [isTariffModalOpen, setIsTariffModalOpen] = useState(false);
  const [isIntentFormOpen, setIsIntentFormOpen] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData) {
      setUserRole(userData.role);
    }
  }, []);

  const openManageUsers = () => setIsManageUsersOpen(true);
  const openTariffModal = () => setIsTariffModalOpen(true);
  const openServiceModal = () => setIsServiceModalOpen(true);
  const openIntentForm = () => setIsIntentFormOpen(true);
  const openModalPost = () => setIsModalPostOpen(true);
  const openModalSession = () => setIsModalSessionOpen(true);

  return (
    <div>
      <NavBar style={{backgroundColor: '#F3F3F3'}} fullName={curUser.personal_info.split("_").join(" ")} role={curUser.role} />

      <Container style={{ marginTop: '20px', backgroundColor: '#F3F3F3',display:'flex', flexDirection:"column", gap:16 }}>
        {/* Первый ряд */}
        <Row style={{display:'flex', gap:'16px'}}>
          {userRole === 'admin' && (
            <Col style={{padding:'0', flex:1}}> 
              <Button
                variant="primary"
                onClick={openManageUsers}
                style={{ width: '100%', height: '200px', backgroundColor: '#FFFFFF', color: '#000000', borderRadius:'20px', fontSize: '280%', fontWeight: 'bold', border: 'none' }}
              >
                Управление пользователями
              </Button>
            </Col>
          )}
          {userRole === 'admin' && ( 
            <Col xs={4} style={{padding:'0'}}>
              <Button
                variant="secondary"
                onClick={openTariffModal}
                style={{ width: '100%', height: '200px', backgroundColor: '#F05959', color: '#FFFFFF', borderRadius:'20px', fontSize: '280%', fontWeight: 'bold', border: 'none' }}
              >
                Тарифы
              </Button>
            </Col>
          )}
        </Row>

        {/* Второй ряд */}
        <Row style={{display:'flex', gap:'16px'}}>
          {userRole === 'admin' && ( 
            <Col xs={4} style={{padding:'0'}}>
              <Button
                variant="secondary"
                onClick={openServiceModal}
                style={{ width: '100%', height: '200px', backgroundColor: '#F05959', color: '#FFFFFF', borderRadius:'20px', fontSize: '280%', fontWeight: 'bold', border: 'none' }}
              >
                Услуги
              </Button>
            </Col>
          )}
          {userRole === 'admin' || userRole === 'editor' ? (
            <Col style={{flex:1, padding:'0'}}>
              <Button
                variant="primary"
                onClick={openIntentForm}
                style={{ width: '100%', height: '200px', backgroundColor: '#FFFFFF', color: '#000000', borderRadius:'20px', fontSize: '280%', fontWeight: 'bold', border: 'none' }}
              >
                Намерения
              </Button>
            </Col>
          ) : null}
        </Row>

        {/* Третий ряд */}
        <Row style={{display:'flex', gap:'16px'}}>
          {userRole === 'admin' || userRole === 'editor' ? (
            <Col xs={4} style={{flex:1, padding:'0'}}>
              <Button
                variant="secondary"
                onClick={openModalPost}
                style={{ width: '100%', height: '100px', backgroundColor: '#FFFFFF', color: '#000000', borderRadius:'20px', fontSize: '150%', fontWeight: 'bold', border: 'none' }}
              >
                Создать рассылку
              </Button>
            </Col>
          ) : null}
          {userRole === 'admin' && (
            <Col xs={4} style={{flex:1, padding:'0'}}>
              <Button
                variant="primary"
                onClick={openModalSession}
                style={{ width: '100%', height: '100px', backgroundColor: '#FFFFFF', color: '#000000', borderRadius:'20px',  fontSize: '150%', fontWeight: 'bold', border: 'none' }}
              >
                Открыть логи
              </Button>
            </Col>
          )}
        </Row>
      </Container>

      {/* Модальные окна */}
      <ModalReg show={isModalRegOpen} onClose={() => setIsModalRegOpen(false)} />
      <ModalPost show={isModalPostOpen} onClose={() => setIsModalPostOpen(false)} />
      <ModalSession show={isModalSessionOpen} onClose={() => setIsModalSessionOpen(false)} />
      <IntentForm show={isIntentFormOpen} onClose={() => setIsIntentFormOpen(false)} />
      <ManageUsers show={isManageUsersOpen} onClose={() => setIsManageUsersOpen(false)} />
      <TariffModal show={isTariffModalOpen} onClose={() => setIsTariffModalOpen(false)} />
      <ServiceModal show={isServiceModalOpen} onClose={() => setIsServiceModalOpen(false)} />
    </div>
  );
};

export default HomePage;
