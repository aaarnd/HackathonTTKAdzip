import React from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import CryptoJS from "crypto-js";
import { createUser, createSession } from "../API/api";


const validationSchema = Yup.object({

    username: Yup.string()
        .min(3, "Имя пользователя должно быть не менее 3 символов")
        .required("Поле обязательно для заполнения"),
    name: Yup.string()
    .min(3, "Имя должно быть не менее 1 символа")
    .required("Поле обязательно для заполнения"),    
    surname: Yup.string()
        .min(3, "Фамилия пользователя должно быть не менее 1 символа")
        .required("Поле обязательно для заполнения"),
    patronymic: Yup.string()
    .min(3, "Отчество пользователя должно быть не менее 1 символа")
    .required("Поле обязательно для заполнения"),
    hashed_password: Yup.string()
        .min(6, "Пароль должен быть не менее 6 символов")
        .required("Поле обязательно для заполнения"),
    role: Yup.string()
    .required("Поле обязательно для заполнения"),
});

const ModalReg = ({ show, onClose }) => {
    const handleSubmit = async (values) => {
        values.hashed_password = CryptoJS.SHA256(values.hashed_password).toString(CryptoJS.enc.Hex);
        console.log("Данные формы: ", values);
        
        try {
            await createUser(values);
    
            const logData = {
                username: JSON.parse(localStorage.getItem("userData")).username, 
                subjects: `Был зарегистрирован пользователь с именем: ${values.username} и ролью ${values.role}`,
            };
            await createSession(logData); 
            
            onClose(); 
        } catch (error) {
            console.error("Ошибка регистрации:", error);
            
            const logData = {
                username: JSON.parse(localStorage.getItem("userData")).username,
                subjects: `Ошибка регистрации пользователя с именем: ${values.username} и ролью ${values.role}`,
            };
            await createSession(logData);
        }
    };
    

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Регистрация пользователя</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Formik
                    initialValues={{ username: "", hashed_password: "" }}
                    validationSchema={validationSchema} 
                    onSubmit={handleSubmit} 
                >
                    {({ handleSubmit, handleChange, values, errors, touched }) => (
                        <Form noValidate onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="formBasicUsername">
                                <Form.Label>Имя пользователя</Form.Label>
                                <Field
                                    as={Form.Control}
                                    type="text"
                                    name="username"
                                    placeholder="Введите имя пользователя"
                                    isInvalid={touched.username && !!errors.username}
                                />
                                <Form.Control.Feedback type="invalid">
                                    <ErrorMessage name="username" />
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicSurname">
                                <Form.Label>Фамилия</Form.Label>
                                <Field
                                    as={Form.Control}
                                    type="text"
                                    name="surname"
                                    placeholder="Введите фамилию"
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicName">
                                <Form.Label>Имя</Form.Label>
                                <Field
                                    as={Form.Control}
                                    type="text"
                                    name="name"
                                    placeholder="Введите настоящее имя"
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicPatronymic">
                                <Form.Label>Отчество</Form.Label>
                                <Field
                                    as={Form.Control}
                                    type="text"
                                    name="patronymic"
                                    placeholder="Введите отчество"
                                />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Пароль</Form.Label>
                                <Field
                                    as={Form.Control}
                                    type="password"
                                    name="hashed_password"
                                    placeholder="Пароль"
                                    isInvalid={touched.hashed_password && !!errors.hashed_password}
                                />
                                <Form.Control.Feedback type="invalid">
                                    <ErrorMessage name="password" />
                                </Form.Control.Feedback>
                                <Form.Text className="text-muted">
                                    Не передавайте пароль никому кроме пользователя лично
                                </Form.Text>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicRole">
                                <Form.Label>Роль</Form.Label>
                                <Field
                                    as="select"
                                    name="role"
                                    className="form-control"
                                    isInvalid={touched.role && !!errors.role}
                                >
                                    <option value="">Выберите роль</option>
                                    <option value="admin">Администратор</option>
                                    <option value="editor">Редактор</option>
                                </Field>
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Зарегистрировать
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Modal.Body>
        </Modal>
    );
};

export default ModalReg;