import React from "react";
import './AddFriend.css'
import axios from "axios";

class AddFriend extends React.Component {

  constructor() {
    super();
    this.backEndURL = 'http://localhost:4000'
    this.state = { 
        loading : false,
        friends : [],
        searchList : [],
        selectedUser : "",
        name : ""
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
        this.setState({searchList : data.data.findUserByName})
    })
    .catch((err)=>{
        this.setState({searchList : []})
    })
    await this.setState({name : name})
  }

  addTransaction = (event) => {
    event.preventDefault()
    console.log(event.target.id)
  }

  add = async (event) => {
    event.preventDefault()
    this.setState({loading : true})
    let userId = sessionStorage.getItem('userId')
    let url = this.backEndURL + "/users/"+userId+"/friends"
    await axios.post(url, {friendId : this.state.selectedUser})
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

  addFriend = (event) => {
    event.preventDefault()
    let user = JSON.parse(event.target.id)
    this.setState({name : user.firstName+" "+user.lastName, searchList : [], selectedUser: user._id.toString()})
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
                        <label for="name">Email address</label>
                        <input type="text" className="form-control" id="name" placeholder="Search name" onChange={this.handleInput} value={this.state.name}/>
                    </div>
                    {
                        this.state.searchList.length == 0 ? "" :
                        <ol>
                            {
                                this.state.searchList.map((user)=>{
                                    return <li className="li-style" id={JSON.stringify(user)} onClick={this.addFriend}>
                                        {user.firstName} {user.lastName}
                                    </li>
                                })
                            }
                        </ol>
                    }
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