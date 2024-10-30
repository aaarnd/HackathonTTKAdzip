import React from "react";
import { Navbar, Container, ListGroup } from "react-bootstrap";
import { FaSignOutAlt } from "react-icons/fa";
import Logout from "./Logout"; // Компонент для выхода

const NavBar = ({ fullName, role }) => {
    return (
        <Navbar expand="lg" className="bg-body-danger sticky-top">
            <Container>
                <Navbar.Brand href="#home">
                    <img 
                        src="https://static.tildacdn.com/tild3966-3232-4831-b935-316464613662/logo_2_1.svg" 
                        alt="Logo" 
                        style={{ height: '40px', marginRight: '10px' }} 
                    />
                </Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <ListGroup style={{ marginRight: '15px', textAlign: 'right' }}>
                            <ListGroup.Item style={{ border: "none", padding: 0, backgroundColor: '#F3F3F3' }}>
                                <strong>{fullName}</strong>
                            </ListGroup.Item>
                            <ListGroup.Item style={{ border: "none", padding: 0, fontSize: '0.9em', color: 'gray', backgroundColor: '#F3F3F3' }}>
                                {role}
                            </ListGroup.Item>
                        </ListGroup>
                        <Logout /> 
                    </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavBar;
