import React from "react";
import './Register.css'
import DatePicker from "react-datepicker";
import axios from "axios";

class Register extends React.Component {

  constructor() {
    super();
    this.backEndURL = 'http://localhost:4000'
    this.state = { 
      body : {
        firstName : "",
        lastName : "",
        dateOfBirth : "",
        email : "",
        password :"",
        budget : 100
      },
      date : "",
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

  convertDate = (date) => {
    let d = new Date(date)
    let day = d.getDate()
    day = day < 10 ? '0' + day : day
    let month = d.getMonth()
    month = month < 10 ? '0' + month : month
    let year = d.getFullYear()
    let fdate = month+"/"+day+"/"+year
    return fdate
  }

  handleDate = (inputDate) => {
    this.state.date = inputDate
    this.state.body.dateOfBirth = this.convertDate(inputDate)
    this.setState(this.state)
  }

  registerUser = async (event) => {
    event.preventDefault()
    this.setState({loading : true})
    let url = this.backEndURL + "/users/register"
    await axios.post(url, this.state.body)
    .then((data)=> {
      if(data.data.registered){
        this.setState({error : "", loading: true})
        window.location.href = '/login'
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
                <h1 className="login-form-h1">Register</h1>
                <div className="form-group">
                  <label for="email">Email address</label>
                  <input type="email" className="form-control" id="email" aria-describedby="emailHelp" placeholder="Enter email" onChange={this.handleInput} value={this.state.body.email}/>
                  <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                </div>
                <div className="form-group">
                  <label for="password">Password</label>
                  <input type="password" className="form-control" id="password" placeholder="password" onChange={this.handleInput} value={this.state.body.password}/>
                </div>
                <div className="form-group">
                  <label for="firstName">First Name</label>
                  <input type="text" className="form-control" id="firstName" placeholder="firstName" onChange={this.handleInput} value={this.state.body.firstName}/>
                </div>
                <div className="form-group">
                  <label for="lastName">Last Name</label>
                  <input type="text" className="form-control" id="lastName" placeholder="lastName" onChange={this.handleInput} value={this.state.body.lastName}/>
                </div>
                <div className="form-group">
                  <label for="dateOfBirthName">Date Of BirthName</label>
                  <DatePicker selected={this.state.date} onChange={this.handleDate} />
                </div>
                <div className="form-group">
                  <label for="budget">Budget</label>
                  <input type="number" className="form-control" id="budget" placeholder="budget" onChange={this.handleInput} value={this.state.body.budget}/>
                </div>

                <button type="button" className="btn btn-primary btn-style" onClick={this.registerUser}>
                  {
                    this.state.loading ?
                    <div class="spinner-border" role="status">
                      <span class="sr-only">Loading...</span>
                    </div> : "Register"
                  }
                </button>
            </form>
            <div className="set-error">{this.state.error}</div>
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