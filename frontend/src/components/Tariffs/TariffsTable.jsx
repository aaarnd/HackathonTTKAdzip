import React from 'react';
import { Table, Button } from 'react-bootstrap';
import "../styles/tariff-tables.css"
import "../styles/custom-table-styles.css";

const TariffsTable = ({ tariffs, onDelete, onEdit }) => {
    return (
        <Table striped bordered hover className="rounded-table table-custom">
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
                        <td style={{ backgroundColor: index % 2 === 0 ? '#F05959' : '#FFFFFF', color: index % 2 === 0 ? '#000000' : '#000000' }}>{tariff.id}</td>
                        <td style={{ backgroundColor: index % 2 === 0 ? '#F05959' : '#FFFFFF', color: index % 2 === 0 ? '#000000' : '#000000' }}>{tariff.name}</td>
                        <td style={{ backgroundColor: index % 2 === 0 ? '#F05959' : '#FFFFFF', color: index % 2 === 0 ? '#000000' : '#000000' }}>{tariff.description}</td>
                        <td style={{ backgroundColor: index % 2 === 0 ? '#F05959' : '#FFFFFF', color: index % 2 === 0 ? '#000000' : '#000000' }}>{tariff.price} руб./мес.</td>
                        <td style={{ backgroundColor: index % 2 === 0 ? '#F05959' : '#FFFFFF', color: index % 2 === 0 ? '#000000' : '#000000' }}>
                            <Button variant={index % 2 === 0 ? 'outline-light' : 'outline-secondary'} style={{borderRadius: '35px'}} onClick={() => onEdit(tariff)}>Изменить</Button>
                        </td>
                        <td style={{ backgroundColor: index % 2 === 0 ? '#F05959' : '#FFFFFF', color: index % 2 === 0 ? '#000000' : '#000000' }}>
                            <Button variant={index % 2 === 0 ? 'outline-light' : 'outline-secondary'} style={{borderRadius: '35px'}} onClick={() => onDelete(tariff.id)}>Удалить</Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

export default TariffsTable;
