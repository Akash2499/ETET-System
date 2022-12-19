import React from "react";
import './Home.css'
import axios from "axios";
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { ElementsConsumer, CardElement } from "@stripe/react-stripe-js";

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
      resOwned : [],
      pay : false,
      selectedPayTransaction : ""
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
              if(u.userId == userId.toString() && !u.paid){
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
          email: usr.email,
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
          email: usr.email,
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

  sendNotification = async (event) => {
    event.preventDefault()
    let usrId = sessionStorage.getItem("userId")
    let u = this.backendUrl+"/users/"+usrId
    let name = ""
    await axios.get(u)
    .then((dd)=>{
      let usr = dd.data.userObj
      name = usr.firstName+" "+usr.lastName
    }).catch((e)=>{})
    let id = JSON.parse(event.target.id)
    console.log(id,"<<<<<<<")
    let url = this.backendUrl+"/sendEmail"
    await axios.post(url, {
      userEmail : id.email,
      subject : "Note : You currently owe $"+id.amount+" to "+name,
      message : "Hey there,\n This is just a note to settle up on ETET as soon as you get the chance. You can visit our page for details on who owes what: http://localhost:3000/\n\nThanks,\nETET\n"
    }).then((d)=>{
      alert(`${d.data}`)
    })
    .catch((e)=>{
      alert(`${e}`)
    })
  }

  togglePay = () => {
    this.setState({pay : !this.state.pay})
  }

  settle = (event) => {
    event.preventDefault()
    this.togglePay()
    this.setState({selectedPayTransaction : event.target.id})
  }

  handleSubmit = async (event) => {
    event.preventDefault()
    this.setState({loading: true})
    const { stripe, elements } = this.props;
    if (!stripe || !elements) {
      return;
    }

    let selected = JSON.parse(this.state.selectedPayTransaction)

    const card = elements.getElement(CardElement);
    const result = await stripe.createToken(card);
    if (result.error) {
      console.log(result.error.message);
    } else {
      console.log(result.token);
      
      let url = this.backendUrl+"/transactions/madepayment"
      await axios.post(url,{
        token : result.token.id,
        transaction : JSON.stringify({
          name : "Settle Up - "+selected.name,
          _id : selected.id
        }),
        amount: Math.abs(selected.amount)
      })
      .then(async (d)=>{
       if(d.data.success) {

        let paidTo = selected.id
        url = this.backendUrl+"/users/"+paidTo
        await axios.get(url)
        .then(async (u)=>{
          let usr = u.data.userObj
          let tra = usr.transactions
          for(let i=0;i<tra.length;i++){
            url = this.backendUrl+"/transactions/"+tra[i]
            await axios.get(url)
            .then(async (t)=>{
              let ttt = t.data.transactionObj
              ttt.userIds.map((user)=>{
                if(user.userId.toString()==sessionStorage.getItem("userId").toString()){
                  user.paid = true
                }
              })
              url = this.backendUrl+"/transactions/edittransaction/"+ttt._id.toString()
              await axios.put(url, ttt)
              .catch((e)=>{
                console.log(e)
              })
            })
          }
          
        })
        }
        this.setState({loading: false})
        window.location.reload()
      })
      .catch((err)=>{
        console.log(err)
      })
    }
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
                <button className="btn btn-success" onClick={this.remind}>Notify</button>
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
                        <button id={JSON.stringify(n)} className="btn btn-sm btn-success" onClick={this.sendNotification}>Remind</button>
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
        
        <Modal isOpen={this.state.pay} toggle={this.togglePay}>
          <ModalHeader toggle={this.togglePay}>Checkout</ModalHeader>
          <ModalBody>
            <form onSubmit={this.handleSubmit}>
              <CardElement/><br></br><br></br>
              <button className="btn btn-sm btn-success">
                {
                    this.state.loading ?
                    <div class="spinner-border" role="status">
                    <span class="sr-only">Loading...</span>
                    </div> : "Pay"
                }
              </button>
            </form>
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-danger" color="secondary" onClick={this.togglePay}>Cancel</button>
          </ModalFooter>
        </Modal>

      </React.Fragment>
    )
  }

  render() {
      return this.display()
  }
}

export default function InjectedHome() {
  return (
    <ElementsConsumer>
      {({ stripe, elements }) => (
        <Home stripe={stripe} elements={elements} />
      )}
    </ElementsConsumer>
  );
}