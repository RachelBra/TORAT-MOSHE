import './App.css';
//theme
import "primereact/resources/themes/lara-light-indigo/theme.css";

//core
import "primereact/resources/primereact.min.css";
//icons
import "primeicons/primeicons.css";
// css utility        
import 'primeflex/primeflex.css';

import 'primeicons/primeicons.css';

import Home from './Components/Home';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import LogIn from './Components/logIn/LogIn';
import Register from './Components/logIn/Register';
import Contact from './Components/Contact';
import Tree from './Components/Tree';
import Handwriting from './Components/showHandwriting/Handwriting';
import Books from './Components/Books';
import ManagerToolbar from './Components/manager/ManagerToolbar';
import RePassword1 from './Components/logIn/RePassword1';
import RePassword2 from './Components/logIn/RePassword2';
import RePassword3 from './Components/logIn/RePassword3';
import UsersDetails from './Components/manager/UsersDetails';
import EmailToUser from './Components/manager/EmailToUser';
import EmailToAllUsers from './Components/manager/EmailToAllUsers';
import Approvals from './Components/manager/Approvals';
import HandwritingManagerCorrection from './Components/manager/HandwritingManagerCorrection';
import HandwritingManagerPeirushim from './Components/manager/HandwritingManagerPeirushim';
import UserProvider from "./Components/user/UserProvider";
import Toolbar from './Components/Toolbar'
import React, { useState, useEffect } from "react";
import AddHandwriting from './Components/manager/AddHandwriting';
import AddFolder from './Components/manager/AddFolder';
import DeleteFolder from './Components/manager/DeleteFolder';
import AddBook from './Components/manager/AddBook';
import ChangeTree from './Components/manager/ChangeTree';
// import Transcption from './Components/showHandwriting/Transcption';
import backgroundHome from './assets/imges/backgroundHomeToratMoshe.png'
import background from './assets/imges/backgroundToratMoshe.png'

// Create a separate component for the routes that can use hooks
function AppRoutes({ userId, userAuthorization, userEmail, setUserIdCallback, help, setHelp }) {
  const location = useLocation();

  const backgroundImage = location.pathname === '/' 
    ? `url(${backgroundHome})` 
    : `url(${background})`;

  const containerStyle = {
    backgroundImage,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    width: '100vw',
    height: '100vh',
    minHeight: '100vh'
  };

  return (
    <div style={containerStyle}>
      {userId === '' ? 
        <header><Toolbar set={setUserIdCallback} setHelp={setHelp}></Toolbar></header> : 
        userAuthorization <= 1 ? 
          <header><Toolbar set={setUserIdCallback} setHelp={setHelp} ></Toolbar></header> : 
          <header><ManagerToolbar set={setUserIdCallback} setHelp={setHelp}></ManagerToolbar></header>
      }
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/LogIn' element={<LogIn set={setUserIdCallback} />} />
        <Route path='/Register' element={<Register />} />
        <Route path='/Contact' element={<Contact userId={userId} />} />
        <Route path='/Tree' element={<Tree help={help} />} />
        <Route path='/Tree/Handwriting/:id' element={<Handwriting />} />
        <Route path='/AddHandwriting/Handwriting/:id' element={<Handwriting />} />
        <Route path='/Books' element={<Books />} />
        <Route path='/RePassword1' element={<RePassword1 set={setUserIdCallback} />} />
        <Route path='/RePassword2' element={<RePassword2 userEmail={userEmail} />} />
        <Route path='/RePassword3' element={<RePassword3 userEmail={userEmail} />} />
        <Route path='/UsersDetails' element={<UsersDetails userAuthorization={userAuthorization} />} />
        <Route path='/Approvals/:flag' element={<Approvals userAuthorization={userAuthorization} />} />
        <Route path='/ChangeTree' element={<ChangeTree userAuthorization={userAuthorization} />} />
        <Route path='/HandwritingManagerCorrection/:id' element={<HandwritingManagerCorrection userAuthorization={userAuthorization} />} />
        <Route path='/HandwritingManagerPeirushim/:id' element={<HandwritingManagerPeirushim userAuthorization={userAuthorization} />} />
        <Route path='/UsersDetails/EmailToUser/:id' element={<EmailToUser userAuthorization={userAuthorization} />} />
        <Route path='/EmailToAllUsers/:id' element={<EmailToAllUsers userAuthorization={userAuthorization} />} />
        <Route path='/AddHandwriting' element={<AddHandwriting userAuthorization={userAuthorization} />} />
        <Route path='/AddFolder' element={<AddFolder userAuthorization={userAuthorization} />} />
        <Route path='/AddBook' element={<AddBook userAuthorization={userAuthorization} />} />
        <Route path='/DeleteFolder' element={<DeleteFolder userAuthorization={userAuthorization} />} />
        <Route path='/AddHandwriting/Handwriting/:id/:corrections' element={<Handwriting />} />
        <Route path='*' element={<h1> 404 Page not found <br></br>  ולמרות הכל- תני חיוך😁😂</h1>} />
      </Routes>
    </div>
  );
}

function App() {
  const [userId, setUserId] = useState('');
  const [userAuthorization, setUserAuthorization] = useState(1);
  const [userEmail, setUserEmail] = useState("");
  const [help, setHelp] = useState(1);

  const setUserIdCallback = (id, authorization, email) => {
    setUserId(id);
    setUserAuthorization(authorization)
    setUserEmail(email)
  }

  useEffect(() => {
    //check token
    const userFromLocalStorage = localStorage.getItem("user")
    if (!userFromLocalStorage) return;
    const parsedUser = JSON.parse(userFromLocalStorage)
    setUserId(parsedUser.user_id)
    setUserAuthorization(parsedUser.authorization)
  }, [])

  return (
    <UserProvider userId={userId} userAuthorization={userAuthorization}>
      <Router>
        <AppRoutes 
          userId={userId} 
          userAuthorization={userAuthorization} 
          userEmail={userEmail} 
          setUserIdCallback={setUserIdCallback}
          help={help}
          setHelp={setHelp}
        />
      </Router>
    </UserProvider>
  );
}

export default App;