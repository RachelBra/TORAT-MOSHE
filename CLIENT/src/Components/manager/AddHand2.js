import React, { useState, useEffect } from 'react';
import ChoosePath from '../ChoosePathHanwiting'
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
    const [path, setPath] = useState("");
    const [tmpDescription, setTmpDescription] = useState("");
    const [description, setDescription] = useState("");
    const [flag, setFlag] = useState(true);
    const [updateHWAttched, setUpdateHWAttched] = useState(null);
    const [updateTrnsAttched, setUpdateTrnsAttched] = useState(null);

    const steps = [' הוספת כתב יד','הוספת קובץ תמלול', 'בחירת מיקום הכתב', 'בחירת שם כתב היד', 'אישור ושמירה' ]

    useEffect(() => {
        if (updateHWAttched != null) {
            console.log("upload: ",updateHWAttched )
            setLevel(1);
        }
    }, [updateHWAttched]);
    
    useEffect(() => {
        if (updateTrnsAttched != null) {
            console.log("upload: ",updateTrnsAttched )
            setLevel(2);
        }
    }, [updateTrnsAttched]);

    const addHandwriting = (x) => {
        console.log("😀", x);
        axios.post(`http://localhost:8000/handwritings`, x)
            .then(function (response) {
                console.log("כתב היד נוסף בהצלחה!", response.data);
                setLevel(5); // נשנה את השלב בהתאם לתשובת השרת
            })
            .catch(function (error) {
                console.error("❌ שגיאה בהעלאה:", error);
                setLevel(6); // במצב של שגיאה נעבור לשלב אחר
            })
            .finally(function () {
            });
    }

    const footerContent = (
        <div>
            <Button label="לא" icon="pi pi-times" onClick={() => { setLevel(2); setVisible(false) }} className="p-button-text" />
            <Button label="כן" icon="pi pi-check" onClick={() => { setLevel(3); setVisible(false) }} autoFocus />
        </div>
    );
 

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
                        <h1>לחץ לבחירת קובץ כתב היד</h1>
                        {/* <FileUpload className="flex-column" mode="basic" name="demo[]" url="/api/upload" accept="image/*,application/pdf" customUpload uploadHandler={customBase64Uploader} /> */}
                        <DropZone setUpdateAttched={setUpdateHWAttched}></DropZone>
                    </div>
                }
                {level == 1 &&
                    <div className="card flex justify-content-center flex-column flex align-items-center">
                        <h1>לחץ לבחירת קובץ תמלול</h1>
                        <DropZone setUpdateAttched={setUpdateTrnsAttched}></DropZone>
                    </div>
                }
                {level == 2 &&
                    <div className="card flex justify-content-center flex-column align-items-center">
                        <h1>בחר מיקום לשמירת כתב היד</h1>
                        <ChoosePath userAuthorization={props.userAuthorization} setNavig={setNavig} setDescription={setDescription} setPath={setPath} setVisible={setVisible} />                        
                    </div>
                }
                {level == 3 &&
                    <div className="card flex justify-content-center flex-column flex align-items-center">
                        <h1 className='mx-6rem' >הוסף כותרת לכתב היד</h1><br></br>
                        {/* <InputText className='mx-6rem' value={description} onChange={(e) => { setDescription(e.target.value) }} /> */}
                        <InputText className='mx-6rem' value={tmpDescription} onChange={(e) => { setTmpDescription(e.target.value) }} />
                        <Button label="אישור" onClick={() => { setDescription(tmpDescription); setLevel(4); }} />
                        {/* <Button label="להוספת כתב היד" onClick={() => { addHandwriting({ "image_path":updateHWAttched[0].fileName, "transcription": updateTrnsAttched[0].fileName, "description": description, "path_id": navig }) }} /> */}
                    </div>
                }
                {level == 4 && (
                    <div className="card flex justify-content-center flex-column flex align-items-center">
                        <h2 className='mx-6rem'>{description}</h2>
                        <Button 
                            label="אישור הוספה למאגר"
                            onClick={() => {
                                addHandwriting({ "image_path":updateHWAttched[0], "transcription": updateTrnsAttched[0], "description": description, "path_id": navig })
                                }
                            }/>
                    </div>
                )}

                {level == 5 && (
                    <div className="card flex justify-content-center flex-column flex align-items-center">
                        <h2 className='mx-6rem'>כתב היד נוסף בהצלחה!</h2>
                        <Tree level={level} flag={flag} setFlag={setFlag}></Tree>

                        <h2 className='mx-6rem'>להוספת כתב יד נוסף</h2>
                        <Button onClick={() => window.location.reload()} rounded icon={"pi pi-plus"}></Button>
                    </div>
                )}
   
                {level == 6 && (
                    <div className="card flex justify-content-center flex-column flex align-items-center">
                        <h1 className='mx-6rem'>❌ שגיאה בהוספת כתב היד</h1>
                        <h3>אנא נסה שוב</h3>

                        <Button label="חזור לניסיון נוסף" onClick={() => {setNavig(""); setDescription(""); setTmpDescription(""); setUpdateHWAttched(null); setUpdateTrnsAttched(null); setLevel(0)}} />
                    </div>
                )}

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
