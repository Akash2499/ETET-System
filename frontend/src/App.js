import logo from './logo.svg';
import React from 'react';
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { Routes as Switch, Route as Routing } from "react-router-dom";
import Home from "./components/Home/Home"
import Main from "./components/Main/Main"
import Register from './components/Register/Register';
import MyActivity from './components/MyActivity/MyActivity';
import AddTransaction from './components/AddTransaction/AddTransaction'
import AddGroup from './components/AddGroup/AddGroup';
import UpdateGroup from './components/UpdateGroup/UpdateGroup';
import UpdateTransaction from './components/UpdateTransaction/UpdateTransaction';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import Login from './components/Login/Login';
import PublicRoute from './components/PublicRoute/PublicRoute';

function App() {
  return (
    <BrowserRouter>
      <Main>
        <Switch>
          {/* Auth Routes */}
          <Routing exact path="/login" element={<PublicRoute/>}>
            <Routing exact path="/login" element={<Login/>} />
          </Routing>

          <Routing exact path="/register" element={<PublicRoute/>}>
            <Routing exact path="/register" element={<Register/>} />
          </Routing>

          <Routing exact path="/" element={<PrivateRoute/>}>
            <Routing exact path="/" element={<Home/>} />
          </Routing>

          <Routing exact path="/my-activities" element={<PrivateRoute/>}>
            <Routing exact path="/my-activities" element={<MyActivity/>} />
          </Routing>

          <Routing exact path="/add-transaction" element={<PrivateRoute/>}>
            <Routing exact path="/add-transaction" element={<AddTransaction/>} />
          </Routing>

          <Routing exact path="/add-group" element={<PrivateRoute/>}>
            <Routing exact path="/add-group" element={<AddGroup/>} />
          </Routing>

          <Routing exact path="/update-transaction" element={<PrivateRoute/>}>
            <Routing exact path="/update-transaction" element={<UpdateTransaction/>} />
          </Routing>

          <Routing exact path="/update-group" element={<PrivateRoute/>}>
            <Routing exact path="/update-group" element={<UpdateGroup/>} />
          </Routing>
        
        </Switch>
      </Main>
    </BrowserRouter>
  );
}

export default App;
