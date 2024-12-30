import React, { useState, useEffect, useRef } from "react";
import { AutoComplete } from "primereact/autocomplete";
import AddPeirush from "./AddPeirush";
import axios from 'axios';
import useGetAxiosApi from '../../Hooks/useGetAxiosApi';
import { useParams } from 'react-router-dom';
import { Button } from 'primereact/button';
import Peirush from "./Peirush";
import { Image } from 'primereact/image';
import { Divider } from 'primereact/divider';
import Transcption from "./Transcption";
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';
import '../../Services/style/handwriting.css';

const Handwriting = () => {
    const params = useParams()
    const handwritingId = params.id;
    const [open, setOpen] = useState(0);
    const toast = useRef(null);


    const { data, loading, error, refetch } = useGetAxiosApi(`handwritings/${handwritingId}`);

    if (loading) {
        return <p>Loading...</p>;
    }
    if (error) {
        return <p>Error!</p>;
    }


    const show = () => {
        toast.current.show({ severity: 'success', summary: 'תודה!', detail: 'הצעת התיקון נשלחה למנהל המערכת ותטופל בהקדם' });
    };

    const show1 = () => {
        toast.current.show({ severity: 'success', summary: 'תודה!', detail: 'הערתך נקלטה במערכת ותפורסם לאחר אישור המנהל' });
    };
    return (
        <>
            <Toast ref={toast} />
            <div className="card" style={{ "width": "100%", "direction": "rtl" }} >
                <div className="flex flex-column md:flex-row">
                    <div className="w-full md:w-5 flex flex-column align-items-center justify-content-center gap-3 py-5" >
                    {<Image src={`data:image/png;base64,${data.handwriting.image_path}`} alt="Image" width="100%" preview style={{ marginLeft: "1px" }} />}
                        {/* {<Image src={`data:image/png;base64,${data.handwriting.image_path}`} alt="Image" width="250" preview p-button-text style={{ marginLeft: "3px" }} />} @do warning@ */}

                    </div>
                    <div className="w-full md:w-2">
                        <Divider layout="vertical" className="hidden md:flex">
                            <b><i className="pi pi-arrows-h"></i></b>
                        </Divider>
                        <Divider layout="horizontal" className="flex md:hidden" align="center">
                            <b><i className="pi pi-arrows-v"></i></b>
                        </Divider>
                    </div>
                    <div className="w-full h-full md:w-5 flex align-items-center justify-content-center py-5">
                        <div className="w-full h-full md:w-s5 flex align-items-center justify-content-center py-5">
                            <Card style={{ width: '100%', height:'100%' }}>
                                <Transcption show={show} text={data.handwriting.transcription} handwritingId={handwritingId}></Transcption>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
            <div className="card">
                <div className="card  flex-column flex justify-content-right  " style={{ "width": "89%" }}>
                    <Divider align="right">
                        {open == 0 ? <Button className="" style={{ direction: 'ltr' }} label="הוספת פירוש" severity="secondary" rounded onClick={() => setOpen(1)} icon='pi pi-plus' /> : <></>}
                    </Divider>                  
                    {open == 1 && <AddPeirush show={show1} setOpen={setOpen} open={open} handwritingId={handwritingId}></AddPeirush>}
                    <Peirush peirushim={data.peirushim} handwritingId={handwritingId}></Peirush>
                </div>
            </div>
        </>
    )
}

export default Handwriting;