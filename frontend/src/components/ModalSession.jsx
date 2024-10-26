import React, { useEffect, useState } from 'react';
import { Modal, Button, Table } from 'react-bootstrap';
import { getSessions } from '../API/api';

const ModalSession = ({ show, onClose }) => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (show) {
            fetchSessions();
        }
    }, [show]);

    const fetchSessions = async () => {
        setLoading(true);
        try {
            const data = await getSessions();
            setSessions(data);
        } catch (error) {
            console.error("Ошибка при загрузке логов:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Логи активности</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading ? (
                    <p>Загрузка логов...</p>
                ) : (
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Дата</th>
                                <th>Время</th>
                                <th>Пользователь</th>
                                <th>Событие</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sessions.map((session, index) => (
                                <tr key={index}>
                                    <td>{new Date(session.date).toLocaleDateString()}</td>
                                    <td>{new Date(session.date).toLocaleTimeString()}</td>
                                    <td>{session.username}</td>
                                    <td>{session.action}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Закрыть
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalSession;
