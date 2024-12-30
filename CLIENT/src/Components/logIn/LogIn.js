import React, { useState, useEffect, useRef } from 'react';
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';
import { Link, NavLink, useNavigate } from "react-router-dom"
import { InputText } from "primereact/inputtext";
import { Toast } from 'primereact/toast';
import axios from 'axios';
import { Password } from 'primereact/password';
import 'primeflex/primeflex.css';
import '../../App.css';

const LogIn = (props) => {
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [err, setErr] = useState("");
    const [rrr, setRrr] = useState("");
    const toast = useRef(null);
    const validEmail = (text) => {
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(text))
            setErr('כתובת המייל אינה חוקית');
        else
            setErr("");
    }

    const getUser = () => {
        const cookies = axios.get(`http://localhost:8000/users/logIn/${email}/${password}`
        )
            .then(function (response) {
                props.set(response.data.accessToken.foundUser.id, response.data.accessToken.foundUser.authorization, email)
                navigate("../")
                
            })
            .catch(function (error) {
                setRrr(error.response.data.message);
            })
            .finally(function () {

            });
    }

    useEffect(() => {
        if (rrr) {
            toast.current.show({ severity: 'info', summary: 'Error', detail: rrr })
        }
    }, [rrr]);

    return (
        <div className=" opacity-90 card mt-3" style={{ "width": "70%", "direction": "rtl" }} >
            <div className="flex flex-column md:flex-row">
                <div className="w-full md:w-5 flex flex-column align-items-s justify-content-center gap-3 py-5" >
                    <div className="flex flex-column justify-content-center align-items-center gap-2">
                        <div className="flex flex-column">
                            <span className="opacity-100 p-float-label flex-column">
                                <InputText id="email" email={email} onDragEnter={() => getUser()} onChange={(e) => { setEmail(e.target.value); validEmail(e.target.value) }} onBlur={(e) => validEmail(e.target.value)} />
                                <label htmlFor="email"> אימייל*</label>
                            </span>
                        </div>
                        <div className="flex-column">
                            <small className="p-error" >{err}</small>
                        </div>
                    </div>

                    <div className=" flex flex-wrap justify-content-center align-items-center gap-2">
                        <span className="opacity-100 p-float-label">
                            <Password id="password" password={password} onDragEnter={() => getUser()} feedback={false} onChange={(e) => setPassword(e.target.value)} />
                            <label htmlFor="password">סיסמה*</label>
                        </span>
                    </div>

                    <div className="flex flex-wrap justify-content-center align-items-center mt-3 gap-2">
                            <Button onClick={() => getUser()} onDragEnter={() => getUser()} label="כניסה" icon="pi pi-user"  className="m-1 w-13rem border-1 border-bluegray-500 " severity="secondary" raised />
 </div>

                    <div className='alin-cente' style={{ textAlign: 'center' }}>
                        <div className='text-cente'>    שכחת את הסיסמה?<NavLink to={"/RePassword1"}>שחזור סיסמה</NavLink></div>
                    </div>

                </div>
                <div className="w-full md:w-2">
                    <Divider layout="vertical" className="hidden md:flex">
                        <b>OR</b>
                    </Divider>
                    <Divider layout="horizontal" className="flex md:hidden" align="center">
                        <b>OR</b>
                    </Divider>
                </div>
                <div className="w-full md:w-5 flex align-items-center justify-content-center py-5">
                    <Button onClick={() => navigate("/Register")} label="הירשם" icon="pi pi-user-plus" className="p-button-success w-13rem mx-auto opacity-100" severity="secondary" text raised />

                </div>
            </div>
            <Toast ref={toast} />

        </div>
    )
}
export default LogIn;
