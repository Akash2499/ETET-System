const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const helper = require('../helper');
const bcryptjs = require('bcryptjs');
const saltRounds = 16;
const {ObjectId} = require('mongodb');

const getAllUsers = async () => {
    const userCollection = await users();
    const users = await userCollection.find({}).toArray();
    if (!users){
    throw 'No users found!';
    }
    return users;
}


const createUser = async ( 
    firstName,
    lastName,
    dateOfBirth,
    email,
    password,
    budget
) => {
    //will create a user into the database
    //inputchecking should be done 
    helper.checkFnameLname(firstName);
    helper.checkFnameLname(lastName);
    helper.checkDOB(dateOfBirth);
    helper.checkEmail(email);
    helper.checkPassword(password);
    helper.checkBudget(budget);

    email = email.trim().toLowerCase();
    const userCollection = await users();
    const userPresent = await  userCollection.findOne({email: email})
    if(userPresent !== null){
        throw 'Email already registred'
    }
    
    const passwordHash = await bcryptjs.hash(password,saltRounds)

    const newUser = {
        firstName: firstName.trim().toLowerCase(),
        lastName: lastName.trim().toLowerCase(),
        dateOfBirth: dateOfBirth,
        email: email.trim().toLowerCase(),
        password: passwordHash,
        friends: [],
        transactions: [],
        groups: [],
        budget: budget
    }

    const insertUser = await userCollection.insertOne(newUser);
    if (!insertUser.acknowledged || !insertUser.insertedId)
    throw 'Could not add User';

    return await getUserDetails(insertUser.insertedId.toString())
}

const checkUser = async (email,password) =>{
    //check is user exists in the database
    //input validation here
    helper.checkEmail(email);
    helper.checkPassword(password);

    email = email.trim().toLowerCase();
    password = password.trim();

    const userCollection = await users();
    const userPresent = await userCollection.findOne({email: email});
    if(userPresent === null){
    throw 'Either the email or password is invalid'
    }

    const passwordCompare = await bcryptjs.compare(password,userPresent.password);
    if(passwordCompare){
    return {authenticatedUser: true}
    }
    throw 'Either the email or password is invalid'
}

const deleteGroupFromUser = async (userId,groupId) =>{

    helper.checkObjectId(userId);
    helper.checkObjectId(groupId);

    let currentUser = await getUserDetails(userId);
    let newGroups = []
    for(let i=0; i<currentUser.groups.length;i++){
        if(currentUser.groups[i].toString() != groupId){
            newGroups.push(currentUser.groups[i]);
        }
    }
    const updatedUser = {
        groups: newGroups
    }

    const info = await userCollection.updateOne(
        {_id: ObjectId(userId)},
        {$set: updatedUser}
      );
      if(info.modifiedCount === 0){
        throw new Error('Cannot update User');
      }
    return await getUserDetails(userId)
}


const updateUser = async (
    userId,
    firstName,
    lastName,
    dateOfBirth,
    budget
) => {
    helper.checkObjectId(userId);
    helper.checkFnameLname(firstName);
    helper.checkFnameLname(lastName);
    helper.checkDOB(dateOfBirth);
    helper.checkBudget(budget);
    
    const updatedUser = {
        firstName: firstName.trim().toLowerCase(),
        lastName: lastName.trim().toLowerCase(),
        dateOfBirth: dateOfBirth,
        budget: budget
    }

    const userCollection = await users();
    const info = await userCollection.updateOne(
        {_id: ObjectId(userId)},
        {$set: updatedUser}
      );
      if(info.modifiedCount === 0){
        throw new Error('Cannot update User');
      }
    return await getUserDetails(userId)
}


const getUserDetails = async (userId) => {
    //function to get user details
    helper.checkObjectId(userId);
    userId = userId.toString().trim();
    const userCollection = await users();
    const userPresent = await userCollection.findOne({_id: ObjectId(userId)});
    if(userPresent === null){
    throw 'No user found!'
    }
    userPresent._id = userPresent._id.toString();
    return userPresent
}

const findUserByName = async (name) => {
    //returns list of users
    helper.checkString(name);
    name = name.trim().toLowerCase();
    const allUsers = await getAllUsers();
    let searchResult = [];
    for(let i =0; i<allUsers.length;i++){
        if(allUsers[i].firstName.includes(name) || allUsers[i].lastName.includes(name)){
            searchResult.push(allUsers[i]);
        }
    }

    if(searchResult == []){
        throw 'No result found'
    }
    return searchResult

}

const addTransactionToUser = async (userId, transactionId) => {
    helper.checkObjectId(userId);
    helper.checkObjectId(transactionId);
    let currentUser = await getUserDetails(userId);
    currentUser.transactions.push(ObjectId(transactionId))

    const userCollection = await users();
    const info = await userCollection.updateOne(
        {_id: ObjectId(userId)},
        { $set: { transactions : currentUser.transactions }}
      );
      if(info.modifiedCount === 0){
        throw new Error('Cannot update User');
      }
    return await getUserDetails(userId)
}

const deleteTransactionOfUser = async (userId,transactionId) =>{
    helper.checkObjectId(userId);
    helper.checkObjectId(transactionId);
    let currentUser = await getUserDetails(userId);
    let newTransactions = []
    for(let i=0; i<currentUser.transactions.length;i++){
        if(currentUser.transactions[i].toString() != transactionId){
            newTransactions.push(currentUser.transactions[i]);
        }
    }
    const updatedUser = {
        transactions: newTransactions
    }

    const info = await userCollection.updateOne(
        {_id: ObjectID(userId)},
        {$set: updatedUser}
      );
      if(info.modifiedCount === 0){
        throw new Error('Cannot update User');
      }
    return await getUserDetails(userId)
}

const deleteUser = async (userId) => {

    helper.checkObjectId(userId);
    const userCollection = await users();
    const ans = await getUserDetails(userId);
    const user = await userCollection.deleteOne({_id: ObjectId(userId)});
    if (user.deletedCount === 0) {
    throw new Error('Could not delete User!');
    }
    return {deletedUser: true}
}

const getUserTransactions = async (userId) => {
    helper.checkObjectId(userId);
    userId = userId.trim()
    const userObj = await getUserDetails(userId);
    return userObj.transactions
}

const getUserTransactionsByMonth = async (userId, month) => {
    helper.checkObjectId(userId);
    userId = userId.trim()
    month = month.trim()
    let userObj = await getUserDetails(userId);
    userObj.transactions = userObj.transactions.filter(async (transactionId)=>{
        let transactionObj = await transactions.getTransactionById(transactionId)
        return parseInt(transactionObj.transactionDate.split("/")[0])==month
    })
    return userObj.transactions
}

const getUserTransactionsByCategory = async (userId, category) => {
    helper.checkObjectId(userId);
    userId = userId.trim()
    category = category.trim()
    let userObj = await getUserDetails(userId);
    userObj.transactions = userObj.transactions.filter(async (transactionId)=>{
        let transactionObj = await transactions.getTransactionById(transactionId)
        return transactionObj.category == category
    })
    return userObj.transactions
}

const addFriendToUser = async (userId,friendId) => {
    helper.checkObjectId(userId);
    helper.checkObjectId(friendId);

    userId = userId.trim();
    friendId = friendId.trim();

    let user = getUserDetails(userId);
    let friend = getUserDetails(friendId);
    user.friends.push(friendId);
    friend.friends.push(userId);

    const userCollection = await users();
    const infoUser = await userCollection.updateOne(
        {_id: ObjectId(userId)},
        { $set: { friends : user.friends }}
      );
      if(infoUser.modifiedCount === 0){
        throw new Error('Cannot update User');
      } 
    const infoFriend = await userCollection.updateOne(
        {_id: ObjectId(userId)},
        { $set: { friends : friend.friends }}
      );
      if(infoFriend.modifiedCount === 0){
        throw new Error('Cannot update User');
      }
    
    return {friendInserted: true}

}

const getAllFriends = async (userId) => {
    helper.checkObjectId(userId);
    userId = userId.trim();

    const user = await getUserDetails(userId);
    return user.friends
}

const removeFriendFromUser = async (userId,friendId) => {
    helper.checkObjectId(userId);
    helper.checkObjectId(friendId);

    userId = userId.trim();
    friendId = friendId.trim();

    const user = getUserDetails(userId);
    const friend = getUserDetails(friendId);
    if(!user.friends.includes(friendId) || !friend.friends.includes(userId)){
        throw 'Friend not present in User'
    }

    user.friends = user.friends.filter(userIds => userIds != friendId);
    friend.friends = friend.friends.filter(userIds => userIds != userId);

    const userCollection = await users();
    const infoUser = await userCollection.updateOne(
        {_id: ObjectId(userId)},
        { $set: { friends : user.friends }}
      );
      if(infoUser.modifiedCount === 0){
        throw new Error('Cannot update User');
      } 
    const infoFriend = await userCollection.updateOne(
        {_id: ObjectId(userId)},
        { $set: { friends : friend.friends }}
      );
      if(infoFriend.modifiedCount === 0){
        throw new Error('Cannot update User');
      }

    return {friendRemoved: true}
}

module.exports = {
    createUser,
    checkUser,
    getUserDetails,
    getUserTransactions,
    getUserTransactionsByMonth,
    getUserTransactionsByCategory,
    findUserByName,
    getAllUsers,
    updateUser,
    deleteGroupFromUser,
    deleteUser,
    addTransactionToUser,
    deleteTransactionOfUser,
    addFriendToUser,
    getAllFriends,
    removeFriendFromUser
}
