import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { orderCorrections, orderPeirush, orderComments } from '../../Services/functions';
import useGetAxiosApi from '../../Hooks/useGetAxiosApi';
import { useFetcher, useNavigate, useParams } from "react-router-dom"
import 'primeflex/primeflex.css';
import axios from 'axios';
import '../../Services/style/approvals.css';
import DropZone from './UploadHandwriting';
export default function SingleColumnDemo(props) {
    const navigate = useNavigate();
    const params = useParams()

    const [corr, setCorr] = useState([]);
    const [peir, setPeir] = useState([]);
    const [state, setState] = useState([]);

    const get = () => {
        axios.get(`http://localhost:8000/approvals/correctionsAndPeirushim`
        )
            .then(function (response) {
                const x = orderCorrections(response.data.corrections)
                setCorr(x)
                const y = orderPeirush(response.data.peirushim)
                setPeir(y)
            })
            .catch(function (error) {      
            })
            .finally(function () {
            });
    }

    useEffect(() => {
     
    }, []) 

    // const { data, loading } = useGetAxiosApi('approvals/correctionsAndPeirushim');

    useEffect(() => {
        get();
        // if(params.flag =='rb'){
        //     navigate(`/Approvals/${"hh"}`);
        //     window.location.reload()
        // }
        // if (data) {
          
        // }

    }, [])
    /////////////////////
    // const [updateAttched, setUpdateAttched] = useState([]);לא קשור זה העלאת תמונה

    return (
        props.userAuthorization == 2 ?
            <div className="card mt-3" style={{ "width": "80%", "direction": "rtl" }}>
            {/* <DropZone setUpdateAttched={setUpdateAttched}></DropZone>לא קשור זה העלאת תמונה
            {updateAttched.length>0&&updateAttched.map((item)=>{
                return<>
                <h1>{item.fileName}!!</h1></>
                })} */}
                {corr.length > 0 &&
                    <>
                        <h1 >תיקונים לתמלול כתב היד:</h1>
                        <DataTable className='text-yellow-600 cursor-pointer' value={corr} tableStyle={{ minWidth: '50rem' }} onRowClick={(e) => { navigate(`/HandwritingManagerCorrection/${e.data.id}`, { state: { corrections: e.data.corr } }); setState(e.data.corr) }} >
                            <Column field="description" header="תיאור" sortable style={{ width: '25%' }} className='text-right' ></Column>
                            <Column field="quantity" header="מספר תיקונים" sortable style={{ width: '25%' }} className='text-right'></Column>
                        </DataTable>
                    </>||<>
                        <div  className="card mt-3" style={{ "width": "80%", "direction": "rtl" }}>
                            <p>אין תיקונים חדשים לאשר</p>
                        </div>
                    </>
                    }
                {peir.length > 0 &&
                    <div className='pt-6'>
                        <h1 >פירושים לאישור:</h1>
                        <DataTable className='text-yellow-600 cursor-pointer' value={peir} tableStyle={{ minWidth: '50rem' }} onRowClick={(e) => navigate(`/HandwritingManagerPeirushim/${e.data.id}`, { state: { peirushim: e.data.perr } }) }>
                            <Column field="description" header="תיאור" sortable style={{ width: '25%' }} className='text-right'></Column>
                            <Column field="quantity" header="מספר תיקונים" sortable style={{ width: '25%' }} className='text-right'></Column>
                        </DataTable>
                    </div>||<>
                    <div  className="card mt-3" style={{ "width": "80%", "direction": "rtl" }}>
                        <p>אין פירושים חדשים לאשר</p>
                    </div>
                </>}
            </div>
            :
            <>
                <h1>פדיחה! 🤨🤔😵</h1>
                <h3>לא ברור איך הגעת לכאן לכאן אבל-- </h3>
                <b>אין לך הרשאת גישה לעמוד זה.</b>
            </>

    );
}
