import React from "react";
import './UpdateUser.css';

class UpdateUser extends React.Component {

  constructor() {
    super();
    this.state = { 
      firstName ="",
      lastName ="",
      dateOfBirth ="",
      budget =""
    };
  }

  handleInput = (event) => {
    event.preventDefault()
    let state = this.state
    state[event.target.id] = event.target.value
    this.setState(state)
  }

  UpdateUser = (event) => {
    event.preventDefault()
  }

  display = () => {
    return (
      <React.Fragment>
        <div className="col-md-12">
            <form>
                <h1 className="login-form-h1">Register</h1>
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

                <button type="submit" className="btn btn-primary" onClick={this.UpdateUser}>Update User</button>
            </form>
        </div>
      </React.Fragment>
    )
  }

  render() {
      return this.display()
  }
}

export default UpdateUser;