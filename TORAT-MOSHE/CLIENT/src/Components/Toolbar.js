import React, { useRef } from 'react';
import { MegaMenu } from 'primereact/megamenu';
import { useNavigate } from "react-router-dom"
import { TieredMenu } from 'primereact/tieredmenu';
import { Button } from 'primereact/button';
import '../App.css';

const Toolbar = (props) => {

    const navigate = useNavigate();

    const menu = useRef(null);
    const tms = [
        {
            label: 'החלף משתמש',
            icon: 'pi pi-times',
            command: () => { props.set(null, null, null); navigate("LogIn") }
        },
        {
            label: 'יציאה',
            icon: 'pi pi-sign-out',
            command: () => { localStorage.clear(); props.set(null, null, null); navigate("/"); }
        },
        {
            label: ' חזרה',
            command: (e) => menu.current.toggle(e)
        }
    ];

    let items = [
        { label: 'צור קשר', command: () => { navigate("/Contact") }, icon: <i className="pi pi-envelope  ml-2 mr-2 text-yellow-600" style={{ fontSize: '1rem' }}></i> },
        { label: 'דף הבית', command: () => navigate("/"), icon: <i className="pi pi-file-edit ml-2 mr-2 text-yellow-600" style={{ fontSize: '1rem'}}></i> },
        { label: 'כתבי יד', command: () => navigate("/Tree"), icon: <i className="pi pi-home  ml-2 mr-2 text-yellow-600" style={{ fontSize: '1rem'}}></i> },
        { label: 'ספרים', command: () => navigate("/Books"), icon: <i className="pi pi-server  ml-2 mr-2 text-yellow-600" style={{ fontSize: '1rem' }}></i> }
    ]
    let a = localStorage.getItem("user");
    var tmp;

    if (a) {
        a = JSON.parse(a);
        tmp = <div className="flex flex-column  justify-content-start flex-wrap p-0 m-0 sm:mr-0 mr-3 "><Button className=' mx-2 'icon={<i className="pi pi-user text-yellow-600" style={{ fontSize: '1rem'}}></i>} rounded text raised  onClick={(e) =>  menu.current.toggle(true)} /><h6 className='m-0 p-0 text-yellow-600'>{`הרב ${a.last_name}`}</h6></div>
    }
    else
        tmp = <div className="flex flex-column  justify-content-start flex-wrap p-0 m-0 sm:mr-0 mr-3  "><Button className=' mx-2 ' icon={<i className="pi pi-user text-yellow-600" style={{ fontSize: '1rem' }}></i>} rounded text raised  onClick={() => navigate("LogIn")} /><h6 className='m-0 p-0 mx-2 text-yellow-600'>התחברות</h6></div>


    const start = <img alt="logo" src="https://primefaces.org/cdn/primereact/images/logo.png" height="40" className="mr-2"></img>;
    const end = tmp;

    return (
        <>
            <TieredMenu className=' top-0 left-4 mr-0 justify-content-center  ' model={tms} popup ref={menu} breakpoint="767px" style={{ position: 'fixed', right: '0px' }} />
            {/* <div className="flex flex-wrap justify-content-between align-items-center gap-3 mt-3 " style={{ }}> */}
            <div className="opacity-90 card border-top-2 border-yellow-600 surface-overlay justify-content-center">
                <MegaMenu style={{ width: "100%", high: "20%" }} className=' opacity-100 h-7rem text-xl  border-none border-bottom-2 ' model={items} orientation="horizontal" start={start} end={end} breakpoint="960px" />
            </div>
        </>

    )
}

export default Toolbar
