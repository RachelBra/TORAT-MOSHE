import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import axios from 'axios';
import { NavLink, useLocation } from 'react-router-dom';
import { ScrollPanel } from 'primereact/scrollpanel';
import { ListBox } from 'primereact/listbox';
import { Dialog } from 'primereact/dialog';
import { useNavigate } from "react-router-dom"
import '../../App.css';
function Transcption(props) {

    const [content, setContent] = useState(props.text);
    const [id, setId] = useState("");
    const [corr, setCorr] = useState([]);
    const [open, setOpen] = useState(false);
    const [flagIgnore, setFlagIgnore] = useState(false);
    const [visible, setVisible] = useState(false);
    const [originalWord, setOriginalWord] = useState("");
    const [userId, setUserId] = useState(0);
    const [newWord, setNewWord] = useState("");
    const [indexWord, setIndexWord] = useState(0);
    const [help, setHelp] = useState(false);

    const location = useLocation();
    const corrections = location.state.corrections;
    console.log("corrections", corrections);

    const navigate = useNavigate();

    useEffect(() => {
        const tmp = corrections?.find(e => e.id == id)
        setOriginalWord(tmp?.original_word);
        setNewWord(tmp?.new_word)
        setIndexWord(tmp?.word_index);
        setUserId(tmp?.user_id);
    }, [id, originalWord])

    //מערך של כל האינדקסים במילה
    const words = props.text.split('');

    //רשימת התיקונים לכתב היד

    let chars = [];
    //מציאת האינדקסים אותם יש לסמן - עליהם יש תיקונים
    corrections?.forEach(element => {
        for (let i = element.word_index; i < element.word_index + element.original_word.length; i++) {
            chars.push(i);
        }
    });

    //מציאת האינדקסים המתאימים למילה הספציפית שנבחרה במסך
    const showCorrections = (e) => {
        let tmp = [];
        corrections?.forEach(element => { if (element.word_index <= e && element.word_index + element.original_word.length >= e) { tmp.push({ name: element.new_word, code: element.id, original_word: element.original_word, word_index: element.word_index }); } })
        tmp.push({ name: "-התעלמות מכלל התיקונים-", original_word: "-" })
        setCorr(tmp);
        setOpen(true);
        setHelp(true);
    }

    // const getUserDetails(userId)=>{
    //     axios.get('users/localStorage')

    // }

    const server = (newTr, dlt, arr) => {
        newTr != "" &&
            axios.put(`http://localhost:8000/handwritings/transcription/${props.handwritingId}`, { transcription: newTr })
                .then(function (response) {
                })
                .catch(function (error) {
                })
                .finally(function () {
                });
        axios.post(`http://localhost:8000/approvals/corrections`, { corrections: dlt })
            .then(function (response) {
            })
            .catch(function (error) {
            })
            .finally(function () {
            });

        arr.length > 0 &&
            axios.put(`http://localhost:8000/approvals/updateCorr`, { arr: arr })
                .then(function (response) {
                })
                .catch(function (error) {
                })
                .finally(function () {
                });
        navigate(`/Approvals/${"rb"}`);
    }


    //עידכון כתב היד ועדכון האינדקסים המסומנים
    const update = () => {
        let newTr = "";
        let arr = [];
        if (!flagIgnore) {
            newTr = `${content.slice(0, indexWord)}${newWord}${content.slice(indexWord + originalWord.length, -1)}`;
            var difference = newWord.length - originalWord.length;
            corrections.forEach(element => {
                if (element.word_index > indexWord)
                    arr.push({
                        i: element.id,
                        word_index: element.word_index + difference
                    })
            });
        }
        const dlt = corr.map(e => e.code);
        server(newTr, dlt, arr);
    }

    const footerContent = (
        <div>
            <Button onClick={() => { update(); setVisible(false) }} label="כן" className="m-1 border-1 border-bluegray-500 w-6.7rem" icon="pi pi-check" severity="secondary" type="submit" raised />
            <Button onClick={() => { setVisible(false) }} label="לא" className="m-1" icon="pi pi-times" severity="secondary" type="submit" raised outlined />
        </div>
    );
    return (
        <div >
            <ScrollPanel onClick={() => { if (help) { setOpen(false); setHelp(false) } }} style={{ width: '100%', height: '200px' }} className="custombar1">
                <p>
                    {words.map((word, index) => {
                        if (chars.find(e => e == index)) {
                            return (
                                <span className='cursor-pointer' onClick={() => showCorrections(index)} key={index} style={{ backgroundColor: 'orange' }}>
                                    {word}
                                </span>);
                        } else {
                            return <span key={index}>{word}</span>;
                        }
                    })}
                </p>
            </ScrollPanel>

            {open && <ListBox onClick={(e) => { setVisible(true) }} onChange={(e) => { setId(e.value.code); e.value.original_word == "-" ? setFlagIgnore(true) : setFlagIgnore(false) }} options={corr} optionLabel="name" />}

            <Dialog header="אישור הנתיב" visible={visible} style={{ width: '40vw', direction: 'rtl' }} onHide={() => setVisible(false)} footer={footerContent}>
                <p className="m-1">בלחיצה על אישור הקובץ יתעדכן, </p>
                <p className="m-1">וכל שאר ההצעות על המילה הזו ימחקו. </p>
                {flagIgnore ?
                    <>
                        <p className="mt-2 font-bold"> תרצה להשאיר את המילה המקורית</p>
                        <p className="m-1 font-bold"> ולמחוק את כל הצעות התיקון למילה זו?</p>
                    </>
                    :
                    <>
                        <p className="m-2"> תרצה להחליף את המילה:</p>
                        <p className="m-2 font-bold"> {originalWord}</p>
                        <p className="m-2"> במילה:</p>
                        <p className="m-2 font-bold">{newWord}</p>
                        <div className='m-3 text-cente'>רוצה לראות את פרטי מעלה התיקון? 
                            {/* <NavLink to={{
                                pathname: "/UsersDetails",
                                state: {
                                    id: userId
                                }
                            }}>לחץ כאן {userId}</NavLink> */}
                            <a onClick={() => navigate("/UsersDetails", { state: { id: userId } })}className='text-primary-600 hover:underline cursor-pointer m-1' >לחץ כאן</a>

                        </div>
                    </>
                }
            </Dialog>

        </div >
    );
}
export default Transcption;

