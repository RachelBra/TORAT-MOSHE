import React, { useState } from "react";
import axios from "axios";
import { FileUpload } from "primereact/fileupload";
//import AddingSteps from './AddinfStepsGeneric';


function UploadHandwriting() {
    const [handwritingFile, setHandwritingFile] = useState(null);
    const [transcriptionFile, setTranscriptionFile] = useState(null);
    const [description, setDescription] = useState("");
    const [pathId, setPathId] = useState("");
    const [message, setMessage] = useState("");

    //const steps = [' הוספת כתב יד','הוספת קובץ תמלול', 'בחירת מיקום הכתב', 'בחירת שם כתב היד', 'אישור ושמירה' ]


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
        <div>
            {/* שלב 1 - בחירת תמונה */}
            <h3>📂 בחר תמונה של כתב יד</h3>
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

            {/* שלב 2 - בחירת קובץ תמלול */}
            <h3>📜 בחר קובץ תמלול</h3>
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

            {/* שלב 3 - הכנסת מידע נוסף */}
            <h3>📝 תיאור כתב היד</h3>
            <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />

            <h3>📂 מיקום שמירת כתב היד</h3>
            <input type="text" value={pathId} onChange={(e) => setPathId(e.target.value)} />

            {/* כפתור לשליחת כל הנתונים לשרת */}
            <button onClick={handleFinalUpload}>📤 אישור הוספה למאגר</button>
            {message && <p>{message}</p>}
        </div>
    );
}

export default UploadHandwriting;
