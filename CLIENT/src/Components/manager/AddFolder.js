import React, { useState, useEffect, useRef } from 'react';
import { FileUpload } from 'primereact/fileupload';
// import { useNavigate } from "react-router-dom"
import ChoosePath from './ChoosePathFolder'
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

// import { showPath} from '../../Services/functions';
import { InputText } from "primereact/inputtext";
import axios from 'axios';
import 'primeflex/primeflex.css';
import AddingSteps from './AddinfStepsGeneric';
import Tree from '../Tree';
import '../../App.css';


// import { Toast } from 'primereact/toast';


export default function CustomUploadDemo(props) {
    const [navig, setNavig] = useState(null);
    const [level, setLevel] = useState(0);
    const [open, setOpen] = useState(false);
    const [visible, setVisible] = useState(false);
    const [path, setPath] = useState("");
    const [label, setLabel] = useState("");
    const [flag, setFlag] = useState(true);
    const [base64data, setBase64data] = useState("🤢");

    // const [value, setValue] = useState('');


    const addHandwriting = (x) => {
        axios.post(`http://localhost:8000/tree`, x)
            .then(function (response) {
                setLevel(2)
                console.log(response.data);
            })
            .catch(function (error) {
                console.log("😒", error);
            })
            .finally(function () {
            });
    }

    const footerContent = (
        <div>
            <Button label="לא" icon="pi pi-times" onClick={() => { setLevel(0); setVisible(false) }} className="p-button-text" />
            <Button label="כן" icon="pi pi-check" onClick={() => { setLevel(1); setVisible(false) }} autoFocus />
        </div>
    );

        const steps = ['בחירת מיקום הוספה', 'בחירת שם לתיקיה', 'אישור ושמירה']
    return (
        props.userAuthorization==2? 
        <>            
            <AddingSteps steps = {steps} level = {level}></AddingSteps>
            {level == 0 &&
                <div className="card flex justify-content-center flex-column flex align-items-center">
                     <h1>בחר מיקום להוספת תקייה </h1>
                    <ChoosePath userAuthorization={props.userAuthorization} setLabel={setLabel} setNavig={setNavig} setPath={setPath} setVisible={setVisible} />
                </div>}
            {console.log("props.navig: ", navig)}
            <div className="card flex justify-content-center flex-column flex align-items-center">
                <Dialog header="אישור הנתיב" visible={visible} style={{ width: '50vw' }} onHide={() => { setLevel(0); setVisible(false) }} footer={footerContent}>
                    <p className="m-0">{path}</p>
                </Dialog>
            </div>
            {level == 1 &&
                <div className="card flex justify-content-center flex-column flex align-items-center">
                    <h1 className='mx-6rem' >הוסף תאור לתיקייה</h1><br></br>
                    <InputText className='mx-6rem' value={label} onChange={(e) => { setLabel(e.target.value); console.log("base64data", base64data); }} />
                    <Button label="אישור" onClick={() => { addHandwriting({ "label": label, "parent_id": navig }) }} />
                </div>}
            {level == 2 && 
                <div className="card flex justify-content-center flex-column flex align-items-center">
                    <h2 className='mx-6rem' >התקייה נוספה בהצלחה</h2>
                    <Tree level={level} flag={flag} setFlag={setFlag}></Tree>

                    <h2 className='mx-6rem' >להוספת תיקיה חדשה נוספת לחץ כאן</h2>
                    <Button onClick={() => window.location.reload()} rounded icon={"pi pi-plus"}></Button>

                </div>}
        </>
        :
        <>
            <h1>פדיחה! 🤨🤔😵</h1>
            <h3>לא ברור איך הגעת לכאן לכאן אבל-- </h3>
            <b>אין לך הרשאת גישה לעמוד זה.</b>
        </>
    )
}
