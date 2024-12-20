import React, { useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Formik, Form, Field } from 'formik';

const EditTariffForm = ({ show, onClose, tariff, onSave }) => {
    useEffect(() => {
        if (tariff) {

        }
    }, [tariff]);

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Редактировать Тариф</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Formik
                    initialValues={{
                        name: tariff ? tariff.name : '',
                        description: tariff ? tariff.description : '',
                        price: tariff ? tariff.price : ''
                    }}
                    enableReinitialize={true} 
                    onSubmit={(values) => {
                        onSave({ ...tariff, ...values }); 
                    }}
                >
                    {({ handleSubmit }) => (
                        <Form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="name">Название</label>
                                <Field id="name" name="name" className="form-control" style={{ borderRadius: '35px'}} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="description">Описание</label>
                                <Field id="description" name="description" className="form-control" style={{ borderRadius: '35px'}} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="price">Цена</label>
                                <Field id="price" name="price" type="number" className="form-control" style={{ borderRadius: '35px'}} />
                            </div>
                            <Modal.Footer>
                                <Button style={{borderRadius: '35px'}} variant="secondary" onClick={onClose}>Отмена</Button>
                                <Button style={{backgroundColor: '#F05959', border: 'none', borderRadius: '35px'}} type="submit" variant="primary">Сохранить</Button>
                            </Modal.Footer>
                        </Form>
                    )}
                </Formik>
            </Modal.Body>
        </Modal>
    );
};

export default EditTariffForm;