import React, { useRef, useState } from "react";
import { useForm, Controller } from 'react-hook-form';
import { Editor } from 'primereact/editor';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import axios from 'axios';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import '../../App.css';
const EmailToUsers = (props) => {
    const navigate = useNavigate()
    const location = useLocation();


    const [title, setTitle] = useState([]);

    const sendEmail = (forNode) => {
        console.log("forNode",forNode);
        axios.put(`http://localhost:8000/users/emailToUsers`, forNode)
            .then(function (response) {
                console.log("server>>",response.data);
                location?.state?.show();
                navigate("/UsersDetails");
            })
            .catch(function (error) {
                console.log("😒", error);
                location?.state?.show();
                navigate("/UsersDetails");
            })
            .finally(function () {
            });
    }

    const renderHeader = () => {
        return (
            <span className="ql-formats">
                <button className="ql-bold" aria-label="Bold"></button>
                <button className="ql-italic" aria-label="Italic"></button>
                <button className="ql-underline" aria-label="Underline"></button>
            </span>
        );
    };

    const header = renderHeader();

    const defaultValues = {
        blog: ''
    };

    const {
        control,
        formState: { errors },
        handleSubmit,
        reset
    } = useForm({ defaultValues });

    const onSubmit = (data) => {
        const toNode = {
            "text": data.blog,
            "title": title
        }
        sendEmail(toNode)
        reset();
    };

    const getFormErrorMessage = (name) => {
        return errors[name] ? <small className="p-error">{errors[name].message}</small> : <small className="p-error">&nbsp;</small>;
    };

    return (
        props.userAuthorization == 2 ?
            <div className="card">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div class="field text-right">
                        <label for="firstname1">כותרת המייל</label>
                        <input id="firstname1" type="text" onChange={(e) => setTitle(e.target.value)} class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"></input>
                    </div>
                    <Controller
                        className='text-right'
                        id="email"
                        name="blog"
                        control={control}
                        rules={{ required: 'אין תוכן לשליחה.' }}
                        render={({ field }) => <Editor className='text-right' id={field.name} name="blog" value={field.value} headerTemplate={header} onTextChange={(e) => field.onChange(e.textValue)} style={{ height: '320px' }} />}
                    />
                    <label htmlFor="email">גוף המייל</label>
                    <div className="flex flex-wrap justify-content-between align-items-center gap-3 mt-3 text-right">
                        {getFormErrorMessage('blog')}
                        <Button  type="submit" label="שלח" />
                    </div>
                </form>
            </div>
            :
            <>
                <h1>פדיחה! 🤨🤔😵</h1>
                <h3>לא ברור איך הגעת לכאן לכאן אבל-- </h3>
                <b>אין לך הרשאת גישה לעמוד זה.</b>
            </>
    )
}
export default EmailToUsers