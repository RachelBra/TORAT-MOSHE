
import React, { useState, useEffect } from 'react';
import { Tree } from 'primereact/tree';
import { enterHanwriting, createTree } from '../../Services/functions';
import axios from 'axios';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import '../../App.css';

export default function CheckboxSelectionDemo() {
    const [nodes, setNodes] = useState([]);
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visible, setVisible] = useState(false);



    const getFoldersAndFiles = () => {
        axios.get(`http://localhost:8000/handwritings`
        )
            .then(function (response) {
                console.log(" getUser קריאת שרת ");
                const x = createTree(response.data.tree, { id: null });
                const y = enterHanwriting(response.data.handwritings, x, response.data.tree)
                setNodes(y);
                setLoading(false);
            })
        // .catch(function (error) {      
        // })
        // .finally(function () {
        // });
    }

    const deleteFoldersFiles = (ids) => {
        axios.post(`http://localhost:8000/tree`, ids)
            .then(function (response) {
                console.log(" getUser קריאת שרת ");
                const x = createTree(response.data.tree, { id: null });
                const y = enterHanwriting(response.data.handwritings, x, response.data.tree)
                setNodes(y);
                setLoading(false);
            })
        // .catch(function (error) {      
        // })
        // .finally(function () {
        // });
    }
    useEffect(() => {
        getFoldersAndFiles();
    }, []);

    const searchTree = (select, index = 0) => {
        // var folders = []
        // var files = []
        // var all = []
        // Object.keys(select).forEach(s => {
        //      nodes.forEach(element => {
        //     if (element.key == s) {
        //         all.push(element)
        //     } else {
        //        element.children.forEach(element => {
                
        //        });
        //     }
        // });
        // });
       
    }
    const typeSelected = (selected) => {
        // var folders = [];
        // var files = [];
        // const keys = Object.keys(selected)
        // console.log("keys", keys);
        // console.log("tinananananananana", selected);
        // for (let k = 0; k < Object.keys(selected).length; k++) {
        //     const key = Object.keys(selected)[k];
        //     const val = Object.values(selected)[k];
        //     console.log(val);
        //     if (val.checked) {
        //         var node = nodes.find((e) => { return e.key == key });
        //         console.log("node", node);
        //         if (node['isNav'])
        //             files.push(node.id)
        //         else {
        //             folders.push(node.id)
        //             var index = k + 1
        //             while (node) {

        //             }
        //             k = index;
        //         }
        //     }
        // }
        const filesToDelete = searchTree(selected);
        const folders = filesToDelete.folders

    }

    const footerContent = (
        <div>
            <Button label="לא" icon="pi pi-times" onClick={() => { setVisible(false) }} className="p-button-text" />
            <Button label="כן" icon="pi pi-check" onClick={() => { deleteFoldersFiles(selectedKeys); setVisible(false); window.location.reload() }} autoFocus />
        </div>
    );

    return (
        <div className="card">
            <div className="card flex justify-content-center">
                <Tree style={{ "direction": "ltr" }} value={nodes} selectionMode="checkbox" selectionKeys={selectedKeys} onSelectionChange={(e) => { setSelectedKeys(e.value); console.log(Object.keys(e.value)); typeSelected(e.value) }} className="w-full md:w-30rem" />
            </div>
            <Button onClick={() => setVisible(true)} label="Delete" icon="pi pi-trash" />

            <div className="card flex justify-content-center flex-column flex align-items-center">
                <Dialog header="האם אתה בטוח שברצונך למחוק את התיקיות והקבצים שנבחרו?" visible={visible} style={{ width: '50vw' }} onHide={() => { console.log("pp"); setVisible(false) }} footer={footerContent}>
                    <p className="m-0">לאחר אישור המחיקה לא ניתן יהיה לשחזר את הקבצים הנ"ל</p>
                </Dialog>
            </div>
        </div>
    )
}
