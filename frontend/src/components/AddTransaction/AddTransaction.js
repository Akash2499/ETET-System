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
        transactionMembers : [],
        loading : false,
        error : "",
        tabDefault: 0,
        selectedGroupName: [],
        allGroups : []
        
    };
  }

  componentWillMount = async () => {
    let url = window.location.href
    let userId = sessionStorage.getItem("userId")
    let u = this.backEndURL+"/users/"+userId
    let all = []
    let grp = []
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

      u = this.backEndURL+"/groups/"+gId
      all = []
      await axios.get(u)
      .then((d)=>{
        let obj = d.data.gorupObj.members
        this.setState({selectedGroupName : [d.data.gorupObj]})
        obj.map(async (m)=>{
          u = this.backEndURL+"/users/"+m.toString()
          await axios.get(u)
          .then((d)=>{
            let obj = d.data.userObj
            obj["name"] = obj.firstName+" "+obj.lastName
            all.push(obj)
          })
        })
      })
      this.setState({groupId : gId, transactionMembers : all, tabDefault: 1})
    } else {

      let loggedUser = all[0]
      loggedUser.friends.map(async (f)=>{
        u = this.backEndURL+"/users/"+f
        await axios.get(u)
          .then((d)=>{
            let obj = d.data.userObj
            obj["name"] = obj.firstName+" "+obj.lastName
            all.push(obj)
          })
      })

      loggedUser.groups.map(async (g) => {
        u = this.backEndURL+"/groups/"+g
        await axios.get(u)
          .then((d)=>{
            let obj = d.data.gorupObj
            grp.push(obj)
          })
      })

    }

    this.setState({allUser : all, allGroups : grp})
  }

  handleInput = (event) => {
    event.preventDefault()
    let state = this.state
    state[event.target.id] = event.target.value
    this.setState(state)
  }

  addTransaction = async (event) => {
    event.preventDefault()
    this.setState({loading : true})
    let name = this.state.name
    let category = this.state.selectedCategory[0].name
    let paidBy = this.state.selectedPaidByUser[0]._id.toString()
    let amount = this.state.amount
    let groupId = this.state.groupId
    let comments = [{
      commentedBy : sessionStorage.getItem("userId"),
      comment : this.state.comments
    }]
    let userIds = this.state.transactionMembers.map((t)=>{
      return {
        userId : t._id.toString(),
        amountOwed : -t.amountOwed
      }
    })
    let body = {
      name,
      category,
      paidBy,
      amount,
      groupId,
      comments,
      userIds
    }

    let url = this.backEndURL+"/transactions/addtransaction"
    await axios.post(url, body)
    .then((data)=>{
      if(data.data.inserted){
        this.setState({loading : false})
        window.location.href = "/my-activities"
      }
    })
    .catch((err)=>{
      this.setState({error : err , loading : false})
    })
  }

  onSelect = (value) => {
    this.setState({selectedCategory : value})
  }

  onRemove = (value) => {
    this.setState({selectedCategory: value})
  }

  onSelectPaidBy = (value) => {
    let x = this.state.transactionMembers
    let tmp = x.filter((t)=>t._id.toString()==value[0]._id.toString())
    if(tmp.length == 0)
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
    let tmp = x.filter((t)=>t._id.toString()==value[0]._id.toString())
    if(tmp.length == 0)
      x.push(...value)
    this.setState({selectedPaidToUser : value, transactionMembers : x})
  }

  onRemovePaidTo = (value) => {
    let x = this.state.transactionMembers
    x.push(...value)
    this.setState({selectedPaidToUser: value, transactionMembers : x})
  }

  onSelectSplitOption = (value) => {
    let split = value[0].name
    if(split=="Equally"){
      let transactionMembers = this.state.transactionMembers
      transactionMembers.map((t)=>{
        t.amountOwed = this.state.amount / transactionMembers.length
      })
      this.setState({transactionMembers : transactionMembers})
    }
    this.setState({selectedSplitOption: value})
  }

  onRemoveSplitOption = (value) => {
    this.setState({selectedSplitOption: value})
  }

  handleAmount = (event) => {
    event.preventDefault()
    let amount = event.target.value
    let transactionMembers = this.state.transactionMembers
    transactionMembers.map((t)=>{
      t.amountOwed = amount / transactionMembers.length
    })
    this.setState({transactionMembers : transactionMembers, amount : amount})
  }

  handleUnEqualAmount = (event) => {
    event.preventDefault()
    let id = event.target.id
    let amount = event.target.value
    let transactionMembers = this.state.transactionMembers
    transactionMembers.map((t)=>{
      if(t._id.toString()==id) t.amountOwed = amount
    })
    this.setState({transactionMembers : transactionMembers})
  }

  onSelectGroupOption = (value) => {
    this.setState({selectedGroupName : value})
  }

  onRemoveGroupOption = (value) => {
    this.setState({selectedGroupName: value})
  }


  display = () => {
    return (
      <React.Fragment>
        <Tabs selectedIndex={this.state.tabDefault} onSelect={(index) => this.setState({tabDefault : index})}>
          <TabList>
            <Tab>Add Transaction to Friend</Tab>
            <Tab>Add Transaction to Group</Tab>
          </TabList>

          <TabPanel>
            <h2>Friend</h2>
            <div className="col-md-12">
              <form>
                  <div className="form-group">
                    <label for="name">Transaction Name</label>
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
                    <input type="number" className="form-control" id="amount" placeholder="amount" onChange={this.handleAmount} value={this.state.amount}/>
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
                                  <input type="number" className="form-control" id={t._id.toString()} placeholder="amount" onChange={this.handleUnEqualAmount} value={t.amountOwed ? t.amountOwed : 0}/>
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

                  <button type="submit" className="btn btn-primary" onClick={this.addTransaction}>
                    {
                        this.state.loading ?
                        <div class="spinner-border" role="status">
                        <span class="sr-only">Loading...</span>
                        </div> : "Add Transaction"
                    }
                  </button>
                  <div className="set-error">
                    {this.state.error}
                  </div>
              </form>
          </div>
          </TabPanel>
          <TabPanel>
            <h2>Group</h2>
            <div className="col-md-12">
              <form>
                  <div className="form-group">
                    <label for="name">Transaction Name</label>
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
                    <label for="split">Select Group</label>
                    <Multiselect
                        options={this.state.allGroups}
                        selectedValues={this.state.selectedGroupName}
                        onSelect={this.onSelectGroupOption}
                        onRemove={this.onRemoveGroupOption}
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
                    <label for="amount">Amount</label>
                    <input type="number" className="form-control" id="amount" placeholder="amount" onChange={this.handleAmount} value={this.state.amount}/>
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
                                  <input type="number" className="form-control" id={t._id.toString()} placeholder="amount" onChange={this.handleUnEqualAmount} value={t.amountOwed ? t.amountOwed : 0}/>
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

                  <button type="submit" className="btn btn-primary" onClick={this.addTransaction}>
                    {
                        this.state.loading ?
                        <div class="spinner-border" role="status">
                        <span class="sr-only">Loading...</span>
                        </div> : "Add Transaction"
                    }
                  </button>
                  <div className="set-error">
                    {this.state.error}
                  </div>
              </form>
          </div>
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