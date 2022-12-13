import React from "react";
import './PublicRoute.css'
import { Navigate, Outlet } from "react-router-dom";

class PublicRoute extends React.Component {

  constructor() {
    super();
    this.state = {
        render : true
    }
  }

  componentWillMount = () => {
    if(sessionStorage.getItem("useremail")){
        this.setState({render : false})
    } else {
        this.setState({render : true})
    }
  }

  render() {
      return this.state.render ? <Outlet/> : <Navigate to='/'/>
  }
}

export default PublicRoute;