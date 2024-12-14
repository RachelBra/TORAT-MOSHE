import React, { useState } from 'react';
import ChoosePath from './ChoosePathHanwiting'
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from "primereact/inputtext";
import axios from 'axios';
import 'primeflex/primeflex.css';
// import AddingSteps from './AddingSteps';
import AddingSteps from './AddinfStepsGeneric';
import Tree from '../Tree';
import '../../App.css';
import DropZone from './UploadHandwriting';
import { FileUpload } from 'primereact/fileupload';

export default function CustomUploadDemo(props) {
    const [navig, setNavig] = useState(null);
    const [level, setLevel] = useState(0);
    const [visible, setVisible] = useState(false);
    const [path, setPath] = useState("💕");
    const [description, setDescription] = useState("");
    const [flag, setFlag] = useState(true);
    const [updateAttched, setUpdateAttched] = useState([]);
const steps = ['בחירת קובץ', 'בחירת מיקום הקובץ', 'שם הקובץ', 'אישור ושמירה' ]

    const addHandwriting = (x) => {
        console.log("😀", x);
        axios.post(`http://localhost:8000/handwritings`, x)
            .then(function (response) {
                console.log(response);
                setLevel(3)
            })
            .catch(function (error) {
                console.log("😒", error);
                setLevel(4)
            })
            .finally(function () {
            });
    }

    const footerContent = (
        <div>
            <Button label="לא" icon="pi pi-times" onClick={() => { setLevel(1); setVisible(false) }} className="p-button-text" />
            <Button label="כן" icon="pi pi-check" onClick={() => { setLevel(2); setVisible(false) }} autoFocus />
        </div>
    );
    const transcription =`פרשת ראה/ פרק י" א</br>
    כ"ו: רשי מבאר את הפס וק בתיאור עובדת י של מעמד הברכות והקללות</br>
    בהר גריזים ועיבל .</br>
    הרמב"ם לעומתו מביא את הפסוק כהוכחה לבחירה בין טוב לרע כלומר</br>
    שהרמב"ם ראה את המושגים ברכה וקללה כמקבילים למושגים טוב ורע .</br>
    כ"ז: הברכה אשר תשמעו – הגדרת הברכה היא שתשמעו אל מצוות</br>
    כלומר ברכה=ט ו ב</br>
    כ"ח: והקללה אם לא תשמעו – הגדרת הקללה היא עונד, כלומר קללה =</br>
    ר ע</br>
    הרמב"ן לא סובר כרש"י )לא מתייחס למעמד הברכות והקללות( אלא</br>
    משווה את הפסוק לראה נתתי לפניך... שהוא פסוק מובהק על בחירה בין</br>
    טוב לרע ובכך הולך כמע ט כשם שמפרש הרמב"ם .</br>
    דרך ברכה ודרך קללה – דרך שתוביל לשכר או לעונ</br>ש. הרמב"ן מדבר על
    הבחירה בין טוב לרע וגם על תוצאות הבחי ר: בשכר </br>או בעונש. אצל
    הרמב"ן טוב = ברכה. טוב = מוביל לברכה. לפיו באמת </br>המושגים ברכה
    וקללה מקבילים לשכר ועונש .</br>
    כ"ט: "ונתתה את הברכה על הר ג</br>ריזים ואת הקללה על הר עיבל – המילים
    ברכה וקללה מיודעות ומכונות לברכה וקללה מסוימות – הפסוקים עוסקים</br>
    במעמד הברכות והקללות תומכים בדעתו המוקדמת של רשי .</br>
    פסוק זה לפי הרמב"ן מפורש שאכן הע ולם התנהל בדרך גמול של שכר</br>
    ועונש כשם שמבואר בפסוקים הקודמים, ואילו פסוק זה שמהווה פעול ה</br>
    מעשית מעיד לידיעה של המעמד )תמיד שכר ועונש (</br>
    הרמב"ם שפרש ברכה וקללה כטוב ורע לא מיי שב שיטתו עם פסוק זה .</br>
    נותן לפניכם – לפי רש"י: מובן שעומד למסור את נוסח הברכות והקללות</br>
    לפניהם .</br>
    לפי הרמב"ן: שתבחרו לכם מהן מה שתרצו. הכל צפוי והרשות נתונה של</br>
    בחירה .
    `

    // const customBase64Uploader = async (event) => {
    //     // convert file to base64 encoded
    //     const file = event.files[0];
    //     const reader = new FileReader();
    //     let blob = await fetch(file.objectURL).then((r) => r.blob()); //blob:url

    //     reader.readAsDataURL(blob);

    //     reader.onloadend = function () {
    //         //pdf
    //         setBase64data(reader.result);
    //         console.log("PPPPPPPPPPPPP", reader.result);
    //         setLevel(1);
    //     };
    // };
/////////////////

    return (
        props.userAuthorization == 2 ?
            <>
                <AddingSteps steps = {steps} level={level}></AddingSteps>

                {level == 0 &&
                    <div className="card flex justify-content-center flex-column flex align-items-center">
                        <h1>לחץ לבחירת קובץ, הכתב יתומלל באופן אוטומטי לקובץ נפרד</h1>
                        {/* <FileUpload className="flex-column" mode="basic" name="demo[]" url="/api/upload" accept="image/*,application/pdf" customUpload uploadHandler={customBase64Uploader} /> */}
                        <DropZone setUpdateAttched={setUpdateAttched}></DropZone>
                        {updateAttched.length > 0 && updateAttched.map((item) => {
                            setLevel(1);
                        })}
                    </div>}
                {level == 1 &&
                    <div className="card flex justify-content-center flex-column align-items-center">
                        <h1>בחר מיקום לשמירת כתב היד</h1>
                        <ChoosePath userAuthorization={props.userAuthorization} setDescription={setDescription} setNavig={setNavig} setPath={setPath} setVisible={setVisible} />
                    </div>}
                {level == 2 &&
                    <div className="card flex justify-content-center flex-column flex align-items-center">
                        <h1 className='mx-6rem' >הוסף כותרת לכתב היד</h1><br></br>
                        <InputText className='mx-6rem' value={description} onChange={(e) => { setDescription(e.target.value) }} />
                        <Button label="אישור" onClick={() => { addHandwriting({ "image_path":updateAttched[0].fileName, "transcription": transcription, "description": description, "path_id": navig }) }} />
                    </div>}
                {level == 3 &&
                    <div className="card flex justify-content-center flex-column flex align-items-center">
                        <h2 className='mx-6rem' >כתב היד נוסף בהצלחה!</h2>
                        <Tree level={level} flag={flag} setFlag={setFlag}></Tree>

                        <h2 className='mx-6rem' >להוספת כתב יד נוסף לחץ על הכפתור</h2>
                        <Button onClick={() => window.location.reload()} rounded icon={"pi pi-plus"}></Button>

                    </div>}
                    {level == 4 &&
                    <div className="card flex justify-content-center flex-column flex align-items-center">
                        <h1 className='mx-6rem' >מתנצלים :|</h1>
                        <h2 className='mx-6rem' >שגיאה בלתי צפוויה!!</h2>
                        <Tree level={level} flag={flag} setFlag={setFlag}></Tree>

                        <h2 className='mx-6rem' >להוספת תקייה נוספת לחץ על הכפתור</h2>
                        <Button onClick={() => window.location.reload()} rounded icon={"pi pi-plus"}></Button>

                    </div>}
                    <div className="card flex justify-content-center flex-column flex align-items-center">
                    <Dialog header="אישור הנתיב" visible={visible} style={{ width: '50vw' }} onHide={() => { setVisible(false) }} footer={footerContent}>
                        <p className="m-0">{path}</p>
                    </Dialog>
                </div>
            </>
            :
            <>
                <h1>פדיחה! 🤨🤔😵</h1>
                <h3>לא ברור איך הגעת לכאן לכאן אבל-- </h3>
                <b>אין לך הרשאת גישה לעמוד זה.</b>
            </>
    )
}
