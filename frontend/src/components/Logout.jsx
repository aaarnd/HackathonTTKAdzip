import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { createSession } from "../API/api";

const Logout = () => { 
    const navigate = useNavigate();

    const logout = async () => { 
        const userData = JSON.parse(localStorage.getItem("userData"));
        
        if (userData) {
            await createSession({
                username: userData.username,
                subjects: `Пользователь ${userData.username} вышел из системы`
            });
        }

        localStorage.removeItem("userData");
        navigate("/login");
    };
    
    return (
        <Button variant="danger" onClick={logout}>Выйти</Button>
    );
};

export default Logout;
