import React, { useEffect, useState } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { Formik, Field, Form as FormikForm, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { createPost, createSession } from '../API/api';
import { FaPlus } from 'react-icons/fa';
import './styles/login-page.css';

const ModalPost = ({ show, onClose }) => {
    const [token, setToken] = useState(null);
    const [preview, setPreview] = useState(null); // State for image preview

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
            setPreview(null); // Clear preview after successful submission
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
        <Modal show={show} onHide={onClose} dialogClassName="rounded-modal">
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
                            <Row>
                                {/* Левая колонка с загрузкой фотографии */}
                                <Col md={4} className="d-flex flex-column align-items-center justify-content-center">
                                    <Form.Group controlId="formBasicPhoto" className="text-center h-100 w-100">
                                        <div
                                            className="border d-flex flex-column align-items-center justify-content-center"
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                cursor: 'pointer',
                                                borderColor: '#ced4da',
                                                borderStyle: 'dashed',
                                                borderRadius: '35px',
                                                position: 'relative',
                                                overflow: 'hidden',
                                            }}
                                            onClick={() => document.getElementById('fileInput').click()}
                                        >
                                            {preview ? (
                                                <img
                                                    src={preview}
                                                    alt="preview"
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '35px' }}
                                                />
                                            ) : (
                                                <>
                                                    <FaPlus size={50} color="#F05959" />
                                                    <div className="mt-2" style={{ color: '#F05959' }}>Добавить фото</div>
                                                </>
                                            )}
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="d-none"
                                            id="fileInput"
                                            onChange={(event) => {
                                                const file = event.currentTarget.files[0];
                                                setFieldValue("photo", file);
                                                setPreview(URL.createObjectURL(file)); // Set preview image
                                            }}
                                        />
                                    </Form.Group>
                                </Col>

                                {/* Правая колонка с полями ввода */}
                                <Col md={8}>
                                    <Form.Group className="mb-3" controlId="formBasicMessage">
                                        <Form.Label>Текст рассылки</Form.Label>
                                        <Field
                                            as="textarea"
                                            rows={6}
                                            name="message"
                                            className="form-control"
                                            style={{ borderRadius: '35px' }}
                                        />
                                        <ErrorMessage name="message" component="div" className="text-danger" />
                                    </Form.Group>

                                    <Row>
                                        <Col xs={4}>
                                            <Form.Group controlId="formBasicDate">
                                                <Field
                                                    type="date"
                                                    name="date"
                                                    className="form-control"
                                                    placeholder="дд.мм.гггг"
                                                    style={{ borderRadius: '35px' }}
                                                />
                                                <ErrorMessage name="date" component="div" className="text-danger" />
                                            </Form.Group>
                                        </Col>
                                        <Col xs={4}>
                                            <Form.Group controlId="formBasicTime">
                                                <Field
                                                    type="time"
                                                    name="time"
                                                    className="form-control"
                                                    style={{ borderRadius: '35px' }}
                                                />
                                                <ErrorMessage name="time" component="div" className="text-danger" />
                                            </Form.Group>
                                        </Col>
                                        <Col xs={4} className="d-flex align-items-end">
                                            <Button style={{ backgroundColor: '#F05959', border: 'none', borderRadius: '35px' }} variant="primary" type="submit" disabled={isSubmitting} className="w-100">
                                                {isSubmitting ? 'Создание...' : 'Отправить'}
                                            </Button>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </FormikForm>
                    )}
                </Formik>
            </Modal.Body>
        </Modal>
    );
};

export default ModalPost;
