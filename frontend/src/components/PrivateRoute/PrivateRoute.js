import React from "react";
import './PrivateRoute.css'
import { Navigate, Outlet } from "react-router-dom";

class PrivateRoute extends React.Component {

  constructor() {
    super();
    this.state = {
        render : true
    }
  }

  componentWillMount = () => {
    if(sessionStorage.getItem("userId")){
        this.setState({render : true})
    } else {
        this.setState({render : false})
    }
  }

  render() {
      return this.state.render ? <Outlet/> : <Navigate to='/login'/>
  }
}

export default PrivateRoute;