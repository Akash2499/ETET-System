import React from "react";
import './AddFriend.css'
import axios from "axios";
import Multiselect from 'multiselect-react-dropdown';

class AddFriend extends React.Component {

  constructor() {
    super();
    this.backEndURL = 'http://localhost:4000'
    this.state = { 
        loading : false,
        friends : [],
        searchList : [],
        selectedUser : "",
        name : "",
        selectedFriend : []
    };
  }

  componentWillMount = async () => {

    this.setState({loading : true})
    let userId = sessionStorage.getItem('userId')
    let url = this.backEndURL + "/users/"+userId+"/friends"
    await axios.get(url)
    .then(async (data)=> {
      if(data.data.friends){
        let friendData = []
        let friends = data.data.friends
        for(let i=0;i<friends.length;i++){
            let url1 = this.backEndURL + "/users/"+friends[i]
            await axios.get(url1)
            .then((d)=>{
                friendData.push(d.data.userObj)
            })    
        }
        this.setState({error : "", loading: false, friends: friendData})
      }
    })
    .catch((error)=>{
      let x = error.response.data.Error
      this.setState({loading : false, error : x})
    })

  }

  handleInput = async (event) => {
    event.preventDefault()
    let name = event.target.value
    let url = this.backEndURL + "/users/searchname"
    await axios.post(url,{name : name})
    .then((data)=>{
        let res = data.data.findUserByName
        res.map((r)=>{
          r.name = r.firstName+" "+r.lastName
        })
        this.setState({searchList : res})
    })
    .catch((err)=>{
        this.setState({searchList : []})
    })
    await this.setState({name : name})
  }

  addTransaction = (event) => {
    event.preventDefault()
    let id = event.target.id
    window.location.href = "/add-transaction?userId="+id
  }

  add = async (event) => {
    event.preventDefault()
    this.setState({loading : true})
    let userId = sessionStorage.getItem('userId')
    console.log(this.state.selectedFriend,"===")
    for(let i=0;i<this.state.selectedFriend.length;i++)
    {
      let fId = this.state.selectedFriend[i]._id.toString()
      let url = this.backEndURL + "/users/"+userId+"/friends"
        await axios.post(url, {friendId : fId})
        .then(async (data)=> {return})
        .catch((err)=>{
          this.setState({loading : false})
        })
    }
    this.setState({loading: false})
    window.location.reload()
  }

  addFriend = (event) => {
    event.preventDefault()
    let user = JSON.parse(event.target.id)
    this.setState({name : user.firstName+" "+user.lastName, searchList : [], selectedUser: user._id.toString()})
  }

  removeFriend = async (event) => {
    event.preventDefault()
    let friendId = event.target.id
    let userId = sessionStorage.getItem('userId')

    let url = this.backEndURL + "/users/"+userId+"/friends/"+friendId
    await axios.delete(url)
    .then(async (data)=> {
      if(data.data.friendAdded){
        this.setState({loading: false})
        window.location.reload()
      }
    })
    .catch((error)=>{
      let x = error.response.data.Error
      this.setState({loading : false})
    })
  }

  onSelect = (value) => {
    this.setState({selectedFriend : value})
  }

  onRemove = (value) => {
    this.setState({selectedFriend: value})
  }


  display = () => {
    return (
      <React.Fragment>
        <div className="row">
            <div className="col-md-6">
                <h3>My Friend List</h3><br></br>
                {
                    this.state.friends.length == 0 ? "No friends found !" :
                    <React.Fragment>
                        <table className="table table-bordered">
                            <thead>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th></th>
                                <th></th>
                            </thead>
                            <tbody>
                            {
                                this.state.friends.map((friend)=>{
                                    return <tr>
                                        <td>{friend.firstName}</td>
                                        <td>{friend.lastName}</td>
                                        <td>
                                            <button className="btn btn-primary" id={friend._id.toString()} onClick={this.addTransaction}>Add Transaction</button>
                                        </td>
                                        <td>
                                            <button className="btn btn-danger" id={friend._id.toString()} onClick={this.removeFriend}>Remove Friend</button>
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
                <h3>Add Friend</h3><br></br>
                <form>
                    <div className="form-group">
                        <label for="name">Name</label>
                        <input type="text" className="form-control" id="name" placeholder="Search name" onChange={this.handleInput} value={this.state.name}/><br></br>
                        {
                          this.state.searchList == 0 ? "" : 
                          <Multiselect
                            options={this.state.searchList}
                            selectedValues={this.state.selectedFriend}
                            onSelect={this.onSelect}
                            onRemove={this.onRemove} 
                            displayValue="name"
                            placeholder="Suggestions"
                          />
                        }
                    </div>
                    <button type="submit" className="btn btn-info btn-style" onClick={this.add}>
                        {
                            this.state.loading ?
                            <div class="spinner-border" role="status">
                            <span class="sr-only">Loading...</span>
                            </div> : "Add"
                        }
                    </button>
                </form>
            </div>
        </div>
      </React.Fragment>
    )
  }

  render() {
      return this.display()
  }
}

export default AddFriend;