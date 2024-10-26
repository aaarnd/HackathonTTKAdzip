import React from 'react';
import { Table, Button } from 'react-bootstrap';
import "../styles/tariff-tables.css";

const ServiceTable = ({ options, onDelete, onEdit }) => {
    return (
        <Table striped bordered hover className="rounded-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Название</th>
                    <th>Описание</th>
                    <th>Цена услуги</th>
                    <th>Изменение</th>
                    <th>Удаление</th>
                </tr>
            </thead>
            <tbody>
                {options.map((option, index) => (
                    <tr key={option.id} className={index % 2 === 0 ? 'bg-red' : 'bg-white'}>
                        <td>{option.id}</td>
                        <td>{option.name}</td>
                        <td>{option.description}</td>
                        <td>{option.price} руб.</td>
                        <td>
                            <Button variant="outline-secondary" onClick={() => onEdit(option)}>Изменить</Button>
                        </td>
                        <td>
                            <Button variant="outline-secondary" onClick={() => onDelete(option.id)}>Удалить</Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

export default ServiceTable;
