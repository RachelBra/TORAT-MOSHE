

import React, { useState, useEffect, useRef } from 'react';
import { FileUpload } from 'primereact/fileupload';
// import { useNavigate } from "react-router-dom"
import ChoosePath from './ChoosePathHanwiting'
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

// import { showPath} from '../../Services/functions';
import { InputText } from "primereact/inputtext";
import axios from 'axios';
import 'primeflex/primeflex.css';
import AddingSteps from './AddinfStepsGeneric';
import Tree from '../Tree';
import '../../App.css';


import { Toast } from 'primereact/toast';


export default function CustomUploadDemo(props) {
    const [navig, setNavig] = useState(null);
    const [level, setLevel] = useState(0);
    const [open, setOpen] = useState(false);
    const [visible, setVisible] = useState(false);
    const [path, setPath] = useState("💕");
    const [description, setDescription] = useState("");
    const [name, setName] = useState("");
    const [flag, setFlag] = useState(true);
    const [base64data, setBase64data] = useState("🤢");

    // const [value, setValue] = useState('');


    const addBook = (x) => {
        axios.post(`http://localhost:8000/books`, x)
            .then(function (response) {
                console.log(response);
                setLevel(3) 
            })
            .catch(function (error) {
                console.log("😒", error);
            })
            .finally(function () {
            });
    }

    const customBase64Uploader = async (event) => {
        // convert file to base64 encoded
        const file = event.files[0];
        const reader = new FileReader();
        let blob = await fetch(file.objectURL).then((r) => r.blob()); //blob:url

        reader.readAsDataURL(blob);

        reader.onloadend = function () {
            //pdf
            setBase64data(reader.result);
            setLevel(1);
        };
    };
    const steps = ['תמונה לתצוגה', 'שם ספר', 'תאור לספר','קביעת מחיר']
    return (
        props.userAuthorization == 2 ?
            <>
                <AddingSteps steps ={steps} level={level}></AddingSteps>

                {level == 0 &&
                    <div className="card flex justify-content-center flex-column flex align-items-center">
                        <h1>לחץ לבחירת תמונה לתצוגה</h1>
                        <FileUpload className="flex-column" mode="basic" name="demo[]" url="/api/upload" accept="image/*,application/pdf" customUpload uploadHandler={customBase64Uploader} />
                    </div>}
                {level == 1 &&
                    <div className="card flex justify-content-center flex-column flex align-items-center">
                        <h1 className='mx-6rem' >הוסף את שם הספר</h1><br></br>
                        <InputText className='mx-6rem' value={description} onChange={(e) =>setDescription(e.target.value)} />
                        <Button label="אישור" onClick={() => setLevel(2)} />
                    </div>}
                {level == 2 &&
                    <div className="card flex justify-content-center flex-column flex align-items-center">
                        <h1 className='mx-6rem' >הוסף תאור על הספר</h1><br></br>
                        <InputText className='mx-6rem' value={name} onChange={(e) =>setName(e.target.value)} />
                        <Button label="אישור" onClick={() => addBook({ "image_path": base64data,  "description": description, "name": name })} />
                    </div>}
                {level == 3 &&
                    <div className="card flex justify-content-center flex-column flex align-items-center">
                        <h1 className='mx-6rem' >כתב היד נוסף בהצלחה!</h1>

                        <h2 className='mx-6rem' >לספר נוסף לחץ כל הכפתור</h2>
                        <Button onClick={() => setLevel(0)} rounded icon={"pi pi-plus"}></Button>
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
