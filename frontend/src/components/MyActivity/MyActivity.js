import React from "react";
import './MyActivity.css'
import axios from "axios";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class MyActivity extends React.Component {

  constructor() {
    super();
    this.backendUrl = 'http://localhost:4000'
    this.months = {
      1 : "Jan",
      2 : "Feb",
      3 : "Mar",
      4 : "Apr",
      5 : "May",
      6 : "Jun",
      7 : "Jul",
      8 : "Aug",
      9 : "Sep",
      10 : "Oct",
      11 : "Nov",
      12 : "Dec"
    }
    this.state = { 
      useremail: "",
      password: "",
      allT : [],
      allCategory : [
        "Food" ,
        "Travel" ,
        "Shopping"
      ],
      transactionByCategory : [],
      transactionByMonth : [],
      transactionByGroups : [],
      showTransactions : [],
      modalPaidBy : "",
      modalAmount : 0,
      open: false,
      loading: false
    };
  }

  componentWillMount = async () => {

    ChartJS.register(ArcElement, Tooltip, Legend);

    let userId = sessionStorage.getItem("userId")
    let url = this.backendUrl+"/users/"+userId
    let allT = []
    let myGroups = []
    await axios.get(url)
    .then(async (data)=>{
      let user = data.data.userObj
      let allTransactions = user.transactions
      myGroups = user.groups
      for(let i=0;i<allTransactions.length;i++){
        let t = allTransactions[i]
        url = this.backendUrl+"/transactions/"+t.toString()
        await axios.get(url)
        .then((d)=>{
          let tObj = d.data.transactionObj
          allT.push(tObj)
        })
      }
    })

    let clabel = [] , cData = [], cColor = []
    this.state.allCategory.map((c)=>{
      let x = allT.filter((t)=>t.category==c)
      let count = 0
      x.map((t)=>{
        let p = t.userIds.filter((tmp)=>tmp.userId.toString()==userId)
        count += Math.abs(p[0].amountOwed)
      })
      clabel.push(c)
      cData.push(count)
      cColor.push(`rgba(${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)},0.4)`)
    })

    let cDataset = {
      labels: clabel,
      datasets : [{
        data: cData,
        backgroundColor: cColor
      }]
    }
    
    let mlabel = [], mData = [], mColor = []
    for(let i=1;i<=12;i++){
      let x = allT.filter((t)=>{
        return Number(t.transactionDate.split("/")[0]) == i
      })
      let count = 0
      x.map((t)=>{
        let p = t.userIds.filter((tmp)=>tmp.userId.toString()==userId)
        count += Math.abs(p[0].amountOwed)
      })
      mlabel.push(this.months[i])
      mData.push(count)
      mColor.push(`rgba(${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)},0.4)`)
    }

    let mDataset = {
      labels: mlabel,
      datasets : [{
        data: mData,
        backgroundColor: mColor
      }]
    }

    let glabel = [], gData = [], gColor = []
    for(let i=0;i<myGroups.length;i++){
      let g = myGroups[i]
      let x = allT.filter((t)=>{
        return t.groupId.toString() == g.toString()
      })
      let count = 0
      x.map((t)=>{
        let p = t.userIds.filter((tmp)=>tmp.userId.toString()==userId)
        count += Math.abs(p[0].amountOwed)
      })

      let gName = ""
      let url = this.backendUrl+"/groups/"+g.toString()
      await axios.get(url)
      .then((d)=>{
        console.log(d)
        let grp = d.data.gorupObj
        gName = grp.name
      })
      glabel.push(gName)
      gData.push(count)
      gColor.push(`rgba(${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)},0.4)`)
    }

    let gDataset = {
      labels: glabel,
      datasets : [{
        data: gData,
        backgroundColor: gColor
      }]
    }

    console.log(gDataset)

    this.setState({allT : allT, transactionByCategory : cDataset, transactionByMonth : mDataset, transactionByGroups : gDataset})
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

  getUserAmount = (t) => {
    let paidBy = t.paidBy
    let userId = sessionStorage.getItem("userId")
    let f = t.userIds.filter((f)=>f.userId.toString()==userId)
    if(paidBy.toString()==userId.toString()) return Number(t.amount) + f[0].amountOwed
    return Number(f[0].amountOwed)
  }

  payNow = async (event) => {
    event.preventDefault()
    this.setState({loading: true})
    let id = event.target.id
    let tObj = JSON.parse(id)
    tObj.userIds.map((user)=>{
      if(user.userId.toString()==sessionStorage.getItem("userId").toString()){
        user.paid = true
      }
    })
    let url = this.backendUrl+"/transactions/edittransaction/"+tObj._id.toString()
    await axios.put(url, tObj)
    .then((data)=>{
      if(data.data.modified){
        this.setState({loading :  false})
        window.location.reload()
      }
    })
    this.setState({loading: false})
  }

  amountClicked = async (event) => {
    event.preventDefault()
    let id = event.target.id
    let data = JSON.parse(id)
    let userIds = data.userIds
    let ans = []
    for(let i=0;i<userIds.length;i++)
    {
      let d = userIds[i]
      let url = this.backendUrl+"/users/"+d.userId.toString()
      await axios.get(url)
      .then((x)=>{
        let tmp = x.data.userObj
        ans.push({
          amountOwed: Math.abs(d.amountOwed),
          userName : tmp.firstName+" "+tmp.lastName
        })
      })
    }

    let url = this.backendUrl+"/users/"+data.paidBy.toString()
    await axios.get(url)
    .then((d)=>{
      let tmp = d.data.userObj
      this.setState({modalPaidBy: tmp.firstName+" "+tmp.lastName})
    })
    this.setState({modalAmount: data.amount, showTransactions : ans})
    this.toggle()
  }

  toggle = () => {
    this.setState({open : !this.state.open})
  }

  alreadyPaid = (t) => {
    let paidBy = t.paidBy
    let userId = sessionStorage.getItem("userId")
    let f = t.userIds.filter((f)=>f.userId.toString()==userId)
    return f[0].paid ? f[0].paid : false
  } 

  display = () => {
    return (
      <React.Fragment>
        <div className="row">
          <div className="col-md-4">
            <h3>Total expenses by category</h3>
            {
              this.state.transactionByCategory.length == 0 ? "" :
              <Pie className="chart changeCursor" data={this.state.transactionByCategory}/>
            }
          </div>
          <div className="col-md-4">
            <h3>Total expenses by month</h3>
            {
              this.state.transactionByMonth.length == 0 ? "" :
              <Pie className="chart changeCursor" data={this.state.transactionByMonth}/>
            }
          </div>
          <div className="col-md-4">
            <h3>Total expenses by Group</h3>
            {
              this.state.transactionByGroups.length == 0 ? "" :
              <Pie className="chart changeCursor" data={this.state.transactionByGroups}/>
            }
          </div>
        </div>
        <br></br><br></br>
        <div className="row">
            <div className="col-md-12">
                <h3>Last few transactions</h3>
                {
                  this.state.allT.length == 0 ? "No Transactions Found !" :
                  <table className="table table-boardered">
                    <thead>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Category</th>
                      <th>isGroupTransaction ?</th>
                      <th>Total Amount</th>
                      <th>Your share</th>
                      <th></th>
                    </thead>
                    <tbody>
                      {
                        this.state.allT.map((t)=>{
                          return <tr>
                            <td>{t._id.toString()}</td>
                            <td>{t.name}</td>
                            <td>{t.category}</td>
                            <td>{t.groupId != "" ? "Yes" : "No"}</td>
                            <td className="link" id={JSON.stringify(t)} onClick={this.amountClicked}>{t.amount}</td>
                            <td className={this.getUserAmount(t) < 0 ? "red" : "green"}><b className={this.alreadyPaid(t) ? "strikethrough" : ""}>{this.getUserAmount(t)}</b></td>
                            <td>{this.getUserAmount(t) > 0 ? "" :
                            this.alreadyPaid(t) ? <b className="green">Paid</b>:
                            <button className="btn btn-success" id={JSON.stringify(t)} onClick={this.payNow}>Pay Now</button>
                            }</td>
                          </tr>
                        })
                      }
                    </tbody>
                  </table>
                }
            </div>
        </div>
        <Modal isOpen={this.state.open} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Transaction Summary</ModalHeader>
          <ModalBody>
            <h3> Paid By {this.state.modalPaidBy} : <b className="green">{this.state.modalAmount}</b></h3>
            <table className="table table-bordered">
              <thead>
                <th>Name</th>
                <th>Amount</th>
              </thead>
              <tbody>
                {
                  this.state.showTransactions.map((n)=>{
                    return <tr>
                      <td>{n.userName}</td>
                      <td className="red">{n.amountOwed}</td>
                    </tr>
                  })
                }
              </tbody>
            </table>
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-danger" color="secondary" onClick={this.toggle}>Cancel</button>
          </ModalFooter>
        </Modal>
      </React.Fragment>
    )
  }

  render() {
      return this.display()
  }
}

export default MyActivity;