import React from "react";
import './Login.css'
import axios from "axios";

class Login extends React.Component {

  constructor() {
    super();
    this.backEndURL = 'http://localhost:4000'
    this.state = { 
        body : {
            useremail: "",
            password: ""
        },
        error : "",
        loading: false
    };
  }

  handleInput = (event) => {
    event.preventDefault()
    let state = this.state
    state.error = ""
    state.body[event.target.id] = event.target.value
    this.setState(state)
  }

  login = async (event) => {
    event.preventDefault()
    this.setState({loading : true})
    let url = this.backEndURL + "/users/validate"
    await axios.post(url, this.state.body)
    .then((data)=> {
      if(data.data.userId){
        this.setState({error : "", loading: false})
        sessionStorage.setItem("userId", data.data.userId)
        window.location.href = '/'
      } else {
        this.setState({loading : false , error : "Internal Server Error"})
      }
    })
    .catch((error)=>{
      let x = error.response.data.Error
      this.setState({loading : false, error : x})
    })
  }

  display = () => {
    return (
      <React.Fragment>
        <div className="col-md-12">
              <form>
                <h1 className="login-form-h1">Login</h1>
                <div className="form-group">
                  <label for="useremail">Email address</label>
                  <input type="email" className="form-control" id="useremail" aria-describedby="emailHelp" placeholder="Enter email" onChange={this.handleInput} value={this.state.body.useremail}/>
                  <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                </div>
                <div className="form-group">
                  <label for="password">Password</label>
                  <input type="password" className="form-control" id="password" placeholder="Password" onChange={this.handleInput} value={this.state.body.password}/>
                </div>
                <button type="submit" className="btn btn-primary btn-style" onClick={this.login}>
                    {
                        this.state.loading ?
                        <div class="spinner-border" role="status">
                        <span class="sr-only">Loading...</span>
                        </div> : "Login"
                    }
                </button>
              </form>
              <div className="set-error">
                {this.state.error}
              </div>
              <span className="login-span"> <a href="/register"> Don't have an account ? Register here </a></span>
        </div>
      </React.Fragment>
    )
  }

  render() {
      return this.display()
  }
}

export default Login;