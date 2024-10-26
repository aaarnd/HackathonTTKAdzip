import React from 'react';
import { Table, Button } from 'react-bootstrap';
import "../styles/tariff-tables.css"

const TariffsTable = ({ tariffs, onDelete, onEdit }) => {
    return (
        <Table striped bordered hover className="rounded-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Название</th>
                    <th>Описание</th>
                    <th>Цена тарифа</th>
                    <th>Изменение</th>
                    <th>Удаление</th>
                </tr>
            </thead>
            <tbody>
                {tariffs.map((tariff, index) => (
                    <tr key={tariff.id} className={index % 2 === 0 ? 'bg-red' : 'bg-white'}>
                        <td>{tariff.id}</td>
                        <td>{tariff.name}</td>
                        <td>{tariff.description}</td>
                        <td>{tariff.price} руб./мес.</td>
                        <td>
                            <Button variant="outline-secondary" onClick={() => onEdit(tariff)}>Изменить</Button>
                        </td>
                        <td>
                            <Button variant="outline-secondary" onClick={() => onDelete(tariff.id)}>Удалить</Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

export default TariffsTable;
