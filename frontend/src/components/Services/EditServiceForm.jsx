import React, { useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup'; 

const validationSchema = Yup.object({
    name: Yup.string().required("Название обязательно"),
    description: Yup.string().required("Описание обязательно"),
    price: Yup.number().typeError("Цена должна быть числом").required("Цена обязательна")
});

const EditServiceForm = ({ show, onClose, service, onSave, option }) => {
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
                        console.log("EditServiceForm", {...service, ...values})
                        onSave({ ...service, ...values }, option.id); 
                    }}
                >
                    {({ handleSubmit, errors, touched }) => (
                        <Form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="name">Название</label>
                                <Field id="name" name="name" className={`form-control ${touched.name && errors.name ? 'is-invalid' : ''}`} 
                                style={{borderRadius: '35px'}}
                                />
                                {touched.name && errors.name && <div className="invalid-feedback">{errors.name}</div>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="description">Описание</label>
                                <Field id="description" name="description" className={`form-control ${touched.description && errors.description ? 'is-invalid' : ''}`}
                                style={{borderRadius: '35px'}}
                                 />
                                {touched.description && errors.description && <div className="invalid-feedback">{errors.description}</div>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="price">Цена</label>
                                <Field id="price" name="price" type="number" className={`form-control ${touched.price && errors.price ? 'is-invalid' : ''}`} 
                                style={{borderRadius: '35px'}}
                                />
                                {touched.price && errors.price && <div className="invalid-feedback">{errors.price}</div>}
                            </div>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={onClose} style={{border: 'none', borderRadius: '35px'}}>Отмена</Button>
                                <Button type="submit" variant="danger" style={{backgroundColor: '#F05959', border: 'none', borderRadius: '35px'}}>Сохранить</Button>
                            </Modal.Footer>
                        </Form>
                    )}
                </Formik>
            </Modal.Body>
        </Modal>
    );
};

export default EditServiceForm;
