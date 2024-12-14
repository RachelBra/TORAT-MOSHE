import React, { useState } from 'react';
import { Chips } from "primereact/chips";
import { Button } from 'primereact/button';
import axios from 'axios';
import { InputText } from 'primereact/inputtext';
import { Divider } from 'primereact/divider';
import { ScrollTop } from 'primereact/scrolltop';
import '../../App.css';
import { Dialog } from 'primereact/dialog';
import { useNavigate } from "react-router-dom"

function Transcption(props) {

    const navigate = useNavigate();

    const [content, setContent] = useState(props.text);
    const [wordToChange, setWordToChange] = useState("");
    const [value, setValue] = useState("");
    const [start, setStart] = useState(0);
    const [visible, setVisible] = useState(false);

    const footerContent = (
        <div className="flex-wrap justify-content-between align-items-left gap-3 mt-3" style={{ direction: "ltr" }}>
            <Button onClick={() => { setVisible(false); navigate("/LogIn"); }} label="כן, קח אותי לדף ההרשמה" className="m-1" icon="pi pi-check" severity="secondary" type="submit" raised autoFocus />
            <Button onClick={() => setVisible(false)} label="לא" className="m-1" icon="pi pi-times" severity="secondary" type="submit" raised outlined />
        </div>
    );

    const addCoorrection = () => {
        let a = localStorage.getItem("user");
        console.log("addCoorrection");
        if (a) {
            console.log("start", start);
            console.log("user", a);
            const x = { handwriting_id: props.handwritingId, word_index: start, new_word: value, original_word: wordToChange, user_id: JSON.parse(a).id };
            axios.post(`http://localhost:8000/handwritings/corrections`, x)
                .then(function (response) {
                    props.show()
                    setValue("");
                })
                .catch(function (error) {
                    console.log("😒", error);
                })
                .finally(function () {
                });
        }
        else {
            setVisible(true);
        }
    }

    function handleSelectionChange(props) {
        const selection = window.getSelection();
        var start = selection.anchorOffset;
        var end = selection.focusOffset;
        start > end ? setStart(end) : setStart(start);
        const selectedText = selection.toString();
        setWordToChange(selectedText.trim());
    }

    return (
        <>
            <div className="flex flex-column align-items-center ">
                <div style={{ 'overflow': 'auto'  }}
                    onMouseUp={handleSelectionChange}
                    dangerouslySetInnerHTML={{ __html: content }}
                />
                <ScrollTop target="parent" threshold={100} className="w-2rem h-2rem border-round bg-primary" icon="pi pi-arrow-up text-base" />

                <Divider align="left">
                    <div className="inline-flex align-items-center">
                        <i className="pi pi-file-edit ml-2"></i>
                        <b>תיקון כתב היד  </b>
                    </div>
                </Divider>
                <div>
                    <p>על מנת להעלות תיקון יש לסמן את קטע המילים לתיקון ולפעול לפי ההוראות </p>
                    {wordToChange != "" &&
                        <>
                            <p>המילים שנבחרו:</p>
                            <div className="border-500 border-black-500 w-12rem h-3rem m-2 surface-overlay font-bold flex align-items-center justify-content-center">{wordToChange}</div>
                            <div className="flex-column">
                                <p>המילה החדשה:</p>
                                <div>
                                    <InputText value={value} onChange={(e) => setValue(e.target.value)} />
                                    <Button icon="pi pi-check" iconPos="right" onClick={() => { addCoorrection(); setWordToChange("") }} />
                                </div>
                            </div>
                        </>}
                </div>
            </div>
            <Dialog header="הצעת התיקון לא נשלחה" visible={visible} style={{ width: '40vw', direction: 'rtl' }} onHide={() => setVisible(false)} footer={footerContent}>
                <p className="m-0">
                    רק משתמש רשום יכול להעלות הצעות לתיקון
                </p><br></br>
                <p className="m-0">
                    תרצה להירשם?
                </p>
            </Dialog>
        </>
    );
}
export default Transcption;