import React from "react";
import './AddGroup.css'
import axios from "axios";
import Multiselect from 'multiselect-react-dropdown';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class AddGroup extends React.Component {

  constructor() {
    super();
    this.backEndURL = 'http://localhost:4000'
    this.state = { 
        members : [],
        name : "",
        transactions : [],
        loading : false,
        groups : [],
        allUsers : [],
        selectedMembers : [],
        groupMembers : [],
        open: false
    };
  }

  componentWillMount = async () => {

    this.setState({loading : true})
    let userId = sessionStorage.getItem('userId')

    let allUserUrl = this.backEndURL+"/users/getAllUsers"
    await axios.get(allUserUrl)
    .then((data)=>{
      let d = data.data.userData
      d = d.map((user)=>{
        return {
          "name" : user.firstName+" "+user.lastName,
          "id" : user._id
        }
      })
      this.setState({allUsers : d})
    })

    let url = this.backEndURL + "/groups/user/"+userId
    await axios.get(url)
    .then(async (data)=> {
      if(data.data.gorupObj){
        console.log(data.data.gorupObj)
        let groupData = []
        let groups = data.data.gorupObj
        for(let i=0;i<groups.length;i++){
            let url1 = this.backEndURL + "/groups/"+groups[i]
            await axios.get(url1)
            .then((d)=>{
              groupData.push(d.data.gorupObj)
            })    
        }
        this.setState({error : "", loading: false, groups : groupData})
      }
    })
    .catch((error)=>{
      let x = error.response.data.Error
      this.setState({loading : false, error : x})
    })

  }

  handleInput = (event) => {
    event.preventDefault()
    let state = this.state
    state[event.target.id] = event.target.value
    this.setState(state)
  }

  createGroup = async (event) => {
    event.preventDefault()
    this.setState({loading: true})
    let members = this.state.selectedMembers.map((m)=>m.id)
    let url = this.backEndURL+"/groups/creategroup"
    await axios.post(url,{
      name: this.state.name,
      members: members,
      userId: sessionStorage.getItem("userId")
    })
    .then((data)=>{
      if(data.data.inserted){
        this.setState({loading: false})
        window.location.reload()
      }
    })
    .catch((err)=>{
      this.setState({loading : false})
    })
  }

  onSelect = (value) => {
    this.setState({selectedMembers : value})
  }

  onRemove = (value) => {
    this.setState({selectedMembers: value})
  }


  addTransaction = (event) => {
    event.preventDefault()
    let id = event.target.id
    window.location.href = "/add-transaction?groupId="+id
  }

  removeGroup = async (event) => {
    event.preventDefault()
    let groupId = event.target.id
    let url = this.backEndURL+"/groups/"+groupId
    await axios.delete(url)
    .then((d)=>{
      if(d.data.deleted){
        this.setState({loading: false})
        window.location.reload()
      }
    })
    .catch((e)=>{
      this.setState({loading: false})
    })
  }

  seeMembers = async (event) => {
    event.preventDefault()
    this.setState({loading : true})
    let groupId = event.target.id
    let url = this.backEndURL+"/groups/"+groupId
    await axios.get(url)
    .then(async (d)=>{
      let res = d.data.gorupObj
      let gm = []
      for(let i=0;i<res.members.length;i++){
        let url1 = this.backEndURL+"/users/"+res.members[i]
        await axios.get(url1)
          .then((u)=>{
              let user = u.data.userObj
              gm.push(user.firstName+" "+user.lastName);
          })
      }
      this.setState({loading : false, groupMembers : gm, open : true})
    })
    .catch((e)=>{
      this.setState({loading : false, groupMembers : [], open : false})
    })
  }

  toggle = () => {
    this.setState({open : !this.state.open})
  }

  display = () => {
    return (
      <React.Fragment>
        <div className="row">
          <div className="col-md-6">
            <h3>My Group List</h3><br></br>
                {
                    this.state.groups.length == 0 ? "No Groups found !" :
                    <React.Fragment>
                        <table className="table table-bordered">
                            <thead>
                                <th>Group Name</th>
                                <th></th>
                                <th></th>
                                <th></th>
                            </thead>
                            <tbody>
                            {
                                this.state.groups.map((group)=>{
                                    return <tr>
                                        <td>{group.name}</td>
                                        <td>
                                            <button className="btn btn-info" id={group._id.toString()} onClick={this.seeMembers}>See Members</button>
                                        </td>
                                        <td>
                                            <button className="btn btn-primary" id={group._id.toString()} onClick={this.addTransaction}>Add Transaction</button>
                                        </td>
                                        <td>
                                            <button className="btn btn-danger" id={group._id.toString()} onClick={this.removeGroup}>Remove Group</button>
                                        </td>
                                    </tr>
                                })
                            }
                        </tbody>
                        </table>
                    </React.Fragment>
                }
          </div>
          <div className="col-md-6">
            <h3>Create Group</h3><br></br>
            <form>
                <div className="form-group">
                  <label for="name">Name</label>
                  <input type="text" className="form-control" id="name" placeholder="Group name" onChange={this.handleInput} value={this.state.name}/>
                </div>
                <div className="form-group">
                  <label for="members">Add Members</label>
                  <Multiselect
                    options={this.state.allUsers}
                    selectedValues={this.state.selectedMembers}
                    onSelect={this.onSelect}
                    onRemove={this.onRemove} 
                    displayValue="name"
                    />
                </div>

                <button type="submit" className="btn btn-success" onClick={this.createGroup}>Create</button>
            </form>
          </div>
        </div>
        
        <Modal isOpen={this.state.open} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Group Members</ModalHeader>
          <ModalBody>
            <table className="table table-bordered">
              <thead>
                <th></th>
                <th>Name</th>
              </thead>
              <tbody>
                {
                  this.state.groupMembers.map((n,i)=>{
                    return <tr>
                      <td>{i + 1}</td>
                      <td>{n}</td>
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

export default AddGroup;