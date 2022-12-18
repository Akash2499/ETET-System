import React from "react";
import './Home.css'

class Home extends React.Component {

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

  display = () => {
    return (
      <React.Fragment>
        <div className="row">
          <div className="col-md-6">
              <div className="jumbotron jumbotron-fluid">
                <div className="container">
                  <h1 className="display-4">Fluid jumbotron</h1>
                  <p className="lead">This is a modified jumbotron that occupies the entire horizontal space of its parent.</p>
                </div>
              </div>
            </div>
              <div className="col-md-6">
              {/* <form>
                <h1 className="login-form-h1">Login</h1>
                <div className="form-group">
                  <label for="useremail">Email address</label>
                  <input type="email" className="form-control" id="useremail" aria-describedby="emailHelp" placeholder="Enter email" onChange={this.handleInput} value={this.state.useremail}/>
                  <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                </div>
                <div className="form-group">
                  <label for="password">Password</label>
                  <input type="password" className="form-control" id="password" placeholder="Password" onChange={this.handleInput} value={this.state.password}/>
                </div>
                <button type="submit" className="btn btn-primary" onClick={this.login}>Login</button>
              </form>
              <span className="login-span"> <a href="/register"> Don't have an account ? Register here </a></span> */}
            </div>
        </div>
      </React.Fragment>
    )
  }

  render() {
      return this.display()
  }
}

export default Home;