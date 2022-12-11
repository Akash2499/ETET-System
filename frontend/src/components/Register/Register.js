import React from "react";
import './Register.css'

class Register extends React.Component {

  constructor() {
    super();
    this.state = { 
      firstName ="",
      lastName ="",
      dateOfBirth ="",
      email ="",
      password ="",
      budget = 100
    };
  }

  handleInput = (event) => {
    event.preventDefault()
    let state = this.state
    state[event.target.id] = event.target.value
    this.setState(state)
  }

  Register = (event) => {
    event.preventDefault()
  }

  display = () => {
    return (
      <React.Fragment>
        <div className="col-md-12">
            <form>
                <h1 className="login-form-h1">Register</h1>
                <div className="form-group">
                  <label for="email">Email address</label>
                  <input type="email" className="form-control" id="email" aria-describedby="emailHelp" placeholder="Enter email" onChange={this.handleInput} value={this.state.email}/>
                  <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                </div>
                <div className="form-group">
                  <label for="password">Password</label>
                  <input type="password" className="form-control" id="password" placeholder="password" onChange={this.handleInput} value={this.state.password}/>
                </div>
                <div className="form-group">
                  <label for="firstName">First Name</label>
                  <input type="text" className="form-control" id="firstName" placeholder="firstName" onChange={this.handleInput} value={this.state.firstName}/>
                </div>
                <div className="form-group">
                  <label for="lastName">Last Name</label>
                  <input type="text" className="form-control" id="lastName" placeholder="lastName" onChange={this.handleInput} value={this.state.lastName}/>
                </div>
                <div className="form-group">
                  <label for="dateOfBirthName">Date Of BirthName</label>
                  <input type="text" className="form-control" id="dateOfBirth" placeholder="dateOfBirth" onChange={this.handleInput} value={this.state.dateOfBirth}/>
                </div>
                <div className="form-group">
                  <label for="budget">Budget</label>
                  <input type="number" className="form-control" id="budget" placeholder="budget" onChange={this.handleInput} value={this.state.budget}/>
                </div>

                <button type="submit" className="btn btn-primary" onClick={this.Register}>Register</button>
            </form>
            <span className=""> <a href="/login"> Already Registered? Click here </a></span>
        </div>
      </React.Fragment>
    )
  }

  render() {
      return this.display()
  }
}

export default Register;