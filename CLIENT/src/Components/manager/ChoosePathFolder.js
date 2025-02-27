import React, { useState, useEffect } from 'react';
import { Tree } from 'primereact/tree';
import useGetAxiosApi from '../../Hooks/useGetAxiosApi';
import { enterHanwriting, createTree, showPath } from '../../Services/functions';
import { useNavigate } from 'react-router-dom';
import '../../App.css';
import axios from 'axios';

export default function FilterDemo(props) {

    const [nodes, setNodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(true);

    const getFoldersAndFiles = () => {
        axios.get(`http://localhost:8000/handwritings`
        )
            .then(function (response) {
                setData(response.data)
                const x = createTree(response.data.tree, { id: null });
                setNodes(x);
                setLoading(false);
            })
            .catch(function (error) {
            })
            .finally(function () {
            });
    }

        useEffect(() => {
        getFoldersAndFiles();
    }, [])

        const onSelectionChange = (e) => {
        const selectedNodeKey = e.node.key; // Accessing the key from e.node
        const updatedNodes = toggleNodeExpansion([...nodes], selectedNodeKey);
        setNodes(updatedNodes);
    }

        const toggleNodeExpansion = (nodes, keyToToggle) => {
        return nodes.map((node) => {
            if (node.key === keyToToggle) {
                return { ...node, expanded: !node.expanded };
            } else if (node.children) {
                return { ...node, children: toggleNodeExpansion(node.children, keyToToggle) };
            }
            return node;
        });
    };

    return (
        props.userAuthorization == 2 ?
            <>
                {loading ? <div>louding - do something</div>
                    : <div className="card flex flex-wrap justify-content-center gap-5">
                        <Tree style={{ "direction": "rtl" }}                         
                        className="w-full custom-tree-rtl md:w-30rem"
                        value={nodes} 
                        filter 
                        filterMode="strict" 
                        filterPlaceholder="Strict Filter"  
                        onNodeDoubleClick={(e) => {
                            !e.node.isNav && (props.setNavig(e.node.id));
                            !e.node.isNav && props.setVisible(true);
                            !e.node.isNav && props.setLabel(e.node?.label);
                            !e.node.isNav && props.setPath(showPath(e.node.id, data.tree));
                            !e.node.isNav && console.log("+++", showPath(e.node.id, data.tree));}}
                            onNodeClick={(e) => {!e.node.isNav &&
                                onSelectionChange(e)
                        }} />
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