import logo from './logo.svg';
import React from 'react';
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { Routes as Switch, Route as Routing } from "react-router-dom";
import Home from "./components/Home/Home"
import Main from "./components/Main/Main"
import Register from './components/Register/Register';
import MyActivity from './components/MyActivity/MyActivity';

function App() {
  return (
    <BrowserRouter>
      <Main>
        <Switch>
          {/* Auth Routes */}
          <Routing exact path="/" element={<Home/>} />
          <Routing exact path="/login" element={<Home/>} />
          <Routing exact path="/register" element={<Register/>} />
          <Routing exact path="/my-activities" element={<MyActivity/>} />
        </Switch>
      </Main>
    </BrowserRouter>
  );
}

export default App;
