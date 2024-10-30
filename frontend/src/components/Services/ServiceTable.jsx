import React from 'react';
import { Table, Button } from 'react-bootstrap';
import "../styles/tariff-tables.css";
import "../styles/custom-table-styles.css";

const ServiceTable = ({ options, onDelete, onEdit }) => {
    return (
        <Table striped bordered hover className="rounded-table table-custom">
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
                        <td style={{ backgroundColor: index % 2 === 0 ? '#F05959' : '#FFFFFF', color: index % 2 === 0 ? '#000000' : '#000000' }}>{option.id}</td>
                        <td style={{ backgroundColor: index % 2 === 0 ? '#F05959' : '#FFFFFF', color: index % 2 === 0 ? '#000000' : '#000000' }}>{option.name}</td>
                        <td style={{ backgroundColor: index % 2 === 0 ? '#F05959' : '#FFFFFF', color: index % 2 === 0 ? '#000000' : '#000000' }}>{option.description}</td>
                        <td style={{ backgroundColor: index % 2 === 0 ? '#F05959' : '#FFFFFF', color: index % 2 === 0 ? '#000000' : '#000000' }}>{option.price} руб.</td>
                        <td style={{ backgroundColor: index % 2 === 0 ? '#F05959' : '#FFFFFF', color: index % 2 === 0 ? '#000000' : '#000000' }}>
                            <Button style={{ borderRadius: '35px'}} variant={index % 2 === 0 ? 'outline-light' : 'outline-secondary'} onClick={() => {console.log("ServiceTable: ", option); onEdit(option)}}>Изменить</Button>
                        </td>
                        <td style={{ backgroundColor: index % 2 === 0 ? '#F05959' : '#FFFFFF', color: index % 2 === 0 ? '#000000' : '#000000' }}>
                            <Button style={{ borderRadius: '35px'}} variant={index % 2 === 0 ? 'outline-light' : 'outline-secondary'} onClick={() => onDelete(option.id)}>Удалить</Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

export default ServiceTable;
