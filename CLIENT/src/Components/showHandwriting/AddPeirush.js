import React, { useRef, useState } from "react";
import { useForm, Controller } from 'react-hook-form';
import { Editor } from 'primereact/editor';
import { Button } from 'primereact/button';
// import { Toast } from 'primereact/toast';
import axios from 'axios';
import '../../App.css';
// import '../../Services/style/button.css'
import { Dialog } from 'primereact/dialog';
import { useNavigate } from "react-router-dom"
const Contact = (props) => {

    const navigate = useNavigate();

    const [visible, setVisible] = useState(false);

    const footerContent = (
        <div className="flex-wrap justify-content-start align-items-left gap-3 mt-3" style={{ direction: "ltr" }}>
        {/* <div className="flex-wrap justify-content-between align-items-left gap-3 mt-3" style={{ direction: "ltr" }}> */}
            <Button onClick={() => { setVisible(false); navigate("/LogIn"); }} label="כן, קח אותי לדף ההרשמה" className="m-1 border-1 border-bluegray-500 w-6.7rem" icon="pi pi-check" severity="secondary" type="submit" raised autoFocus />
            <Button onClick={() => setVisible(false)} label="לא" className="m-1" icon="pi pi-times" severity="secondary" type="submit" raised outlined />
        </div>
    );

    const addPerush = (perush) => {
        axios.post(`http://localhost:8000/handwritings/peirushim`, perush)
            .then(function (response) {
                props.show("נקלט במערכת! תודה");
            })
            .catch(function (error) {
                console.log("😒", error);
            })
            .finally(function () {
            });
    }

    const toast = useRef(null);

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
    } = useForm({ defaultValues });

    const onSubmit = (data) => {
        if (JSON.parse(localStorage.getItem("user"))?.id == undefined)
            setVisible(true);

        const perush = {
            handwriting_id: props.handwritingId,
            user_id: JSON.parse(localStorage.getItem("user")).id,
            peirush_text: data.blog
        }
        console.log('JSON.parse(localStorage.getItem("user")).user_id', JSON.parse(localStorage.getItem("user")).user_id, "props.handwritingId", props.handwritingId);
        addPerush(perush)
        props.setOpen(0);
    };

    const getFormErrorMessage = (name) => {
        return errors[name] ? <small className="p-error">{errors[name].message}</small> : <small className="p-error">&nbsp;</small>;
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div style={{ "direction": "ltr" }}>
                    <Controller className="text-left"
                        dir="ltr"
                        name="blog"
                        control={control}
                        rules={{ required: 'אין תוכן לשליחה.' }}
                        style={{ direction: 'ltr' }}
                        render={({ field }) => (
                            <Editor
                                className="text-left"
                                id={field.name}
                                dir="ltr"
                                name="blog"
                                value={field.value}
                                headerTemplate={header}
                                onTextChange={(e) => field.onChange(e.textValue)}
                                style={{ height: '320px', direction: 'ltr' }} />)}
                    />
                    <div className="flex-wrap justify-content-between align-items-left gap-3 mt-3" style={{ direction: "ltr" }}>
                        {getFormErrorMessage('blog')}
                        <Button onClick={() => addPerush} label="שלח" className="m-1 border-1 border-bluegray-500 w-6.7rem" icon="pi pi-check" severity="secondary" type="submit" raised />
                        <Button onClick={() => props.setOpen(false)} label="ביטול" className="m-1" icon="pi pi-times " severity="secondary" type="submit" raised outlined />
                    </div>
                </div>
            </form>
            <Dialog header="הפירוש לא נקלט" visible={visible} style={{ width: '40vw', direction: 'rtl' }} onHide={() => setVisible(false)} footer={footerContent}>
                <p className="m-0">
                    רק משתמש רשום יכול להעלות הצעות הערות ולהגיב
                </p><br></br>
                <p className="m-0">
                    תרצה להירשם?
                </p>
            </Dialog>
        </>
    )
}
export default Contact;