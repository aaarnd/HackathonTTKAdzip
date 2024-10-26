import React from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { addOption, createSession } from "../../API/api";

const validationSchema = Yup.object({
    name: Yup.string()
        .min(3, "Название услуги должно иметь больше 3-х символов")
        .required("Поле обязательно для заполнения"),
    description: Yup.string()
        .min(5, "Описание должно содержать более 5 символов")
        .required("Поле обязательно для заполнения"),
    price: Yup.number()
        .typeError("Цена должна быть числом") 
        .min(0, "Цена должна быть неотрицательной") 
        .required("Поле обязательно для заполнения"),
});

const CreateServiceForm = ({ show, onClose, onAdd }) => {
    const handleSubmit = async (values) => {
        try {
            const newService = await addOption(values);
            console.log(newService);
            
            const userData = JSON.parse(localStorage.getItem("userData"));
            const username = userData ? userData.username : "Неизвестный пользователь"; 

            const logData = {
                username: username,
                subjects: `Была добавлена услуга: ${values.name}`, 
            };

            await createSession(logData); 
            onAdd(newService); 
            onClose();
        } catch (error) {
            console.error("Ошибка при создании услуги: ", error);
        }
    };

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Добавить услугу</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Formik
                    initialValues={{ name: "", description: "", price: "" }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ handleSubmit }) => (
                        <Form noValidate onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="formBasicName">
                                <Form.Label>Название</Form.Label>
                                <Field
                                    as={Form.Control}
                                    type="text"
                                    name="name"
                                    placeholder="Введите название услуги"
                                />
                                <ErrorMessage name="name" component="div" className="text-danger" />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicDescription">
                                <Form.Label>Описание</Form.Label>
                                <Field
                                    as={Form.Control}
                                    type="text"
                                    name="description"
                                    placeholder="Введите описание"
                                />
                                <ErrorMessage name="description" component="div" className="text-danger" />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicPrice">
                                <Form.Label>Цена</Form.Label>
                                <Field
                                    as={Form.Control}
                                    type="text"
                                    name="price"
                                    placeholder="Введите цену услуги"
                                />
                                <ErrorMessage name="price" component="div" className="text-danger" />
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Добавить
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Modal.Body>
        </Modal>
    );
};

export default CreateServiceForm;
