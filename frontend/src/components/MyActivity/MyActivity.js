import React from "react";
import './MyActivity.css'

class MyActivity extends React.Component {

  constructor() {
    super();
    this.state = { 
      useremail: "",
      password: ""
    };
  }

  handleInput = (event) => {
    event.preventDefault()
    let state = this.state
    state[event.target.id] = event.target.value
    this.setState(state)
  }

  login = (event) => {
    event.preventDefault()
  }

  display = () => {
    return (
      <React.Fragment>
        <div className="row">
          <div className="col-md-4">
            <h1>Total expenses by category</h1>
          </div>
          <div className="col-md-4">
            <h1>Total expenses by month</h1>
          </div>
          <div className="col-md-4">
            <h1>Total expenses by Group</h1>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <h1>Group activity</h1>
          </div>
        </div>
        <div className="row">
            <div className="col-md-12">
                <h1>Last few transactions</h1>
            </div>
        </div>
      </React.Fragment>
    )
  }

  render() {
      return this.display()
  }
}

export default MyActivity;