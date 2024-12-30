import React, { useRef } from "react";
import { useForm, Controller } from 'react-hook-form';
import { Editor } from 'primereact/editor';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import axios from 'axios';
import '../App.css';

const Contact = (props) => {

    const sendEmail = (forNode) => {
        const cookies = axios.put(`http://localhost:8000/users/emailToManager`, forNode)
            .then(function (response) {
                show();
                // props.setOpen(0);
                console.log(response);

            })
            .catch(function (error) {
                console.log("😒", error);
            })
            .finally(function () {
            });
    }

    const toast = useRef(null);

    const show = () => {
        toast.current.show({ severity: 'success', summary: 'תודה על המשוב', detail: 'הודעה נשלחה למנהל המערכת' });
    };

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
        // data.blog && show();
        // אולי להעביר לאחרי שהצליח לשלוח מייל
        console.log("pppp", JSON.parse(localStorage.getItem("user")).id);
        const toNode = {
            id: JSON.parse(localStorage.getItem("user")).id,
            text: data.blog
        }
        sendEmail(toNode);
        reset();
    };

    const getFormErrorMessage = (name) => {
        return errors[name] ? <small className="p-error">{errors[name].message}</small> : <small className="p-error">&nbsp;</small>;
    };


    return (
        // <>
        // {props.userId?
        <div className="card mt-3" style={{ "width": "70%", "direction": "rtl" }} >
            <form onSubmit={handleSubmit(onSubmit)} style={{"text-align": "right"}} >
                <Toast ref={toast} />
                <Controller style={{"text-align": "right"}}
                    name="blog"
                    control={control}
                    rules={{ required: 'אין תוכן לשליחה.' }}
                    render={({ field }) => <Editor className="text-right" style={{"text-align": "right", height: '320px'}} id={field.name} name="blog" value={field.value} headerTemplate={header} onTextChange={(e) => field.onChange(e.textValue)} />}
                />
                <div className="flex flex-wrap justify-content-between align-items-center gap-3 mt-3">
                    {getFormErrorMessage('blog')}
                    <Button  label="שלח" className="m-1" icon="pi pi-check" severity="secondary" type="submit" raised />
                </div>
            </form>
        </div>
        //     :
        //     <>
        //     <h1>רק משתמש רשום יכול לשלוח הודעות למערכת</h1>
        //     <h2>   להרשמה <NavLink to={"/Register"}>לחץ כאן</NavLink></h2></>
        // }</>
    )

}
export default Contact;