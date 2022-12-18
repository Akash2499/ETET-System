import React from "react";
import './Home.css'
import axios from "axios";
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class Home extends React.Component {

  constructor() {
    super();
    this.backendUrl = 'http://localhost:4000'
    this.state = { 
      useremail: "",
      password: "",
      owned : 0,
      own : 0,
      open : false,
      notify : false,
      resOwe : [],
      resOwned : []
    };
  }

  componentWillMount = async () => {
    let userId = sessionStorage.getItem("userId")
    let url = this.backendUrl+"/users/"+userId

    let owe = 0
    let owned = 0
    let oweD = {}
    let ownedD = {}

    await axios.get(url)
    .then(async (data)=>{
      let usr = data.data.userObj
      let tId = usr.transactions
      for(let i=0;i<tId.length;i++) {
        let tt = tId[i]
        url = this.backendUrl+"/transactions/"+tt
        await axios.get(url)
        .then((d)=>{
          let t = d.data.transactionObj
          if(t.paidBy.toString()==userId.toString()) {
            t.userIds.map((u)=>{
              if(u.userId!=userId.toString()){
                ownedD[u.userId] = (ownedD[u.userId] ? ownedD[u.userId] : 0) + Math.abs(u.amountOwed)
                owned += Math.abs(u.amountOwed)
              }
            })
          } else {
            t.userIds.map((u)=>{
              if(u.userId == userId.toString()){
                oweD[u.userId] = (oweD[u.userId] ? oweD[u.userId] : 0) + Math.abs(u.amountOwed)
                owe += Math.abs(u.amountOwed)
              }
            })
          }
        })
      }
    })

    let res1 = []
    let res2 = []

    for(let i=0;i<Object.keys(oweD).length;i++) {
      let k = Object.keys(oweD)[i]
      let url = this.backendUrl+"/users/"+k
      await axios.get(url)
      .then((d)=>{
        let usr = d.data.userObj
        res1.push({
          name: usr.firstName+" "+usr.lastName,
          email: usr.username,
          id: k,
          amount: oweD[k]
        })
      })
    }

    for(let i=0;i<Object.keys(ownedD).length;i++) {
      let k = Object.keys(ownedD)[i]
      let url = this.backendUrl+"/users/"+k
      await axios.get(url)
      .then((d)=>{
        let usr = d.data.userObj
        res2.push({
          name: usr.firstName+" "+usr.lastName,
          email: usr.username,
          id: k,
          amount: ownedD[k]
        })
      })
    }

    this.setState({owe : -owe , owned : owned, resOwe : res1 , resOwned : res2})
  }

  handleInput = (event) => {
    event.preventDefault()
    let state = this.state
    state[event.target.id] = event.target.value
    this.setState(state)
  }

  toggle = () => {
    this.setState({open : !this.state.open})
  }

  remind = (event) => {
    event.preventDefault()
    this.toggle()
    this.setState({notify : true})
  }

  settleUp = (event) => {
    event.preventDefault()
    this.toggle()
    this.setState({notify : false})
  }

  sendNotification = (event) => {
    event.preventDefault()
  }

  settle = (event) => {
    event.preventDefault()
  }

  display = () => {
    return (
      <React.Fragment>
        <div className="row">
          <div className="col-md-6">
            <div className="card card-size-green">
              <div className="card-body owned">
                <p>You owned total</p>
                <p>{this.state.owned}</p>
                <button className="btn btn-success" onClick={this.remind}>Remind</button>
              </div>
            </div>
          </div>
            <div className="col-md-6">
              <div className="card card-size-red">
                <div className="card-body owe">
                  <p>You owe total</p>
                  <p>{this.state.owe}</p>
                  <button className="btn btn-danger" onClick={this.settleUp}>Settle Up</button>
                </div>
              </div>
            </div>
        </div>

        <Modal isOpen={this.state.open} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>{this.state.notify ? "Notification" : "Settle Up"}</ModalHeader>
          <ModalBody>
            <table className="table table-bordered">
              <thead>
                <th>Name</th>
                <th>Amount</th>
                <th></th>
              </thead>
              <tbody>
                {
                  this.state.notify ?
                  this.state.resOwned.map((n)=>{
                    return <tr>
                      <td>{n.name}</td>
                      <td className="green">{n.amount}</td>
                      <td>
                        <button id={JSON.stringify(n)} className="btn btn-sm btn-success" onClick={this.sendNotification}>Notify</button>
                      </td>
                    </tr>
                  })
                  :
                  this.state.resOwe.map((n)=>{
                    return <tr>
                      <td>{n.name}</td>
                      <td className="red">{n.amount}</td>
                      <td>
                        <button id={JSON.stringify(n)} className="btn btn-sm btn-info" onClick={this.settle}>Settle</button>
                      </td>
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

export default Home;