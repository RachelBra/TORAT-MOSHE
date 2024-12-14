import React, { useState, useEffect } from 'react';
import { Tree } from 'primereact/tree';
import { enterHanwriting, createTree } from '../Services/functions';
import { useNavigate } from 'react-router-dom';
import { ProgressSpinner } from 'primereact/progressspinner';
import 'primeflex/primeflex.css';
import '../App.css';
import axios from 'axios';

export default function TreeManager() {

 
    return (
        <>
          <Tree manager = {true}></Tree>
        </>
    )
}
