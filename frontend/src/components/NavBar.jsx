import React from "react";
import { Navbar, Button, Nav, NavDropdown, Container, ListGroup } from "react-bootstrap";

const NavBar = ({fullName, role}) => {
    return (
    <Navbar expand="lg" className="bg-body-danger sticky-top">
      <Container>
        <Navbar.Brand href="#home">Navbar with text</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <ListGroup>
            <ListGroup.Item style={{border: "none"}} className="text-center">{`${fullName}`}</ListGroup.Item>
            <ListGroup.Item style={{border: "none"}} className="text-center">{`${role}`}</ListGroup.Item>
          </ListGroup>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    )
}

export default NavBar;