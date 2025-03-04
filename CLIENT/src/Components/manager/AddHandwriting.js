import React, { useState } from "react";
import axios from "axios";
import { FileUpload } from "primereact/fileupload";
import ChoosePath from './ChoosePathHanwiting'
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';


export default function CustomUploadDemo(props) {
    const [handwritingFile, setHandwritingFile] = useState(null);
    const [transcriptionFile, setTranscriptionFile] = useState(null);
    const [description, setDescription] = useState("");
    const [pathId, setPathId] = useState("");
    const [message, setMessage] = useState("");
    const [navig, setNavig] = useState(null);
    const [visible, setVisible] = useState(false);

    // שמירת קובץ כתב היד שנבחר
    const handleHandwritingSelect = (event) => {
        if (event.files.length > 0) {
            setHandwritingFile(event.files[0]); // שמירה ב-state
        }
    };

    // שמירת קובץ התמלול שנבחר
    const handleTranscriptionSelect = (event) => {
        if (event.files.length > 0) {
            setTranscriptionFile(event.files[0]); // שמירה ב-state
        }
    };

    const handleReset = () => {
        setHandwritingFile(null);
        setTranscriptionFile(null);
        setDescription("");
        setPathId("");
        setMessage("");
    };

    // שליחת כל הנתונים לשרת
    const handleFinalUpload = async () => {
        if (!handwritingFile || !transcriptionFile || !description || !pathId) {
            setMessage("❌ יש למלא את כל השדות לפני השליחה.");
            return;
        }

        const formData = new FormData();
        formData.append("handwriting", handwritingFile);
        formData.append("transcription", transcriptionFile);
        formData.append("description", description);
        formData.append("path_id", pathId);

        try {
            const response = await axios.post("http://localhost:8000/handwritings", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            console.log("✅ קובץ נשמר בהצלחה:", response.data);
            setMessage(`✅ קובץ נשמר בהצלחה: ${response.data.message}`);
        } catch (error) {
            console.error("❌ שגיאה בהעלאה:", error);
            setMessage("❌ שגיאה בהעלאת הקובץ, נסה שוב.");
        }
    };

    return (
        props.userAuthorization == 2 ?
            <>
                    <div className="card flex justify-content-center flex-column flex align-items-center">
                        <h1>לחץ לבחירת קובץ כתב היד</h1>
                        <FileUpload
                            name="handwriting"
                            customUpload
                            uploadHandler={() => {}} // מונע שליחה אוטומטית
                            onSelect={handleHandwritingSelect} // שומר את הקובץ ב-state
                            accept="image/*"
                            maxFileSize={5000000}
                            chooseLabel="בחר תמונה"
                            auto={false} // ביטול העלאה אוטומטית
                            mode="basic" // מונע הצגת כפתורי Upload ו-Cancel
                        />
                        {handwritingFile && <p>📸 קובץ תמונה נבחר: {handwritingFile.name}</p>}
                    </div>                
                {/* שלב 2 - בחירת קובץ תמלול */}
                <div className="card flex justify-content-center flex-column flex align-items-center">
                <h1>בחר קובץ תמלול</h1>
                <FileUpload
                    name="transcription"
                    customUpload
                    uploadHandler={() => {}} // מונע שליחה אוטומטית
                    onSelect={handleTranscriptionSelect} // שומר את הקובץ ב-state
                    accept="text/plain"
                    maxFileSize={5000000}
                    chooseLabel="בחר קובץ תמלול"
                    auto={false} // ביטול העלאה אוטומטית
                    mode="basic" // מונע הצגת כפתורי Upload ו-Cancel
                />
                {transcriptionFile && <p>📄 קובץ תמלול נבחר: {transcriptionFile.name}</p>}
                </div>  

                <div className="card flex justify-content-center flex-column flex align-items-center">
                {/* שלב 3 - הכנסת מידע נוסף */}
                <h1>תיאור כתב היד</h1>
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>                

                <div className="card flex justify-content-center flex-column flex align-items-center">
                <h1>מיקום שמירת כתב היד</h1>
                <input type="text" value={pathId} onChange={(e) => setPathId(e.target.value)} />
                {/* <ChoosePath userAuthorization={props.userAuthorization} setNavig={setNavig} setDescription={setDescription} setPath={setPathId} setVisible={setVisible} />                         */}
                </div>                

                <div className="card flex justify-content-center flex-column flex align-items-center">
                {/* כפתור לשליחת כל הנתונים לשרת */}
                <Button onClick={handleFinalUpload}>אישור הוספה למאגר</Button>
                {message && <p>{message}</p>}
                </div>                
                <div className="card flex justify-content-center flex-column flex align-items-center">                  
                <Button onClick={handleReset}>
                    Reset
                </Button>
                </div>              

                </>
                :
                <>
                    <h1>404</h1>
                    <h3>אין לך הרשאת גישה לעמוד זה.</h3>
                </>
    );
}
