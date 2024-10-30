import React, { useEffect, useState } from 'react';
import { Modal, Button, Table } from 'react-bootstrap';
import { getSessions } from '../API/api';
import './styles/custom-table-styles.css'; // Импортируем файл со стилями

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
        <Modal className='' show={show} onHide={onClose} >
            <Modal.Header closeButton>
                <Modal.Title>Логи активности</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading ? (
                    <p>Загрузка логов...</p>
                ) : (
                    <Table className="table-custom" bordered hover>
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
                                    <td style={{ backgroundColor: index % 2 === 0 ? '#F05959' : '#FFFFFF', color: index % 2 === 0 ? '#000000' : '#000000' }}>
                                        {new Date(session.date).toLocaleDateString()}
                                    </td>
                                    <td style={{ backgroundColor: index % 2 === 0 ? '#F05959' : '#FFFFFF', color: index % 2 === 0 ? '#000000' : '#000000' }}>
                                        {new Date(session.date).toLocaleTimeString()}
                                    </td>
                                    <td style={{ backgroundColor: index % 2 === 0 ? '#F05959' : '#FFFFFF', color: index % 2 === 0 ? '#000000' : '#000000' }}>
                                        {session.username}
                                    </td>
                                    <td style={{ backgroundColor: index % 2 === 0 ? '#F05959' : '#FFFFFF', color: index % 2 === 0 ? '#000000' : '#000000' }}>
                                        {session.action}
                                    </td>
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
