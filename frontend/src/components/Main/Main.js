import React from "react";
import Navbar from "../Nabvar/Navbar";

const Main =(props)=> {
    return (      
      <>
        <Navbar/>
        <div className="row">
          <div className="col-md-1">{}</div>
          <div className="col-md-10">{props.children}</div>
          <div className="col-md-1"></div>
        </div>
      </>
    );
  }


export default Main;