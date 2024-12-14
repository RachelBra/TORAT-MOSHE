// import React, { useRef } from "react";
import { useForm, Controller } from 'react-hook-form';
import { Editor } from 'primereact/editor';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import axios from 'axios';
import { NavLink } from "react-router-dom";
import React, { useState } from 'react';
import { BlockUI } from 'primereact/blockui';
// import { Panel } from 'primereact/panel';
import { Fieldset } from 'primereact/fieldset';
import '../../App.css';



const Peirush = (props) => {

    const showPerush = () => {
        var prsh = [];
        for (let index = props.peirushim.length-1; index >= 0; index--) {
            props.peirushim[index].permission == 1 &&  prsh.push(
                <Fieldset className='mt-3' style={{direction: "rtl"}} legend={`הערה ${index + 1} `}>
                    <p className="m-0">
                        {props.peirushim[index].peirush_text}
                    </p>
                </Fieldset>
            )
        }
        return prsh;
    }

    return (
        <>
            {showPerush()}
        </>
    );

}
export default Peirush;