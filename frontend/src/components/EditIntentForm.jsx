import React, { useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Formik, Form, Field } from 'formik';

const EditIntentForm = ({ show, onClose, intent, onSave }) => {
    useEffect(() => {
        if (intent) {
            // Если нужно, вы можете выполнять какие-либо действия при изменении намерения
        }
    }, [intent]);

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Редактировать Намерение</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Formik
                    initialValues={{
                        intent_name: intent ? intent.intent_name : '',
                        keywords: intent ? intent.keywords : '',
                        response_text: intent ? intent.response_text : '',
                        email: intent ? intent.email : ''
                    }}
                    enableReinitialize={true}
                    onSubmit={(values) => {
                        onSave({ ...intent, ...values });
                    }}
                >
                    {({ handleSubmit }) => (
                        <Form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="intent_name">Название</label>
                                <Field id="intent_name" name="intent_name" className="form-control" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="keywords">Ключевые слова</label>
                                <Field id="keywords" name="keywords" className="form-control" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="response_text">Ответ</label>
                                <Field id="response_text" name="response_text" className="form-control" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <Field id="email" name="email" className="form-control" />
                            </div>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={onClose}>Отмена</Button>
                                <Button type="submit" variant="primary">Сохранить</Button>
                            </Modal.Footer>
                        </Form>
                    )}
                </Formik>
            </Modal.Body>
        </Modal>
    );
};

export default EditIntentForm;
