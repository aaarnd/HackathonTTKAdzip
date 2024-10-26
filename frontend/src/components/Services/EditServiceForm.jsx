import React, { useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup'; 

const validationSchema = Yup.object({
    name: Yup.string().required("Название обязательно"),
    description: Yup.string().required("Описание обязательно"),
    price: Yup.number().typeError("Цена должна быть числом").required("Цена обязательна")
});

const EditServiceForm = ({ show, onClose, service, onSave }) => {
    useEffect(() => {
        if (service) {
            
        }
    }, [service]);

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Редактировать Услугу</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Formik
                    initialValues={{
                        id: service ? service.id : '',
                        name: service ? service.name : '',
                        description: service ? service.description : '',
                        price: service ? service.price : ''
                    }}
                    enableReinitialize={true} 
                    validationSchema={validationSchema} 
                    onSubmit={(values) => {
                        onSave({ ...service, ...values }); 
                    }}
                >
                    {({ handleSubmit, errors, touched }) => (
                        <Form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="name">Название</label>
                                <Field id="name" name="name" className={`form-control ${touched.name && errors.name ? 'is-invalid' : ''}`} />
                                {touched.name && errors.name && <div className="invalid-feedback">{errors.name}</div>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="description">Описание</label>
                                <Field id="description" name="description" className={`form-control ${touched.description && errors.description ? 'is-invalid' : ''}`} />
                                {touched.description && errors.description && <div className="invalid-feedback">{errors.description}</div>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="price">Цена</label>
                                <Field id="price" name="price" type="number" className={`form-control ${touched.price && errors.price ? 'is-invalid' : ''}`} />
                                {touched.price && errors.price && <div className="invalid-feedback">{errors.price}</div>}
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

export default EditServiceForm;
