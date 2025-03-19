import React, { useState, useEffect } from 'react';
import { Tree } from 'primereact/tree';
import useGetAxiosApi from '../../Hooks/useGetAxiosApi';
import { enterHanwriting, createTree } from '../../Services/functions';
import { useNavigate } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Divider } from 'primereact/divider';
import { ProgressSpinner } from 'primereact/progressspinner';

export default function ChangeTree({ userAuthorization }) {
    const [nodes, setNodes] = useState([]);
    const { data, loading: loadingTmp } = useGetAxiosApi('handwritings');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (data) {
            const tree = createTree(data.tree, { id: null });
            const updatedNodes = enterHanwriting(data.handwritings, tree, data.tree);
            setNodes(updatedNodes);
            setLoading(false);
        }
    }, [data]);

    if (userAuthorization !== 2) {
        return (
            <div className="p-4 text-center">
                <h1>פדיחה! 🤨🤔😵</h1>
                <h3>לא ברור איך הגעת לכאן, אבל--</h3>
                <b>אין לך הרשאת גישה לעמוד זה.</b>
            </div>
        );
    }

    return (
        <div className="flex justify-content-center">
            {loading ? (
                <div className="flex align-items-center justify-content-center" style={{ height: '100vh' }}>
                    <ProgressSpinner />
                </div>
            ) : (
                <Card className="m-4 p-4 w-10">
                    <h2 className="text-center">ניהול כתב יד</h2>
                    <Divider />
                    <div className="flex flex-wrap justify-content-center gap-3">
                        <Button label="הוספת כתב יד" icon="pi pi-cloud-upload" severity="secondary" onClick={() => navigate("/AddHandwriting")} />
                        <Button label="הוספת תקייה" icon="pi pi-folder-open" severity="secondary" onClick={() => navigate("/AddFolder")} />
                        <Button label="הוספת ספר" icon="pi pi-book" severity="secondary" onClick={() => navigate("/AddBook")} />
                    </div>
                    <Divider />
                    <div className="flex flex-wrap justify-content-center gap-3">
                        <Button label="מחיקת כתב יד" icon="pi pi-trash" className="p-button-danger" onClick={() => navigate("/DeleteHandwriting")} />
                        <Button label="מחיקת תקייה" icon="pi pi-trash" className="p-button-danger" onClick={() => navigate("/DeleteFolder")} />
                        <Button label="מחיקת ספר" icon="pi pi-trash" className="p-button-danger" onClick={() => navigate("/DeleteBook")} />
                    </div>
                </Card>
            )}
        </div>
    );
}
