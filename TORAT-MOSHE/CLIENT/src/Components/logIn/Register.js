import React, { useEffect, useState } from 'react';
import { Form, Field } from 'react-final-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { Checkbox } from 'primereact/checkbox';
import { Dialog } from 'primereact/dialog';
import { classNames } from 'primereact/utils';
import '../../Services/Register.css';
import axios from 'axios';
import { useNavigate } from "react-router-dom"
import '../../App.css';

const Register = () => {
    const navigate = useNavigate();

    const [showMessage, setShowMessage] = useState(false);
    const [formData, setFormData] = useState({});


    const addUser = (x) => {
        axios.post(`http://localhost:8000/users/register`, x)
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log("😒", error);
            })
            .finally(function () {
                console.log("😒");
            });
    }

    const validate = (data) => {
        let errors = {};

        if (!data.first_name) {
            errors.first_name = 'שם פרטי חובה';
        }

        if (!data.last_name) {
            errors.last_name = 'שם משפחה חובה';
        }

        if (!data.email) {
            errors.email = 'כתובת מייל חובה  (לצורך הזדהות)';
        }
        else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(data.email)) {
            errors.email = 'כתובת המייל אינה חוקית כתובת חוקית לדוגמא: example@gmail.com';
        }

        if (!data.password) {
            errors.password = 'סיסמה חובה';
        }

        if (!data.pass_valid) {
            errors.pass_valid = 'אימות סיסמה חובה';
        }
        else if (data.pass_valid != data.password) {
            errors.pass_valid = 'הסיסמה אינה זהה';
            console.log(data.pass_valid, ":)", data.password);
        }
        return errors;
    };

    const onSubmit = (data, form) => {
        setFormData(data);
        setShowMessage(true);
        const x = {
            "first_name": data.first_name,
            "last_name": data.last_name,
            "email_confirm": data.email_config ? 1 : 0,
            "email": data.email,
            "password": data.password
        }
        console.log(x);
        addUser(x)
        form.restart();
    };

    const isFormFieldValid = (meta) => !!(meta.touched && meta.error);
    const getFormErrorMessage = (meta) => {
        return isFormFieldValid(meta) && <small className="p-error">{meta.error}</small>;
    };


    return (
        <div className="form-demo">
            <Dialog visible={showMessage} onHide={() => setShowMessage(false)} position="top" showHeader={false} breakpoints={{ '960px': '80vw' }} style={{ width: '30vw' }}>
                <div className="flex align-items-center flex-column pt-6 px-3">
                    <i className="pi pi-check-circle" style={{ fontSize: '5rem', color: 'var(--green-400)' }}></i>
                    <h5>נרשמת בהצלחה!</h5>
                    <p style={{ lineHeight: 1.5, textIndent: '1rem' }}>
                        <b>{formData.first_name} {formData.last_name} הרשמתך לאתר בוצעה בהצלחה </b>
                    </p>
                    <p style={{ textAlign: 'center' }}>
                        כעת הינך נעשה שותף בפיענוח כתב יד קדשו של המהריל על ידי העלאת הצעות לתיקון התמלול <br></br>
                        וכן תוכל להעלות פירושים ותגובות לאתר
                    </p>
                    <Button label="👍" severity="success"  onClick={()=>navigate("/")} text raised/>
                </div>
            </Dialog>

            <div className="flex justify-content-center m-3">
                <div className="card opacity-90">
                    <h5 className="text-center">הרשמה</h5>
                    <Form onSubmit={onSubmit} initialValues={{ first_name: '', last_name: '', email: '', password: '', pass_valid: '', email_config: '' }} validate={validate} render={({ handleSubmit }) => (
                        <form onSubmit={handleSubmit} className="p-fluid">


                            <Field name="first_name" render={({ input, meta }) => (
                                <div className="field">
                                    <span className="p-float-label">
                                        <InputText id="first_name" {...input} autoFocus className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                        <label htmlFor="first_name" className={classNames({ 'p-error': isFormFieldValid(meta) })}>שם פרטי*</label>
                                    </span>
                                    {getFormErrorMessage(meta)}
                                </div>
                            )} />

                            <Field name="last_name" render={({ input, meta }) => (
                                <div className="field">
                                    <span className="p-float-label">
                                        <InputText id="last_name"  {...input} autoFocus className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                        <label htmlFor="last_name" className={classNames({ 'p-error': isFormFieldValid(meta) })}>שם משפחה*</label>
                                    </span>
                                    {getFormErrorMessage(meta)}
                                </div>
                            )} />

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

                            <Field name="password" render={({ input, meta }) => (
                                <div className="field">
                                    <span className="p-float-label">
                                        <Password id="password"  {...input} toggleMask feedback={false} className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                        <label htmlFor="password" className={classNames({ 'p-error': isFormFieldValid(meta) })}>סיסמה*</label>
                                    </span>
                                    {getFormErrorMessage(meta)}
                                </div>
                            )} />
                            <Field name="pass_valid" render={({ input, meta }) => (
                                <div className="field">
                                    <span className="p-float-label">
                                        <Password id="pass_valid" {...input} toggleMask feedback={false} className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                        <label htmlFor="pass_valid" className={classNames({ 'p-error': isFormFieldValid(meta) })}>אימות סיסמה*</label>
                                    </span>
                                    {getFormErrorMessage(meta)}
                                </div>
                            )} />
                            <Field name="email_config" type="checkbox" render={({ input, meta }) => (
                                <div className="field-checkbox">
                                    <Checkbox inputId="email_config"  {...input} className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                    {/* checked="checked" */}
                                    <label htmlFor="email_config" className={classNames({ 'p-error': isFormFieldValid(meta) })}>אישור קבלת הודעות מהאתר</label>
                                </div>
                            )} />
                            <Button type="submit" label="הרשמה" className="m-1 border-1 border-bluegray-500 w-6.7rem" severity="secondary" raised/>
                        </form>
                    )} />
                </div>
            </div>
        </div>
    );
}

export default Register;