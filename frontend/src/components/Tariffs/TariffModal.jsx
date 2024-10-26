import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import TariffsTable from './TariffsTable';
import { getTariffs, deleteTariff, updateTariff, createSession } from '../../API/api';
import EditTariffForm from './EditTariffForm';
import CreateTariffForm from './CreateTariffForm';

const TariffModal = ({ show, onClose }) => {
    const [tariffs, setTariffs] = useState([]);
    const [editTariff, setEditTariff] = useState(null);
    const [isEditFormOpen, setIsEditFormOpen] = useState(false);
    const [isTariffCreateOpen, setIsTariffCreateOpen] = useState(false);

    const openTariffCreate = () => setIsTariffCreateOpen(true);
    const closeTariffCreate = () => setIsTariffCreateOpen(false);

    const getAll = async () => {
        const tariffsData = await getTariffs();
        setTariffs(tariffsData);
    };

    useEffect(() => {
        if (show) {
            getAll();
        }
    }, [show]);

    const handleDelete = async (id) => {
        try {
            const deletedTariff = tariffs.find(tariff => tariff.id === id);
            
            if (!deletedTariff) {
                console.error("Тариф не найден");
                return;
            }
    
            await deleteTariff(id);
    
            const userData = JSON.parse(localStorage.getItem("userData"));
            const username = userData ? userData.username : "Неизвестный пользователь";
    
            const logData = {
                username: username,
                subjects: `Удален тариф: ${deletedTariff.name}`, 
            };
    
            await createSession(logData); 
    
            setTariffs((prevTariffs) => prevTariffs.filter(tariff => tariff.id !== id));
        } catch (error) {
            console.error("Ошибка при удалении: ", error);
        }
    };
    

    const handleEdit = (tariff) => {
        setEditTariff(tariff);
        setIsEditFormOpen(true);
    };

    const handleSaveEdit = async (updatedTariff) => {
        try {
            await updateTariff(updatedTariff.id, updatedTariff);
            
            const userData = JSON.parse(localStorage.getItem("userData"));
            const username = userData ? userData.username : "Неизвестный пользователь";
    
            const logData = {
                username: username,
                subjects: `Обновлен тариф: ${updatedTariff.name}`, 
            };
    
            await createSession(logData); 
            getAll(); 
            setIsEditFormOpen(false);
        } catch (error) {
            console.error("Ошибка при обновлении: ", error);
        }
    };
    

    const handleAddTariff = async (newTariff) => {
        await getAll(); 
        setIsTariffCreateOpen(false);
    };

    return (
        <>
            <Modal show={show} onHide={onClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Список Тарифов</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <TariffsTable tariffs={tariffs} onDelete={handleDelete} onEdit={handleEdit} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={openTariffCreate}>Добавить</Button>
                    <Button variant="secondary" onClick={onClose}>
                        Закрыть
                    </Button>
                </Modal.Footer>
            </Modal>
            
            <CreateTariffForm show={isTariffCreateOpen} onClose={closeTariffCreate} onAdd={handleAddTariff}/>
            <EditTariffForm
                show={isEditFormOpen}
                onClose={() => setIsEditFormOpen(false)}
                tariff={editTariff}
                onSave={handleSaveEdit}
            />
        </>
    );
};

export default TariffModal;
