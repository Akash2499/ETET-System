import React from "react";
import './MyActivity.css'
import axios from "axios";
import { Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Multiselect from 'multiselect-react-dropdown';
import { ElementsConsumer, CardElement } from "@stripe/react-stripe-js";

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
      loading: false,
      commentModal : false,
      selectedComments : [],
      selectedCommentName : "",
      selectedCommentsId : "",
      allMonths : [],
      selectedMonth1 : [],
      selectedMonth2 : [],
      compareData : {},
      showBar : false,
      pay : false,
      selectedPayTransaction : ""
    };
  }

  componentWillMount = async () => {

    let mm = []
    for(let i=1;i<=12;i++){
      mm.push({name : this.months[i], id: i})
    }
    this.setState({allMonths : mm})

    ChartJS.register(
      ArcElement, 
      Tooltip, 
      Legend, 
      BarElement,
      CategoryScale,
      LinearScale,
      Title
    );

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
    this.setState({selectedPayTransaction : event.target.id})
    this.togglePay()
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

  toggleComment = () => {
    this.setState({commentModal : !this.state.commentModal})
  }

  togglePay = () => {
    this.setState({pay : !this.state.pay})
  }

  alreadyPaid = (t) => {
    let userId = sessionStorage.getItem("userId")
    let f = t.userIds.filter((f)=>f.userId.toString()==userId)
    return f[0].paid ? f[0].paid : false
  } 

  commentClicked = async (event) => {
    event.preventDefault()
    let id = event.target.id
    let t = JSON.parse(id)
    this.toggleComment()
    for(let i=0;i<t.comments.length;i++){
      let uId = t.comments[i].commentedBy.toString()
      let url = this.backendUrl+"/users/"+uId
      await axios.get(url)
      .then((d)=>{
        let usr = d.data.userObj
        t.comments[i].name = usr.firstName+" "+usr.lastName
        t.comments[i].showEdit = usr._id.toString()==sessionStorage.getItem("userId").toString()
      })
    }
    console.log(t.comments)
    await this.setState({selectedComments : t.comments, selectedCommentName : t.name, selectedCommentsId: t._id.toString()})
  }

  addComment = async (event) => {
    event.preventDefault()
    let userId = sessionStorage.getItem("userId")
    let url = this.backendUrl+"/users/"+userId
    let name = ""
    await axios.get(url)
    .then((d)=>{
      let usr = d.data.userObj
      name = usr.firstName+" "+usr.lastName
    })  
    let selectedComments = this.state.selectedComments
    selectedComments.push({
      commentedBy : userId,
      name : name,
      comment : "",
      editClicked: true,
      showEdit : true
    })
    this.setState({selectedComments : selectedComments})
  }

  editComment = (event) => {
    event.preventDefault()
    let tmp = event.target.id
    let id = tmp.split("#")[0]
    let selectedComments = this.state.selectedComments
    selectedComments.map((c,i)=>{
      if(c._id && c._id.toString()==id){
        c.editClicked = true
      } else if(!c._id && i==tmp[1]){
        c.editClicked = true
      }
    })
    this.setState({selectedComments : selectedComments})
  }

  saveComment = (event) => {
    event.preventDefault()
    let tmp = event.target.id
    let id = tmp.split("#")[0]
    let selectedComments = this.state.selectedComments
    selectedComments.map((c, i)=>{
      if(c._id && c._id.toString()==id){
        c.editClicked = false
      } else if(!c._id && i==tmp[1]){
        c.editClicked = false
      }
    })
    this.setState({selectedComments : selectedComments})
  }

  deleteComment = (event) => {
    event.preventDefault()
    let tmp = event.target.id
    let id = tmp.split("#")[0]
    let selectedComments = this.state.selectedComments
    selectedComments = selectedComments.filter((c, i)=>{
      if(c._id && c._id.toString()==id){
        return false
      } else if(!c._id && i==tmp[1]){
        return false
      }
      return true
    })
    this.setState({selectedComments : selectedComments})
  }

  handleCommentText = (event) => {
    event.preventDefault()
    let val = event.target.value
    let tmp = event.target.id
    let id = tmp.split("#")[0]
    let selectedComments = this.state.selectedComments
    selectedComments.map((c, i)=>{
      if(c._id && c._id.toString()==id){
        c.comment = val
      } else if(!c._id && i==tmp[1]){
        c.comment = val
      }
    })
    this.setState({selectedComments : selectedComments})
  }

  cancelComment = async (event) => {
    event.preventDefault()
    let tId = this.state.selectedCommentsId
    let selectedComments = this.state.selectedComments
    let url = this.backendUrl+"/transactions/editcomment/"+tId
    await axios.post(url,{
      comments : selectedComments
    })
    .then((d)=>{
      if(d.data.modified){
       window.location.reload()
      }
    })
    .catch((err)=>{
      console.log(err)
    })
  }

  onSelectMonth1 = (value) => {
    this.setState({selectedMonth1 : value})
  }

  onSelectMonth2 = (value) => {
    this.setState({selectedMonth2: value})
  }

  compare = (event) => {
    event.preventDefault()
    this.setState({showBar : false})
    let month1 = this.state.selectedMonth1[0].id
    let month2 = this.state.selectedMonth2[0].id 
    let allT = this.state.allT
    let m1 = []
    let m2 = []
    allT.map((t)=>{
      let month = t.transactionDate.split("/")[0]
      if(month==month1){
        m1.push(t)
      }
      if(month==month2){
        m2.push(t)
      }
    })

    let category = this.state.allCategory
    let mL = [], m1D = [], m2D = []
    category.map((c)=>{

      let count = 0
      m1.map((m)=>{
        if(m.category==c)
        {
          let p = m.userIds.filter((tmp)=>tmp.userId.toString()==sessionStorage.getItem("userId").toString())
          count += Math.abs(p[0].amountOwed)
        }
      })

      mL.push(c)
      m1D.push(count)

      count = 0
      m2.map((m)=>{
        if(m.category==c)
        {
          let p = m.userIds.filter((tmp)=>tmp.userId.toString()==sessionStorage.getItem("userId").toString())
          count += Math.abs(p[0].amountOwed)
        }
      })

      m2D.push(count)

    })

    let res = {
      labels : mL,
      datasets: [
        {
          label: this.months[month1],
          data: m1D,
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
          label: this.months[month2],
          data: m2D,
          backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
      ],
    }
    console.log(res,"<=========")
    this.setState({compareData : res, showBar:true})
  }

  handleSubmit = async (event) => {
    event.preventDefault()
    this.setState({loading: true})
    const { stripe, elements } = this.props;
    if (!stripe || !elements) {
      return;
    }

    const card = elements.getElement(CardElement);
    const result = await stripe.createToken(card);
    if (result.error) {
      console.log(result.error.message);
    } else {
      console.log(result.token);
      let tt = JSON.parse(this.state.selectedPayTransaction)
      let sum = 0
      for(let i=0;i<tt.userIds.length;i++){
          let u = tt.userIds[i]
          if(u.userId.toString()==sessionStorage.getItem("userId").toString()){
              sum = u.amountOwed
          }
      }

      let url = this.backendUrl+"/transactions/madepayment"
      await axios.post(url,{
        token : result.token.id,
        transaction : this.state.selectedPayTransaction,
        amount: Math.abs(sum)
      })
      .then(async (d)=>{
       if(d.data.success) {
          let id = this.state.selectedPayTransaction
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
            <h3>Compare Expenses by Month</h3>
            <div className="col-md-12">
              <div className="form-group">
                <label for="month1">Month 1</label>
                <Multiselect
                    options={this.state.allMonths}
                    selectedValues={this.state.selectedMonth1}
                    onSelect={this.onSelectMonth1}
                    singleSelect={true}
                    displayValue="name"
                  />
              </div>
              <div className="form-group">
                <label for="month2">Month 2</label>
                <Multiselect
                    options={this.state.allMonths}
                    selectedValues={this.state.selectedMonth2}
                    onSelect={this.onSelectMonth2}
                    singleSelect={true}
                    displayValue="name"
                  />
              </div>
              <button className="btn btn-success" onClick={this.compare} disabled={this.state.selectedMonth1.length == 0 || this.state.selectedMonth2.length == 0}>Compare</button>
              {
                !this.state.showBar || Object.keys(this.state.compareData).length == 0 ? "" :
                <div className="barChart">
                  <Bar className="chart changeCursor" data={this.state.compareData}/>
                </div> 
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
                            <td><button className="btn btn-sm btn-primary" id={JSON.stringify(t)} onClick={this.commentClicked}>Comments</button></td>
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

        <Modal isOpen={this.state.commentModal} toggle={this.toggleComment}>
          <ModalHeader toggle={this.toggleComment}>Transaction Comments</ModalHeader>
          <ModalBody>
            <h3> Transaction Name : <b className="green">{this.state.selectedCommentName}</b></h3>
            <table className="table table-bordered">
              <thead>
                <th>CommentedBy</th>
                <th>Comment</th>
                <td></td>
                <td></td>
              </thead>
              <tbody>
                {
                  this.state.selectedComments.map((n,i)=>{
                    return <tr>
                      <td>{n.name}</td>
                      <td>
                        {
                          n.editClicked ?
                          <input className="comment-modal" type="text" id={n._id ? n._id+"#"+i : "#"+i} value={n.comment} onChange={this.handleCommentText}/>
                          : n.comment
                        }
                      </td>
                      <td>
                        {
                          n.editClicked ? 
                          <button className="btn btn-sm btn-success" id={n._id ? n._id+"#"+i : "#"+i} onClick={this.saveComment}>Save</button>
                          :
                          n.showEdit ? 
                          <button className="btn btn-sm btn-warning" id={n._id ? n._id+"#"+i : "#"+i} onClick={this.editComment}>Edit</button>
                          : ""
                        }
                      </td>
                      <td>
                        {
                          n.showEdit ? 
                          <button className="btn btn-sm btn-danger" id={n._id ? n._id+"#"+i : "#"+i} onClick={this.deleteComment}>Delete</button>
                          : ""
                        }
                      </td>
                    </tr>
                  })
                }
              </tbody>
            </table>
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-primary" color="secondary" onClick={this.addComment}>Add Comment</button>
            <button className="btn btn-success" color="secondary" onClick={this.cancelComment}>Done</button>
          </ModalFooter>
        </Modal>
      </React.Fragment>
    )
  }

  render() {
      return this.display()
  }
}

export default function InjectedMyActivity() {
  return (
    <ElementsConsumer>
      {({ stripe, elements }) => (
        <MyActivity stripe={stripe} elements={elements} />
      )}
    </ElementsConsumer>
  );
}

// export default MyActivity;