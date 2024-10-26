import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import ModalReg from '../components/ModalReg';
import ModalPost from '../components/ModalPost'; 
import ModalSession from '../components/ModalSession';
import Logout from '../components/Logout';
import TariffModal from '../components/Tariffs/TariffModal';
import ServiceModal from '../components/Services/ServiceModal'; 
import ManageUsers from '../components/ManageUsers';
import IntentForm from '../components/IntentForm';
import NavBar from '../components/NavBar';

const HomePage = () => {
  const [curUser, setCurUser] = useState(JSON.parse(localStorage.getItem("userData")))
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

  const closeModalReg = () => setIsModalRegOpen(false);

  const openModalPost = () => setIsModalPostOpen(true); 
  const closeModalPost = () => setIsModalPostOpen(false); 

  const openModalSession = () => setIsModalSessionOpen(true); 
  const closeModalSession = () => setIsModalSessionOpen(false);  

  const openManageUsers = () => setIsManageUsersOpen(true); 
  const closeManageUsers = () => setIsManageUsersOpen(false);  

  const openTariffModal = () => setIsTariffModalOpen(true); 
  const closeTariffModal = () => setIsTariffModalOpen(false);

  const openIntentForm = () => setIsIntentFormOpen(true);
  const closeIntentForm = () => setIsIntentFormOpen(false);

  const openServiceModal = () => setIsServiceModalOpen(true);
  const closeServiceModal = () => setIsServiceModalOpen(false);

  return (
    <div>
      <NavBar fullName={curUser.personal_info.split("_").join(" ")} role={curUser.role}/>
      <h1>Добро пожаловать в систему управления ботом ТТК</h1>
      <p>Используйте эту платформу для управления пользователями, намерениями и другими настройками бота.</p>

      <div style={{ marginTop: '20px' }}>
        {userRole === 'admin' && (
          <>
            <Button variant="primary" onClick={openModalSession} style={{ marginLeft: '10px' }}>
              Открыть логи
            </Button>
            <Button variant="primary" onClick={openManageUsers} style={{ marginLeft: '10px' }}>
              Управление пользователями
            </Button>
            <Button variant="secondary" onClick={openTariffModal} style={{ marginLeft: '10px' }}>
              Управление тарифами
            </Button>
            <Button variant="secondary" onClick={openServiceModal} style={{ marginLeft: '10px' }}>
              Управление услугами
            </Button> 
          </>
        )}

        {(userRole === 'editor' || userRole === 'admin') && (
          <>
            <Button variant="secondary" onClick={openModalPost} style={{ marginLeft: '10px' }}>
              Создать пост для рассылки
            </Button>
            <Button variant="primary" onClick={openIntentForm} style={{ marginLeft: '10px' }}>
              Намерения
            </Button>
          </>
        )}

        <ModalReg show={isModalRegOpen} onClose={closeModalReg} />
        <ModalPost show={isModalPostOpen} onClose={closeModalPost} />
        <ModalSession show={isModalSessionOpen} onClose={closeModalSession} />
        <IntentForm show={isIntentFormOpen} onClose={closeIntentForm} />
        <ManageUsers show={isManageUsersOpen} onClose={closeManageUsers} />
        <TariffModal show={isTariffModalOpen} onClose={closeTariffModal} />
        <ServiceModal show={isServiceModalOpen} onClose={closeServiceModal} /> 

        <Logout />
      </div>
    </div>
  );
}

export default HomePage;
