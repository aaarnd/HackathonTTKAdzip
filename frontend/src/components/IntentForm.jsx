import React, { useState, useEffect } from 'react';
import { Modal, Button, Table, FormControl, Form } from 'react-bootstrap';
import { createSession, addIntent, getAllIntents, deleteIntent, editIntent } from '../API/api';
import './styles/custom-table-styles.css';

const IntentForm = ({ show, onClose }) => {
    const [intents, setIntents] = useState([]);
    const [formData, setFormData] = useState({});
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editIntentId, setEditIntentId] = useState(null);

    useEffect(() => {
        if (show) fetchIntents();
    }, [show]);

    const fetchIntents = async () => {
        const fetchedIntents = await getAllIntents();
        setIntents(fetchedIntents);
    };

    const handleEditClick = (intent) => {
        setEditIntentId(intent.id);
        setFormData(intent);
        setShowEditModal(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSave = async () => {
        await editIntent(editIntentId, formData);

        const userData = JSON.parse(localStorage.getItem("userData"));
        const username = userData ? userData.username : "Неизвестный пользователь";

        const logData = {
            username: username,
            subjects: `Намерение "${formData.intent_name}" было изменено.`
        };
        await createSession(logData);

        setShowEditModal(false);
        fetchIntents();
    };

    const handleDelete = async (id) => {
        const userData = JSON.parse(localStorage.getItem("userData"));
        const username = userData ? userData.username : "Неизвестный пользователь";
        const intentToDelete = intents.find((intent) => intent.id === id);

        await deleteIntent(id);
        const logData = {
            username: username,
            subjects: `Было удалено намерение "${intentToDelete.intent_name}".`
        };
        await createSession(logData);
        fetchIntents();
    };

    const handleAddNewIntent = async () => {
        await addIntent(formData);

        const userData = JSON.parse(localStorage.getItem("userData"));
        const username = userData ? userData.username : "Неизвестный пользователь";

        const logData = {
            username: username,
            subjects: `Было добавлено новое намерение "${formData.intent_name}".`
        };
        await createSession(logData);

        setShowAddModal(false);
        fetchIntents();
    };

    return (
        <div className="manage-intents">
            <Modal show={show} onHide={onClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Список Намерений</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table striped bordered hover className="rounded-table table-custom">
                        <thead>
                            <tr>
                                <th>Название</th>
                                <th>Ключевые слова</th> 
                                <th>Ответ</th>
                                <th>Email</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {intents.map((intent, index) => (
                                <tr key={intent.id}>
                                    <td style={{ backgroundColor: index % 2 === 0 ? '#F05959' : '#FFFFFF', color: index % 2 === 0 ? '#000000' : '#000000' }} >{intent.intent_name}</td>
                                    <td style={{ backgroundColor: index % 2 === 0 ? '#F05959' : '#FFFFFF', color: index % 2 === 0 ? '#000000' : '#000000' }} >{intent.keywords}</td>
                                    <td style={{ backgroundColor: index % 2 === 0 ? '#F05959' : '#FFFFFF', color: index % 2 === 0 ? '#000000' : '#000000' }} >{intent.response_text}</td>
                                    <td style={{ backgroundColor: index % 2 === 0 ? '#F05959' : '#FFFFFF', color: index % 2 === 0 ? '#000000' : '#000000' }} >{intent.email}</td>
                                    <td style={{ backgroundColor: index % 2 === 0 ? '#F05959' : '#FFFFFF', color: index % 2 === 0 ? '#000000' : '#000000' }} >
                                        <Button style={{borderRadius: '35px'}} variant={index % 2 === 0 ? 'outline-light' : 'outline-secondary'} onClick={() => handleEditClick(intent)}>
                                            Изменить
                                        </Button>{' '}
                                        <Button style={{ borderRadius: '35px'}} variant={index % 2 === 0 ? 'outline-light' : 'outline-secondary'} onClick={() => handleDelete(intent.id)}>
                                            Удалить
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Modal.Body>
                <Modal.Footer>
                    <Button style={{backgroundColor: '#F05959', border: 'none', borderRadius: '35px'}} variant="secondary" onClick={() => setShowAddModal(true)}>
                        Добавить намерение
                    </Button>
                    <Button style={{borderRadius: '35px'}} variant="secondary" onClick={onClose}>
                        Закрыть
                    </Button>
                    
                </Modal.Footer>
            </Modal>

            <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Добавить новое намерение</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Название намерения</Form.Label>
                            <FormControl
                                type="text"
                                name="intent_name"
                                value={formData.intent_name || ""}
                                onChange={handleChange}
                                style={{ borderRadius: '35px'}}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Ключевые слова</Form.Label>
                            <FormControl
                                type="text"
                                name="keywords"
                                value={formData.keywords || ""}
                                onChange={handleChange}
                                style={{ borderRadius: '35px'}}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Ответ</Form.Label>
                            <FormControl
                                type="text"
                                name="response_text"
                                value={formData.response_text || ""}
                                onChange={handleChange}
                                style={{ borderRadius: '35px'}}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Email</Form.Label>
                            <FormControl
                                type="text"
                                name="email"
                                value={formData.email || ""}
                                onChange={handleChange}
                                style={{ borderRadius: '35px'}}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button style={{ borderRadius: '35px'}} variant="secondary" onClick={() => setShowAddModal(false)}>
                        Отмена
                    </Button>
                    <Button style={{backgroundColor: '#F05959', border: 'none', borderRadius: '35px'}} variant="primary" onClick={handleAddNewIntent}>
                        Сохранить
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Изменить намерение</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Название намерения</Form.Label>
                            <FormControl
                                type="text"
                                name="intent_name"
                                value={formData.intent_name || ""}
                                onChange={handleChange}
                                style={{ borderRadius: '35px'}}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Ключевые слова</Form.Label>
                            <FormControl
                                type="text"
                                name="keywords"
                                value={formData.keywords || ""}
                                onChange={handleChange}
                                style={{ borderRadius: '35px'}}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Ответ</Form.Label>
                            <FormControl
                                type="text"
                                name="response_text"
                                value={formData.response_text || ""}
                                onChange={handleChange}
                                style={{ borderRadius: '35px'}}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Email</Form.Label>
                            <FormControl
                                type="text"
                                name="email"
                                value={formData.email || ""}
                                onChange={handleChange}
                                style={{borderRadius: '35px'}}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button style={{borderRadius: '35px'}} variant="secondary" onClick={() => setShowEditModal(false)}>
                        Отмена
                    </Button>
                    <Button style={{backgroundColor: '#F05959', border: 'none', borderRadius: '35px'}} variant="primary" onClick={handleSave}>
                        Сохранить
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default IntentForm;
