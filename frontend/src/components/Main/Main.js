import React from "react";
import './Main.css';
import Navbar from "../Nabvar/Navbar";

const Main =(props)=> {
    return (      
      <>
        <Navbar/>
        <div className="row col-md-12">
          <div className="col-md-1">{}</div>
          <div className="col-md-10 main-css">{props.children}</div>
          <div className="col-md-1"></div>
        </div>
      </>
    );
  }


export default Main;