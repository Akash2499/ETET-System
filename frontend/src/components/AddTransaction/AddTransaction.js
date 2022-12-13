import React from "react";
import './AddTransaction.css'

class AddTransaction extends React.Component {

  constructor() {
    super();
    this.state = { 
        name : "",
        category : "",
        paidBy : "",
        groupId : "",
        comments : ""
    };
  }

  handleInput = (event) => {
    event.preventDefault()
    let state = this.state
    state[event.target.id] = event.target.value
    this.setState(state)
  }

  Transaction = (event) => {
    event.preventDefault()
  }

  display = () => {
    return (
      <React.Fragment>
        <div className="col-md-12">
            <form>
                <h1 className="login-form-h1">Transaction</h1>
                <div className="form-group">
                  <label for="name">Name</label>
                  <input type="text" className="form-control" id="name" aria-describedby="name" placeholder="Enter name" onChange={this.handleInput} value={this.state.name}/>
                </div>
                <div className="form-group">
                  <label for="category">Category</label>
                  <input type="text" className="form-control" id="category" placeholder="category" onChange={this.handleInput} value={this.state.category}/>
                </div>
                <div className="form-group">
                  <label for="paidBy">PaidBy</label>
                  <input type="text" className="form-control" id="paidBy" placeholder="paidBy" onChange={this.handleInput} value={this.state.paidBy}/>
                </div>
                <div className="form-group">
                  <label for="groupId">GroupId</label>
                  <input type="text" className="form-control" id="groupId" placeholder="groupId" onChange={this.handleInput} value={this.state.groupId}/>
                </div>
                <div className="form-group">
                  <label for="comments">Comments</label>
                  <input type="text" className="form-control" id="comments" placeholder="comments" onChange={this.handleInput} value={this.state.comments}/>
                </div>

                <button type="submit" className="btn btn-primary" onClick={this.Transaction}>Add Transaction</button>
            </form>
        </div>
      </React.Fragment>
    )
  }

  render() {
      return this.display()
  }
}

export default AddTransaction;