// functions to get data from database

const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const helper = require('../helper');
const bcryptjs = require('bcryptjs');
const saltRounds = 16;


async function createUser(all_user_related_arguments){
    //will create a user into the database
    //inputchecking should be done 
}

async function checkUser(email,password){
    //check is user exists in the database
}





module.exports = {
    createUser,
    checkUser
}
