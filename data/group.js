const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const groups = mongoCollections.groups;
const helper = require('../helper');


async function createGroup(users, groupName, etc){
    // function to create the group
}

async function checkGroup(userId,groupId){
    //check if user is present in that group
}


module.exports = {
    createGroup,
    checkGroup
}