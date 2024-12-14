import React, { useState, useEffect } from 'react';
import { Tree } from 'primereact/tree';
import { enterHanwriting, createTree } from '../Services/functions';
import { useNavigate } from 'react-router-dom';
import { ProgressSpinner } from 'primereact/progressspinner';
import 'primeflex/primeflex.css';
import '../App.css';
import axios from 'axios';

export default function Treee(props) {

    const navigate = useNavigate()
    const [nodes, setNodes] = useState([]);
    const [loading, setLoading] = useState(true);

    const getFoldersAndFiles = () => {
        axios.get(`http://localhost:8000/handwritings`
        )
            .then(function (response) {
                const x = createTree(response.data.tree, { id: null });
                const y = enterHanwriting(response.data.handwritings, x, response.data.tree)
                setNodes(y);
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

    // לסגור צומת כשפותחים אחר

    //   const [selectedNodeKey, setSelectedNodeKey] = useState(null);

    //   const toggleNodeExpansion = (nodes, keyToToggle) => {
    //     return nodes.map((node) => {
    //       if (node.key === keyToToggle) {
    //         return { ...node, expanded: !node.expanded };
    //       } else if (node.children) {
    //         const isChildExpanded = node.children.some((child) => child.expanded);
    //         return {
    //           ...node,
    //           expanded: isChildExpanded ? node.expanded : false,
    //           children: toggleNodeExpansion(node.children, keyToToggle),
    //         };
    //       }
    //       return node;
    //     });
    //   };

    //   const onSelectionChange = (e) => {
    //     const newSelectedNodeKey = e.node.key;

    //     console.log("new: ", newSelectedNodeKey, " olde: ", selectedNodeKey);

    //     if (selectedNodeKey === newSelectedNodeKey) {
    //       // Clicking on the same node, toggle its expansion state
    //       const updatedNodes = toggleNodeExpansion([...nodes], newSelectedNodeKey);
    //       setNodes(updatedNodes);
    //     } else {
    //       // Clicking on a different node, close the previously selected node and open the new one
    //       const updatedNodes = closeNodeAndToggle([...nodes], selectedNodeKey, newSelectedNodeKey);
    //       setNodes(updatedNodes);
    //       setSelectedNodeKey(newSelectedNodeKey);
    //     }
    //   };

    //   const closeNodeAndToggle = (nodes, keyToClose, keyToToggle) => {
    //     return nodes.map((node) => {
    //       if (node.key === keyToClose) {
    //         return { ...node, expanded: false };
    //       } else if (node.key === keyToToggle) {
    //         return { ...node, expanded: !node.expanded };
    //       } else if (node.children) {
    //         return { ...node, children: closeNodeAndToggle(node.children, keyToClose, keyToToggle) };
    //       }
    //       return node;
    //     });
    //   };

    return (
        <>
            {loading ? (
                <div className="card pacity-90 flex justify-content-center">
                    <ProgressSpinner />
                </div>
            ) : (
                <div className="card pacity-90 mt-3 flex flex-wrap justify-content-center gap-5 " style={{ "width": "45%" }} >
                    <Tree
                        loading={loading}
                        style={{ direction: 'rtl' }}
                        className=" w-full md:w-40rem custom-tree-rtl"
                        value={nodes}
                        filter
                        filterMode="strict"
                        filterPlaceholder=" לחיפוש כתב יד\תיקייה"
                        onNodeClick={(e) => {
                            e.node.isNav ? navigate(`Handwriting/${e.node.id}`)
                                :
                                onSelectionChange(e)
                        }}
                        selectionMode="single"
                        // nodeTemplate = {customNodeTemplate}
                    />
                    <div>https://primereact.org/speeddial/</div>
                    <div>https://primereact.org/tabview/</div>

                </div>
            )}
        </>
    )
}
