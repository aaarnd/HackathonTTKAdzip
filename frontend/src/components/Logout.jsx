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
        <Button variant="link" onClick={logout} style={{ padding: 0 }}>
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAB2ElEQVR4nO2ZsU7DMBRFjZBgYUFtdF+gqhg6Vcws7DDAVj6lhQ+AnQ/gC5j4AFQGGFhAYmcvE1KhiV8qhiBX7gBqk4g8Q4N8pEyN7vO1X2pbVymPxz0JcKiJ+pooYqK07KOJRkYvAQ6cD56BM4lBz32AU6czP5kxINFE3aheDyV0jY4GekbX6DtbCU10Y5e860QfOLb6fVcGRqZAFATkQj8KArIG3l3oq2mfOhH/jRrsDeTDfgUy8C1UAPYttKAtpImeGHgstfv/pQEGHuwm98zAlqi4JDynxrDZXGeie/v7YAxsi4lLwhk10iBY00TX9tT6GgM7YuJScE6NtNVaZeDKttNQh+GumLgEDNwxcJv1TtpurzDRpTURcRjuLYyBoqRKLWuiC3s/GcdER5UyYEiVWmLg3K7ER64JCQOTFnF3JX2puoGBcwO5Bql4jRkt1BET/ylcsMaMj7gjJl4GLlDjy98oEHMY7ouJl4Urv5HRPz1KDKt+mOOqH6d11S80IngDBWC/Ahn4FioA+xbKwAQPZoakoqXvxI3Gpt2s3lwZ6NsTYM+JPnDiNGIy4Zs1kJg8K67VNiR0jY4ZvAbGRt9p3Gpi0MrGrFPMDNmgexL6VSro9nhUJp9pUv9OCX4JWwAAAABJRU5ErkJggg=="
                style={{height: '40px'}}
            />
        </Button>
    );
};

export default Logout;
