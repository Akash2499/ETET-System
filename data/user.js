// functions to get data from database

const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const helper = require('../helper');
const bcryptjs = require('bcryptjs');
const saltRounds = 16;
const transactions = require('./transactions')


async function createUser(all_user_related_arguments){
    //will create a user into the database
    //inputchecking should be done 
}

async function checkUser(email,password){
    //check is user exists in the database
}


async function getUserDetails(userId){
    //function to get user details
}

async function findUserByName(name){
    //returns list of users
}

const getUserTransactions = async (userId) => {
    userId = userId.trim()
    const userObj = await getUserDetails(userId);
    return userObj.transactions
}

const getUserTransactionsByMonth = async (userId, month) => {
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
    userId = userId.trim()
    category = category.trim()
    let userObj = await getUserDetails(userId);
    userObj.transactions = userObj.transactions.filter(async (transactionId)=>{
        let transactionObj = await transactions.getTransactionById(transactionId)
        return transactionObj.category == category
    })
    return userObj.transactions
}

module.exports = {
    createUser,
    checkUser,
    getUserDetails,
    getUserTransactions,
    getUserTransactionsByMonth,
    getUserTransactionsByCategory
}
