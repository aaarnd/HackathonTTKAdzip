import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import UsersTable from './usersTable';
import ModalReg from './ModalReg'; 
import { getUsers, deleteUser, updateUserRole, createSession } from '../API/api'; 

const ManageUsers = ({ show, onClose }) => {
    const [users, setUsers] = useState([]);
    const [showRegModal, setShowRegModal] = useState(false); 

    const fetchUsers = async () => { 
        const usersData = await getUsers();
        setUsers(usersData);
    };

    useEffect(() => {
        if (show) {
            console.log('Окно открыто');
            fetchUsers(); 
        }
    }, [show]);

    const handleDelete = async (id) => {
        try {
            const username = JSON.parse(localStorage.getItem("userData")).username; 
            const userToDelete = users.find(user => user.id === id);
    
            await deleteUser(id); 
            setUsers((prevUsers) => prevUsers.filter(user => user.id !== id));

            const logData = {
                username: username,
                subjects: `Пользователь ${userToDelete.username} был удален`
            };

            await createSession(logData);
    
        } catch (error) {
            console.error("Ошибка при удалении: ", error);
        }
    };
    

    const handleChangeRole = async (id, role) => {
        try {
            const username = JSON.parse(localStorage.getItem("userData")).username; 
    
            await updateUserRole(id, role); 
    
            const updatedUsers = await getUsers(); 
            setUsers(updatedUsers);
    
            const updatedUser = updatedUsers.find(user => user.id === id);
    
            const logData = {
                username: username, 
                subjects: `У пользователя ${updatedUser.username} изменилась роль на ${role}`
            };
    
            await createSession(logData);
    
        } catch (error) {
            console.error("Ошибка при изменении роли: ", error);
        }
    };
    

    const handleShowRegModal = () => setShowRegModal(true);
    const handleCloseRegModal = () => setShowRegModal(false);

    return (
        <>
            <Modal show={show} onHide={onClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Список Пользователей</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <UsersTable users={users} onDelete={handleDelete} onChangeRole={handleChangeRole} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleShowRegModal}>
                        Добавить пользователя
                    </Button>
                    <Button variant="secondary" onClick={onClose}>
                        Закрыть
                    </Button>
                    
                </Modal.Footer>
            </Modal>

            <ModalReg show={showRegModal} onClose={handleCloseRegModal} />
        </>
    );
};

export default ManageUsers;
