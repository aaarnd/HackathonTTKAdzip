import React, { useState, useEffect } from 'react';
import { Modal, Button, Table, FormControl, Form } from 'react-bootstrap';
import { createSession, addIntent, getAllIntents, deleteIntent, editIntent } from '../API/api';

const IntentForm = ({ show, onClose }) => {
    const [intents, setIntents] = useState([]);
    const [editMode, setEditMode] = useState(null);
    const [formData, setFormData] = useState({});
    const [showAddModal, setShowAddModal] = useState(false);

    useEffect(() => {
        if (show) fetchIntents();
    }, [show]);

    const fetchIntents = async () => {
        const fetchedIntents = await getAllIntents();
        setIntents(fetchedIntents);
    };

    const handleEditClick = (intent) => {
        setEditMode(intent.id);
        setFormData(intent);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSave = async () => {
        await editIntent(formData.id, formData);

        const userData = JSON.parse(localStorage.getItem("userData"));
        const username = userData ? userData.username : "Неизвестный пользователь";

        const logData = {
            username: username,
            subjects: `Намерение "${formData.intent_name}" было изменено.`
        };
        await createSession(logData);

        setEditMode(null);
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
                    <Table striped bordered hover responsive>
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
                            {intents.map((intent) => (
                                <tr key={intent.id}>
                                    {editMode === intent.id ? (
                                        <>
                                            <td>
                                                <FormControl
                                                    type="text"
                                                    name="intent_name"
                                                    value={formData.intent_name}
                                                    onChange={handleChange}
                                                />
                                            </td>
                                            <td>
                                                <FormControl
                                                    type="text"
                                                    name="keywords"
                                                    value={formData.keywords}
                                                    onChange={handleChange}
                                                />
                                            </td>
                                            <td>
                                                <FormControl
                                                    type="text"
                                                    name="response_text"
                                                    value={formData.response_text}
                                                    onChange={handleChange}
                                                />
                                            </td>
                                            <td>
                                                <FormControl
                                                    type="text"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                />
                                            </td>
                                            <td>
                                                <Button variant="success" onClick={handleSave}>
                                                    Сохранить
                                                </Button>{' '}
                                                <Button variant="secondary" onClick={() => setEditMode(null)}>
                                                    Отмена
                                                </Button>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td>{intent.intent_name}</td>
                                            <td>{intent.keywords}</td>
                                            <td>{intent.response_text}</td>
                                            <td>{intent.email}</td>
                                            <td>
                                                <Button variant="warning" onClick={() => handleEditClick(intent)}>
                                                    Изменить
                                                </Button>{' '}
                                                <Button variant="danger" onClick={() => handleDelete(intent.id)}>
                                                    Удалить
                                                </Button>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose}>
                        Закрыть
                    </Button>
                    <Button variant="primary" onClick={() => setShowAddModal(true)}>
                        Добавить намерение
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
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Ключевые слова</Form.Label>
                            <FormControl
                                type="text"
                                name="keywords"
                                value={formData.keywords || ""}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Ответ</Form.Label>
                            <FormControl
                                type="text"
                                name="response_text"
                                value={formData.response_text || ""}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Email</Form.Label>
                            <FormControl
                                type="text"
                                name="email"
                                value={formData.email || ""}
                                onChange={handleChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                        Отмена
                    </Button>
                    <Button variant="primary" onClick={handleAddNewIntent}>
                        Сохранить
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default IntentForm;
