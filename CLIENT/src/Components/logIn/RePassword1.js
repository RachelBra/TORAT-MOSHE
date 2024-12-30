
import React, { useEffect, useState } from 'react';
import { Form, Field } from 'react-final-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { Checkbox } from 'primereact/checkbox';
import { Dialog } from 'primereact/dialog';
// import { Divider } from 'primereact/divider';
import { classNames } from 'primereact/utils';
import '../../Services/Register.css';
import axios from 'axios';
import { useNavigate } from "react-router-dom"
import '../../App.css';

const RePassword1 = (props) => {
    const navigate = useNavigate();

    const [showMessage, setShowMessage] = useState(false);
    const [formData, setFormData] = useState({});


    const sendPassword = (email) => {
        const cookies = axios.put(`http://localhost:8000/users/updatePassword1/${email}`
        )
            .then(function (response) {
                console.log(response);
                props.set("","", email)
                navigate("/RePassword2")
            })
            .catch(function (error) {
                console.log(error);
                alert("כתובת המייל לא מוכרת במערכת\n😒😒😒😒😒😒😒😒😒")
            })
            .finally(function () {
                
            });
    }

    const validate = (data) => {
        let errors = {};

        if (!data.email) {
            errors.email = 'כתובת מייל חובה';
        }
        else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(data.email)) {
            errors.email = 'כתובת המייל אינה חוקית';
        }

        return errors;
    };

    const onSubmit = (data, form) => {
        setFormData(data);
        sendPassword(data.email)
        form.restart();
    };

    const isFormFieldValid = (meta) => !!(meta.touched && meta.error);
    const getFormErrorMessage = (meta) => {
        return isFormFieldValid(meta) && <small className="p-error">{meta.error}</small>;
    };


    return (
        <div className="flex justify-content-center m-3">
            <div className="card opacity-90">
                <h5 className="text-center">שינוי סיסמה</h5>
                <Form onSubmit={onSubmit} initialValues={{ email: '' }} validate={validate} render={({ handleSubmit }) => (
                    <form onSubmit={handleSubmit} className="p-fluid">
                        <Field name="email" render={({ input, meta }) => (
                            <div className="field">
                                <span className="p-float-label p-input-icon-right">
                                    <i className="pi pi-envelope" />
                                    <InputText id="email" {...input} className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                    <label htmlFor="email" className={classNames({ 'p-error': isFormFieldValid(meta) })}>אימייל*</label>
                                </span>
                                {getFormErrorMessage(meta)}
                            </div>
                        )} />
                        <Button type="submit" label="שלח" className="m-1 border-1 border-bluegray-500 " severity="secondary" raised  />
                    </form>
                )} />
            </div>
        </div>

    );
}

export default RePassword1;