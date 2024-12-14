import React, { useState, useEffect } from 'react';
import { Tree } from 'primereact/tree';
import useGetAxiosApi from '../../Hooks/useGetAxiosApi';
import { enterHanwriting, createTree, showPath } from '../../Services/functions';
import { useNavigate } from 'react-router-dom';
import '../../App.css';
export default function FilterDemo(props) {

    const [nodes, setNodes] = useState([]);
    const { data, loading: loadingTmp, refetch } = useGetAxiosApi('handwritings');
    const [loading, setLoading] = useState(true);



    useEffect(() => {
        if (data) {
            const x = createTree(data.tree, { id: null });
            const y = enterHanwriting(data.handwritings, x, data.tree)
            var tmp =[{level:'תקיית השורש', children: y}]
            setNodes(tmp);
            setLoading(false);
        }
    }, [data])

    return (
        props.userAuthorization == 2 ?
            <>
                {loading ? <div>louding - do something</div>
                    : <div className="card flex flex-wrap justify-content-center gap-5">
                        <Tree style={{ "direction": "ltr" }} value={nodes} filter filterMode="strict" filterPlaceholder="Strict Filter" className="w-full md:w-30rem" onNodeClick={(e) => {
                            !e.node.isNav && (props.setNavig(e.node.id));
                            !e.node.isNav && props.setVisible(true);
                            !e.node.isNav && props.setLabel(e.node?.label);
                            !e.node.isNav && props.setPath(showPath(e.node.id, data.tree));
                            !e.node.isNav && console.log("+++", showPath(e.node.id, data.tree));
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