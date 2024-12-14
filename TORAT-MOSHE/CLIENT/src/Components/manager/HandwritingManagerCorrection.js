import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { Image } from 'primereact/image';
import { Divider } from 'primereact/divider';
import { ProgressSpinner } from "primereact/progressspinner";
import { Card } from 'primereact/card';
import TranscptionManager from "./TranscptionManager";
import axios from 'axios';
import '../../App.css';

const Handwriting = () => {
    const params = useParams()
    const handwritingId = params.id;
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(true);

    const get = () => {
        axios.get(`http://localhost:8000/handwritings/${handwritingId}`)
            .then(function (response) {
                setData(response.data);
                setLoading(false);
            })
            .catch(function (error) {
                 <p>Error!</p>;
            })
            .finally(function () {
            });
    }

    useEffect(() => {
        get();
    }, [])
  

    if (loading) {
        return (
            <div className="card flex justify-content-center">
            <ProgressSpinner />
        </div>
        )
    }

    return (
        <>
            <div className="card" style={{ "width": "100%", "direction": "rtl" }} >
                <div className="flex flex-column md:flex-row">
                    <div className="w-full  flex flex-column align-items-center justify-content-center gap-3 py-5" >
                        {<Image src={`data:image/png;base64,${data.handwriting.image_path}`} alt="Image" width="100%" preview p-button-text  />}

                    </div>
                    <div className="w-full md:w-2">
                        <Divider layout="vertical" className="hidden md:flex">
                            <b><i className="pi pi-arrows-h"></i></b>
                        </Divider>
                        <Divider layout="horizontal" className="flex md:hidden" align="center">
                            <b><i className="pi pi-arrows-v"></i></b>
                        </Divider>
                    </div>
                    <div className="w-full  flex align-items-center justify-content-center py-5">
                        <div className="w-full md:w-s5 flex align-items-center justify-content-center py-5">
                            <Card title="תמלול על ידי טכנולוגיה של בינה מלאכותית">
                                <TranscptionManager text={data.handwriting.transcription} handwritingId={handwritingId}  ></TranscptionManager>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Handwriting;