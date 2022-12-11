import React from "react";
import './Group.css'

class UpdateGroup extends React.Component {

  constructor() {
    super();
    this.state = { 
        members ="",
        name ="",
        transactions =""
    };
  }

  handleInput = (event) => {
    event.preventDefault()
    let state = this.state
    state[event.target.id] = event.target.value
    this.setState(state)
  }

  UpdateGroup = (event) => {
    event.preventDefault()
  }

  display = () => {
    return (
      <React.Fragment>
        <div className="col-md-12">
            <form>
                <h1 className="login-form-h1">Group</h1>
                <div className="form-group">
                  <label for="members">Members</label>
                  <input type="text" className="form-control" id="members" aria-describedby="members" placeholder="members" onChange={this.handleInput} value={this.state.members}/>
                </div>
                <div className="form-group">
                  <label for="name">Name</label>
                  <input type="text" className="form-control" id="name" placeholder="name" onChange={this.handleInput} value={this.state.name}/>
                </div>
                <div className="form-group">
                  <label for="transactions">Transactions</label>
                  <input type="text" className="form-control" id="transactions" placeholder="transactions" onChange={this.handleInput} value={this.state.transactions}/>
                </div>

                <button type="submit" className="btn btn-primary" onClick={this.UpdateGroup}>Update Group</button>
            </form>
        </div>
      </React.Fragment>
    )
  }

  render() {
      return this.display()
  }
}

export default UpdateGroup;