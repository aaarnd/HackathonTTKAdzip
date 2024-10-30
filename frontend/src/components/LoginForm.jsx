import React from "react";
import { Button, Form } from "react-bootstrap";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import CryptoJS from "crypto-js";
import { loginUser, createSession } from "../API/api";
import { useNavigate } from "react-router-dom"; 
import './styles/login-page.css';

const validationSchema = Yup.object({
    username: Yup.string()
        .min(3, "Имя пользователя должно быть не менее 3 символов")
        .required("Поле обязательно для заполнения"),
    hashed_password: Yup.string()
        .min(6, "Пароль должен быть не менее 6 символов")
        .required("Поле обязательно для заполнения"),
});

const LoginForm = () => {
    const navigate = useNavigate(); 
    const hashPassword = (password) => CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
    const [loginError, setLoginError] = React.useState(''); 

    const handleSubmit = async (values) => {

        const cleanedUsername = values.username.trim();
        console.log("Данные формы:", { ...values, username: cleanedUsername });
        const hashedPassword = hashPassword(values.hashed_password);
        
        try {
            await loginUser(cleanedUsername, hashedPassword);
            console.log(cleanedUsername, hashedPassword);

            await createSession({
                username: cleanedUsername,
                subjects: `Пользователь ${cleanedUsername} успешно вошел в систему`,
            });

            navigate('/home'); 
        } catch (error) {
            console.error('Ошибка входа', error);

            await createSession({
                username: cleanedUsername,
                subjects: `${cleanedUsername} неудачный вход в систему!`,
            });

            if (error.response && error.response.data.message === 'Login failed') {
                setLoginError('Логин или пароль неверны'); 
            } else {
                setLoginError('Введены некорректные данные!'); 
            }
        }
    };

    return (
        <Formik
            initialValues={{ email: "", username: "", hashed_password: "" }}
            validationSchema={validationSchema} 
            onSubmit={handleSubmit} 
        >
            {({ handleSubmit, handleChange, values, errors, touched }) => (
                <Form noValidate onSubmit={handleSubmit} classN>
                    <Form.Group className="mb-3" controlId="formBasicUsername">
                        <Form.Label>Имя пользователя</Form.Label>
                        <Field
                            as={Form.Control}
                            type="text"
                            name="username"
                            placeholder="Логин"
                            className="rounded-input"
                            isInvalid={touched.username && !!errors.username}
                            style={{borderRadius: '35px'}}
                        />
                        <Form.Control.Feedback type="invalid">
                            <ErrorMessage name="username" />
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Пароль</Form.Label>
                        <Field
                            as={Form.Control}
                            type="password"
                            name="hashed_password"
                            placeholder="Пароль"
                            isInvalid={touched.hashed_password && !!errors.hashed_password} 
                            style={{ borderRadius: '35px'}}
                        />
                        <Form.Control.Feedback type="invalid">
                            <ErrorMessage name="hashed_password" />
                        </Form.Control.Feedback>
                        <Form.Text className="text-muted">
                            Никому не сообщайте свой пароль
                        </Form.Text>
                    </Form.Group>
                    {loginError && <div className="text-danger mb-3">{loginError}</div>} 
                    <Button style={{backgroundColor: '#F05959', border: 'none', borderRadius: '35px'}} variant="danger" type="submit">
                        Авторизация
                    </Button>
                </Form>
            )}
        </Formik>
    );
};

export default LoginForm;
