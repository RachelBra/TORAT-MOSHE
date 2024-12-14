import React, { useRef } from 'react';
import { MegaMenu } from 'primereact/megamenu';
import { useNavigate } from "react-router-dom"                         // icons
import 'primeflex/primeflex.css';
import { TieredMenu } from 'primereact/tieredmenu';
import '../../Services/style/perush.css';
import { Button } from 'primereact/button';

const ManagerToolbar = (props) => {

    const navigate = useNavigate();
    const menu = useRef(null);

    const tms = [
        {
            label: 'החלף משתמש',
            icon: 'pi pi-times',
            command: () => {navigate("LogIn"); props.set( null,null, null)}
        },
        {
            label: 'יציאה',
            icon: 'pi pi-sign-out',
            command: () => { localStorage.clear();  props.set( null,null, null); navigate("/"); }
        },
        {
            label: ' חזרה',
            command: (e) => menu.current.toggle(e)
        }
    ];
    const items = [
        { label: 'כתבי יד', command: () => { props.setHelp(2); navigate("/Tree") }, icon: <i className="pi pi-file-edit  ml-2 mr-2 text-yellow-600" style={{ fontSize: '1rem', color: 'orange' }}></i> },
        { label: 'ספרים', command: () => navigate("/Books"), icon: <i className="pi pi-server  ml-2 mr-2 text-yellow-600" style={{ fontSize: '1rem', color: 'orange' }}></i> },
        { label: 'שינויים בעץ החיפוש', command: () => navigate("/ChangeTree"), icon: <i className="pi pi-pencil  ml-2 mr-2 text-yellow-600" style={{ fontSize: '1rem', color: 'orange' }}></i> },
        { label: 'אישורים', command: () => {navigate(`/Approvals/${"rb"}`) }, icon: <i className="pi pi-check-circle  ml-2 mr-2 text-yellow-600" style={{ fontSize: '1rem', color: 'orange' }}></i> },
        { label: '  דף הבית  ', command: () => navigate("/"), icon: <i className="pi pi-home  ml-2 mr-2 text-yellow-600" style={{ fontSize: '1rem', color: 'orange' }}></i> },
        { label: 'ניהול משתמשים', command: () => navigate("UsersDetails"), icon: <i className="pi pi-users  ml-2 mr-2 text-yellow-600" style={{ fontSize: '1rem', color: 'orange' }}></i> },
    ];

    const start = <img alt="logo" src="https://primefaces.org/cdn/primereact/images/logo.png" height="40" className="mr-2"></img>;
    const end = <div className="flex flex-column  justify-content-start flex-wrap p-0 m-0 sm:mr-0 mr-3 "><Button  className='2rem mx-2 ' icon={<i className="pi pi-user text-yellow-600" style={{ fontSize: '1rem'}}></i>} rounded text raised severity="warning" onClick={(e) => menu.current.toggle(true)} /><h5 className='m-0 p-0 mx-2 text-yellow-600'>מנהל</h5></div>

    return (
        <>
            <span><TieredMenu className=' top-0 left-4 mr-0 justify-content-center ' model={tms} popup ref={menu} breakpoint="767px" style={{ position: 'fixed', right: '0px' }} /></span>
            <div className="card border-top-2 border-yellow-600 surface-overlay justify-content-center">
                <MegaMenu style={{  "width": "100%" }} className='align-items-right text-right h-7rem text-xl  border-none border-bottom-2 ' model={items} orientation="horizontal" start={start} end={end} breakpoint="960px" />
            </div>
        </>
    )
}

export default ManagerToolbar