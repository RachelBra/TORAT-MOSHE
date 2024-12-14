import React, { useState, useEffect } from 'react';
import { Tree } from 'primereact/tree';
import useGetAxiosApi from '../../Hooks/useGetAxiosApi';
import { enterHanwriting, createTree, showPath } from '../../Services/functions';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

export default function ChangeTree(props) {

    const [nodes, setNodes] = useState([]);
    const { data, loading: loadingTmp } = useGetAxiosApi('handwritings');
    const [loading, setLoading] = useState(true);
    const [visible, setVisible] = useState(false);
    const [navig, setNavig] = useState(null);
    const [path, setPath] = useState("💕");
    const [description, setDescription] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        if (data) {
            const x = createTree(data.tree, { id: null });
            const y = enterHanwriting(data.handwritings, x, data.tree)
            setNodes(y);
            setLoading(false);
        }
    }, [data])

    return (
        props.userAuthorization == 2 ?
            <>
           
                {loading ? <div>louding - do something</div> :
                    <div className="align-items-center ">
                        <div className="card flex flex-column m-3 align-items-center" style={{ "width": "80%" }}>
                            <div>
                                <div >
                                    <Button className='m-2' label="הוספת כתב יד" icon={<i className="pi pi-cloud-upload ml-3" style={{ fontSize: '1rem', color: 'orange' }}></i>} severity="secondary" onClick={() => navigate("/AddHandwriting")} />
                                    <Button className='m-2' label="הוספת תקייה" icon={<i className="pi pi-cloud-upload ml-3" style={{ fontSize: '1rem', color: 'orange' }}></i>} severity="secondary" onClick={() => navigate("/AddFolder")} />
                                    <Button className='m-2' label="הוספת ספר" icon={<i className="pi pi-cloud-upload ml-3" style={{ fontSize: '1rem', color: 'orange' }}></i>} severity="secondary" onClick={() => navigate("/AddBook")} />
                                </div>
                                <div>
                                    <Button className='m-2' label="מחיקת כתב יד" icon={<i className="pi pi-trash ml-3" style={{ fontSize: '1rem', color: 'orange' }}></i>} severity="secondary" onClick={() => navigate("/DeleteHandwriting")} />
                                    <Button className='m-2' label="מחיקת תקייה" icon={<i className="pi pi-trash ml-3" style={{ fontSize: '1rem', color: 'orange' }}></i>} severity="secondary" onClick={() => navigate("/DeleteFolder")} />
                                    <Button className='m-2' label="מחיקת ספר" icon={<i className="pi pi-trash ml-3" style={{ fontSize: '1rem', color: 'orange' }}></i>} severity="secondary" onClick={() => navigate("/DeleteBook")} />
                                </div>
                            </div>
                            <div className='mt-7'>
                                <Tree style={{ "direction": "ltr" }} value={nodes} filter filterMode="strict" filterPlaceholder="Strict Filter" className="w-full md:w-30rem" onNodeClick={(e) => {
                                    !e.node.isNav && (setNavig(e.node.id));
                                    !e.node.isNav && setVisible(true);
                                    !e.node.isNav && setDescription(e.node.label);
                                    !e.node.isNav && setPath(showPath(e.node.id, data.tree));
                                }} />
                            </div>
                        </div>
                    </div>}
            </>
            :
            <>
                <h1>פדיחה! 🤨🤔😵</h1>
                <h3>לא ברור איך הגעת לכאן לכאן אבל-- </h3>
                <b>אין לך הרשאת גישה לעמוד זה.</b>
            </>
    )
}