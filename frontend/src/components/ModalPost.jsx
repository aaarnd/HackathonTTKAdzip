import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { createPost, createSession } from '../API/api';

const ModalPost = ({ show, onClose, username }) => {
    const [token, setToken] = useState(null);

    useEffect(() => {
        const storedToken = JSON.parse(localStorage.getItem("token"));
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    const validationSchema = Yup.object({
        date: Yup.string().required('Введите дату отправки'),
        time: Yup.string().required('Введите время отправки'),
        message: Yup.string().required('Введите текст рассылки'),
        photo: Yup.mixed().nullable(),
    });

    const initialValues = {
        date: "",
        time: "",
        message: "",
        photo: null,
    };

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        const formToSend = new FormData();
        formToSend.append('date', values.date);
        formToSend.append('time', values.time);
        formToSend.append('message', values.message);
        if (values.photo) {
            formToSend.append('photo', values.photo);
        }
    
        try {
            const result = await createPost(formToSend, token);
            console.log('Ответ сервера:', result);
    
            const userData = JSON.parse(localStorage.getItem("userData"));
            const username = userData ? userData.username : "Неизвестный пользователь"; 
    
            const logData = {
                username: username,
                subjects: `Был создан пост с отложенной отправкой: ${values.message}`, 
            };
    
            await createSession(logData); 
    
            resetForm();
            onClose();
        } catch (error) {
            console.error('Ошибка:', error);
    
            const userData = JSON.parse(localStorage.getItem("userData"));
            const username = userData ? userData.username : "Неизвестный пользователь"; 
    
            const logData = {
                username: username,
                subjects: `Ошибка создания поста: ${values.message}`

            };
    
            await createSession(logData);
        } finally {
            setSubmitting(false);
        }
    };
    

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Создание поста для рассылки</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ setFieldValue, isSubmitting }) => (
                        <FormikForm>
                            <Form.Group className="mb-3" controlId="formBasicDate">
                                <Form.Label>Дата отправки</Form.Label>
                                <Field
                                    type="date"
                                    name="date"
                                    className="form-control"
                                />
                                <ErrorMessage name="date" component="div" className="text-danger" />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicTime">
                                <Form.Label>Время отправки</Form.Label>
                                <Field
                                    type="time"
                                    name="time"
                                    className="form-control"
                                />
                                <ErrorMessage name="time" component="div" className="text-danger" />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicMessage">
                                <Form.Label>Текст рассылки</Form.Label>
                                <Field
                                    as="textarea"
                                    rows={3}
                                    name="message"
                                    className="form-control"
                                />
                                <ErrorMessage name="message" component="div" className="text-danger" />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicPhoto">
                                <Form.Label>Фотография (необязательно)</Form.Label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="form-control"
                                    onChange={(event) => {
                                        setFieldValue("photo", event.currentTarget.files[0]);
                                    }}
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Создание...' : 'Создать пост'}
                            </Button>
                        </FormikForm>
                    )}
                </Formik>
            </Modal.Body>
        </Modal>
    );
};

export default ModalPost;
