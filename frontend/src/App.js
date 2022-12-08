import logo from './logo.svg';
import React from 'react';
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { Routes as Switch, Route as Routing } from "react-router-dom";
import Home from "./components/Home/Home"
import Main from "./components/Main/Main"

function App() {
  return (
    <BrowserRouter>
      <Main>
        <Switch>
          {/* Auth Routes */}
          <Routing exact path="/" element={<Home/>} />
        </Switch>
      </Main>
    </BrowserRouter>
  );
}

export default App;
