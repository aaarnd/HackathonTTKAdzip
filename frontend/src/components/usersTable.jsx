import React from 'react';
import { Table, Button } from 'react-bootstrap';

const UsersTable = ({ users, onDelete, onChangeRole }) => {
    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Логин</th>
                    <th>ФИО</th>
                    <th>Роль</th>
                </tr>
            </thead>
            <tbody>
                {users.map((user) => (
                    <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.username}</td>
                        <td>{user.personal_info}</td>
                        <td>{user.role}</td>
                        <td>
                            <select 
                                value={user.role} 
                                onChange={(e) => onChangeRole(user.id, e.target.value)} 
                                style={{ width: '100%', padding: '5px' }}
                            >
                                <option value="admin">Admin</option>
                                <option value="editor">Editor</option>
                            </select>
                        </td>
                        <td>
                            <Button 
                                variant="danger" 
                                onClick={() => onDelete(user.id)}
                            >
                                <i className="fas fa-times" style={{ color: 'white' }}></i>
                            </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

export default UsersTable;
