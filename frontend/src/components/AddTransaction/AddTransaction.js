import React from "react";
import './AddTransaction.css'
import Multiselect from 'multiselect-react-dropdown';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import axios from "axios";

class AddTransaction extends React.Component {

  constructor() {
    super();
    this.backEndURL = 'http://localhost:4000'
    this.state = { 
        name : "",
        category : "",
        paidBy : "",
        groupId : "",
        comments : "",
        amount : 0,
        selectedCategory : [],
        allCategory : [
          { name: "Food" },
          { name: "Travel" } ,
          { name: "Shopping"}
        ],
        selectedPaidByUser : [],
        selectedPaidToUser : [],
        allUser : [],
        splitOption : [
          {name: "Equally"},
          {name: "Unequally"}
        ],
        selectedSplitOption : [],
        transactionMembers : []
        
    };
  }

  componentWillMount = async () => {
    let url = window.location.href
    let userId = sessionStorage.getItem("userId")
    let u = this.backEndURL+"/users/"+userId
    let all = []
    await axios.get(u)
    .then((d)=>{
      let obj = d.data.userObj
      obj["name"] = obj.firstName+" "+obj.lastName
      all.push(obj)
    })
    
    let uId = "", gId = ""
    if(url.includes("userId=")){
      
      uId = url.split("userId=")[1]
      u = this.backEndURL+"/users/"+uId
      await axios.get(u)
      .then((d)=>{
        let obj = d.data.userObj
        obj["name"] = obj.firstName+" "+obj.lastName
        all.push(obj)
      })

    } else if(url.includes("groupId=")){
      gId = url.split("groupId=")[1]
    }

    this.setState({allUser : all})
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

  onSelect = (value) => {
    this.setState({selectedCategory : value})
  }

  onRemove = (value) => {
    this.setState({selectedCategory: value})
  }

  onSelectPaidBy = (value) => {
    let x = this.state.transactionMembers
    x.push(...value)
    this.setState({selectedPaidByUser : value, transactionMembers : x})
  }

  onRemovePaidBy = (value) => {
    let x = this.state.transactionMembers
    x.push(...value)
    this.setState({selectedPaidByUser: value, transactionMembers : x})
  }

  onSelectPaidTo = (value) => {
    let x = this.state.transactionMembers
    x.push(...value)
    this.setState({selectedPaidToUser : value, transactionMembers : x})
  }

  onRemovePaidTo = (value) => {
    let x = this.state.transactionMembers
    x.push(...value)
    this.setState({selectedPaidToUser: value, transactionMembers : x})
  }

  onSelectSplitOption = (value) => {
    this.setState({selectedSplitOption: value})
  }

  onRemoveSplitOption = (value) => {
    this.setState({selectedSplitOption: value})
  }


  display = () => {
    return (
      <React.Fragment>
        <Tabs>
          <TabList>
            <Tab>Add Transaction to Friend</Tab>
            <Tab>Add Transaction to Group</Tab>
          </TabList>

          <TabPanel>
            <h2>Friend</h2>
            <div className="col-md-12">
              <form>
                  <div className="form-group">
                    <label for="name">Name</label>
                    <input type="text" className="form-control" id="name" aria-describedby="name" placeholder="Enter name" onChange={this.handleInput} value={this.state.name}/>
                  </div>
                  <div className="form-group">
                    <label for="category">Category</label>
                      <Multiselect
                        options={this.state.allCategory}
                        selectedValues={this.state.selectedCategory}
                        onSelect={this.onSelect}
                        onRemove={this.onRemove}
                        singleSelect={true}
                        displayValue="name"
                      />
                  </div>
                  <div className="form-group">
                    <label for="paidBy">PaidBy</label>
                    <Multiselect
                        options={this.state.allUser}
                        selectedValues={this.state.selectedPaidByUser}
                        onSelect={this.onSelectPaidBy}
                        onRemove={this.onRemovePaidBy}
                        singleSelect={true}
                        displayValue="name"
                      />
                  </div>
                  <div className="form-group">
                    <label for="paidTo">PaidTo</label>
                    <Multiselect
                        options={this.state.allUser}
                        selectedValues={this.state.selectedPaidToUser}
                        onSelect={this.onSelectPaidTo}
                        onRemove={this.onRemovePaidTo}
                        singleSelect={true}
                        displayValue="name"
                      />
                  </div>
                  <div className="form-group">
                    <label for="amount">Amount</label>
                    <input type="number" className="form-control" id="amount" placeholder="amount" onChange={this.handleInput} value={this.state.amount}/>
                  </div>
                  <div className="form-group">
                    <label for="split">Split</label>
                    <Multiselect
                        options={this.state.splitOption}
                        selectedValues={this.state.selectedSplitOption}
                        onSelect={this.onSelectSplitOption}
                        onRemove={this.onRemoveSplitOption}
                        singleSelect={true}
                        displayValue="name"
                      />
                  </div>
                  {
                    this.state.selectedSplitOption.length > 0 && this.state.selectedSplitOption[0].name == "Unequally" ?
                    <table className="table table-boardered">
                      <tbody>
                        {
                          this.state.transactionMembers.map((t)=>{
                            return <tr>
                              <td>{t.name}</td>
                              <td>
                                <div className="form-group">
                                  <input type="number" className="form-control" id="amount" placeholder="amount" onChange={this.handleInput} value={this.state.amount}/>
                                </div>
                              </td>
                            </tr>
                          })
                        }
                      </tbody>
                    </table>
                    : ""
                  }
                  <div className="form-group">
                    <label for="comments">Comments</label>
                    <input type="text" className="form-control" id="comments" placeholder="comments" onChange={this.handleInput} value={this.state.comments}/>
                  </div>

                  <button type="submit" className="btn btn-primary" onClick={this.Transaction}>Add Transaction</button>
              </form>
          </div>
          </TabPanel>
          <TabPanel>
            <h2>Group</h2>
          </TabPanel>
        </Tabs>
      </React.Fragment>
    )
  }

  render() {
      return this.display()
  }
}

export default AddTransaction;