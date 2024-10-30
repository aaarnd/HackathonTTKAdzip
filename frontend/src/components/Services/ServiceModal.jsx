import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import ServiceTable from './ServiceTable'; 
import { getOptions, deleteOption, updateOption, createSession } from '../../API/api'; 
import EditServiceForm from './EditServiceForm'; 
import CreateServiceForm from './CreateServiceForm'; 

const ServiceModal = ({ show, onClose }) => {
    const [options, setOptions] = useState([]);
    const [editOption, setEditOption] = useState(null);
    const [isEditFormOpen, setIsEditFormOpen] = useState(false);
    const [isOptionCreateOpen, setIsOptionCreateOpen] = useState(false);

    const openOptionCreate = () => setIsOptionCreateOpen(true);
    const closeOptionCreate = () => setIsOptionCreateOpen(false);

    const getAll = async () => {
        const optionsData = await getOptions();
        setOptions(optionsData);
    };

    useEffect(() => {
        if (show) {
            getAll();
        }
    }, [show]);

    const handleDelete = async (id) => {
        try {
            const deletedOption = options.find(option => option.id === id);
            
            if (!deletedOption) {
                console.error("Услуга не найдена");
                return;
            }

            await deleteOption(id);
    
            const userData = JSON.parse(localStorage.getItem("userData"));
            const username = userData ? userData.username : "Неизвестный пользователь";

            const logData = {
                username: username,
                subjects: `Удалена услуга: ${deletedOption.name}`, 
            };

            await createSession(logData); 
    
            setOptions((prevOptions) => prevOptions.filter(option => option.id !== id));
        } catch (error) {
            console.error("Ошибка при удалении: ", error);
        }
    };

    const handleEdit = (option) => {
        console.log("Service Modal handleEdit: ", option)
        setEditOption(option);
        setIsEditFormOpen(true);
    };

    const handleSaveEdit = async (updatedOption, id) => {
        try {
            console.log('Суета: ', id)
            await updateOption(id, updatedOption);
            
            const userData = JSON.parse(localStorage.getItem("userData"));
            const username = userData ? userData.username : "Неизвестный пользователь";

            const logData = {
                username: username,
                subjects: `Обновлена услуга: ${updatedOption.name}`, 
            };

            await createSession(logData); 
            
            getAll(); 
            setIsEditFormOpen(false);
        } catch (error) {
            console.error("Ошибка при обновлении: ", error);
        }
    };

    const handleAddOption = async (newOption) => {
        await getAll(); 
        setIsOptionCreateOpen(false);
    };

    return (
        <>
            <Modal show={show} onHide={onClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Список Услуг</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ServiceTable options={options} onDelete={handleDelete} onEdit={handleEdit} /> 
                </Modal.Body>
                <Modal.Footer>
                    <Button style={{backgroundColor: '#F05959', border: 'none', borderRadius: '35px'}} variant="secondary" onClick={openOptionCreate}>Добавить</Button>
                    <Button style={{ borderRadius: '35px'}} variant="secondary" onClick={onClose}>
                        Закрыть
                    </Button>
                </Modal.Footer>
            </Modal>
            
            <CreateServiceForm show={isOptionCreateOpen} onClose={closeOptionCreate} onAdd={handleAddOption}/>
            <EditServiceForm
                show={isEditFormOpen}
                onClose={() => setIsEditFormOpen(false)}
                option={editOption}
                onSave={handleSaveEdit}
            />
        </>
    );
};

export default ServiceModal;
