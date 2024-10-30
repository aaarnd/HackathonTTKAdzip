import React from 'react';
import { Table } from 'react-bootstrap';
import "./styles/custom-table-styles.css";


const UsersTable = ({ users, onDelete, onChangeRole }) => {
    return (
        <Table striped bordered hover className="table-custom">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Логин</th>
                    <th>ФИО</th>
                    <th>Роль</th>
                    <th></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {users.map((user, index) => (
                    <tr key={user.id}>
                        <td style={{ backgroundColor: index % 2 === 0 ? '#F05959' : '#FFFFFF', color: index % 2 === 0 ? '#000000' : '#000000' }}>{user.id}</td>
                        <td style={{ backgroundColor: index % 2 === 0 ? '#F05959' : '#FFFFFF', color: index % 2 === 0 ? '#000000' : '#000000' }}>{user.username}</td>
                        <td style={{ backgroundColor: index % 2 === 0 ? '#F05959' : '#FFFFFF', color: index % 2 === 0 ? '#000000' : '#000000' }}>{user.personal_info}</td>
                        <td style={{ backgroundColor: index % 2 === 0 ? '#F05959' : '#FFFFFF', color: index % 2 === 0 ? '#000000' : '#000000' }}>{user.role}</td>
                        <td style={{ backgroundColor: index % 2 === 0 ? '#F05959' : '#FFFFFF', color: index % 2 === 0 ? '#000000' : '#000000' }}>
                            <select 
                                value={user.role} 
                                onChange={(e) => onChangeRole(user.id, e.target.value)} 
                                style={{ width: '100%', padding: '5px' }}
                            >
                                <option value="admin">Admin</option>
                                <option value="editor">Editor</option>
                            </select>
                        </td>
                        <td style={{ backgroundColor: index % 2 === 0 ? '#F05959' : '#FFFFFF', color: index % 2 === 0 ? '#000000' : '#000000' }}>
                            <span 
                                onClick={() => onDelete(user.id)} 
                                style={{
                                    color: 'black',
                                    fontSize: '25px',
                                    cursor: 'pointer', // Изменяем курсор на указатель
                                    padding: '0',
                                    backgroundColor: "transparent" /* Белый цвет с 80% прозрачностью */
                                }}
                                title="Удалить пользователя" // Подсказка при наведении
                            >
                                ×
                            </span>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

export default UsersTable;
