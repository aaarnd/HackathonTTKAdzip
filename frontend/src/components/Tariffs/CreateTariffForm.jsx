import React from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { createTariff, createSession } from "../../API/api";

const validationSchema = Yup.object({
    name: Yup.string()
        .min(3, "Название тарифа должно иметь больше 3-х символов")
        .required("Поле обязательно для заполнения"),
    description: Yup.string()
        .min(5, "Описание должно содержать более 5 символов")
        .required("Поле обязательно для заполнения"),
        price: Yup.number()
        .typeError("Цена должна быть числом") 
        .min(0, "Цена должна быть неотрицательной") 
        .required("Поле обязательно для заполнения"),
});

const CreateTariffForm = ({ show, onClose, onAdd }) => {

    const handleSubmit = async (values) => {
        try {
            const newTariff = await createTariff(values);
            console.log(newTariff);
            const userData = JSON.parse(localStorage.getItem("userData"));
            const username = userData ? userData.username : "Неизвестный пользователь"; 
    
            const logData = {
                username: username,
                subjects: `Был добавлен тариф: ${values.name}`, 
            };
    
            await createSession(logData); 
            onAdd(newTariff); 
            onClose();
        } catch (error) {
            console.error("Ошибка при создании тарифа: ", error);
        }
    };

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Добавить тариф</Modal.Title>
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
                                    placeholder="Введите название тарифа"
                                    style={{borderRadius: '35px'}}
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
                                    style={{borderRadius: '35px'}}
                                />
                                <ErrorMessage name="description" component="div" className="text-danger" />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="formBasicPrice">
                                <Form.Label>Цена</Form.Label>
                                <Field
                                    as={Form.Control}
                                    type="text"
                                    name="price"
                                    placeholder="Введите цену тарифа"
                                    style={{borderRadius: '35px'}}
                                />
                                <ErrorMessage name="price" component="div" className="text-danger" />
                            </Form.Group>
                            <Button style={{backgroundColor: '#F05959', border: 'none', borderRadius: '35px'}} variant="primary" type="submit">
                                Добавить
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Modal.Body>
        </Modal>
    );
};

export default CreateTariffForm;
