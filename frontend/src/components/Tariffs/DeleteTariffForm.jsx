import React from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { deleteTariff } from "../../API/api";

const validationSchema = Yup.object({
    id: Yup.number()
        .typeError("ID должен быть числом") // Проверка на тип
        .required("Поле обязательно для заполнения"),
});

const DeleteTariffForm = ({ show, onClose }) => {
    const handleSubmit = async (values) => {
        try {
            await deleteTariff(values.id);
            onClose(); 
        } catch (error) {
            console.error("Ошибка: ", error);
        }
    };

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Удалить тариф</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Formik
                    initialValues={{ id: "" }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ handleSubmit }) => (
                        <Form noValidate onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="formBasicId">
                                <Form.Label>Уникальный идентификатор</Form.Label>
                                <Field
                                    as={Form.Control}
                                    type="text"
                                    name="id"
                                    placeholder="Введите уникальный идентификатор тарифа"
                                />
                                <ErrorMessage name="id" component="div" className="text-danger" />
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Удалить
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Modal.Body>
        </Modal>
    );
};

export default DeleteTariffForm;
