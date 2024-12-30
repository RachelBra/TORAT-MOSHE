
import React, {useState } from 'react';
import { Form, Field } from 'react-final-form';
// import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
// import { Checkbox } from 'primereact/checkbox';
// import { Dialog } from 'primereact/dialog';
// import { Divider } from 'primereact/divider';
import { classNames } from 'primereact/utils';
import '../../Services/Register.css';
import axios from 'axios';
import { NavLink, useNavigate } from "react-router-dom"
import '../../App.css';

const RePassword2 = (props) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({});
  

    const checkPassword = (email, password) => {
        const cookies = axios.get(`http://localhost:8000/users/logIn/${email}/${password}`
        )
            .then(function (response) {
                console.log(">>>>",cookies);
                navigate("/RePassword3")
            })
            .catch(function (error) {

            })
            .finally(function () {
            });
    }

    const validate = (data) => {
        let errors = {};

        if (!data.password) {
            errors.password = 'סיסמה חובה';
        }

        // if (!data.pass_valid) {
        //     errors.pass_valid = 'אימות סיסמה חובה';
        // }
        // else  if (data.pass_valid != data.password ) {
        //     errors.pass_valid = 'הסיסמה אינה זהה';
        //     console.log(data.pass_valid ,":)", data.password);
        // }

        return errors;
    };

    const onSubmit = (data, form) => {
        setFormData(data);
        checkPassword(props.userEmail , data.password)
        form.restart();
    };

    const isFormFieldValid = (meta) => !!(meta.touched && meta.error);
    const getFormErrorMessage = (meta) => {
        return isFormFieldValid(meta) && <small className="p-error">{meta.error}</small>;
    };


    return (
            <div className="flex justify-content-center m-3">
                <div className="card opacity-90">
                    <h5 className="text-center">שחזור סיסמה</h5>
                    <Form onSubmit={onSubmit} initialValues={{ password: ''}} validate={validate} render={({ handleSubmit }) => (
                        <form onSubmit={handleSubmit} className="p-fluid">
                            <a>ברגעים אלו נשלחת לך הודעת אימייל ובה סיסמה לאימות</a><br></br>
                            <a>הכנס את הסיסמה</a><br></br>
                    
                            <Field name="password" render={({ input, meta }) => (
                                <div className="field">
                                    <span className="p-float-label">
                                        <Password id="password"  {...input} toggleMask feedback={false} className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                        <label htmlFor="password" className={classNames({ 'p-error': isFormFieldValid(meta) })}>סיסמה*</label>
                                    </span>
                                    {getFormErrorMessage(meta)}
                                </div>
                            )} />                          

                            <Button type="submit" label="שליחה לאימות" className="m-1 border-1 border-bluegray-500 " severity="secondary" raised/>
                            <div>    המייל לא מופיע? <NavLink to={"/RePassword1"}>שליחה מחודשת</NavLink></div>
                        </form>
                    )} />
                </div>
            </div>

    );
}

export default RePassword2;