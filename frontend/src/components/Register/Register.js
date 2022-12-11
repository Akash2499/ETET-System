import React from "react";
import './Register.css'

class Register extends React.Component {

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
        <div className="col-md-12">
            <form>
                <h1 className="login-form-h1">Register</h1>
                <div className="form-group">
                  <label for="useremail">Email address</label>
                  <input type="email" className="form-control" id="useremail" aria-describedby="emailHelp" placeholder="Enter email" onChange={this.handleInput} value={this.state.useremail}/>
                  <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                </div>
                <div className="form-group">
                  <label for="password">Password</label>
                  <input type="password" className="form-control" id="password" placeholder="Password" onChange={this.handleInput} value={this.state.password}/>
                </div>
                <button type="submit" className="btn btn-primary" onClick={this.login}>Register</button>
            </form>
            <span className=""> <a href="/register"> Don't have an account ? Register here </a></span>
        </div>
      </React.Fragment>
    )
  }

  render() {
      return this.display()
  }
}

export default Register;