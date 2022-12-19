const mongoCollections = require('../config/mongoCollections');
const groups = mongoCollections.groups;
const helper = require('../helper');
const {ObjectId} = require('mongodb')
const users = require('./user')

const createGroup = async (
    members,
    name,
    transactions,
    createBy
) => {

    helper.checkGroupName(name)
    helper.checkGroupMembers(members)
    helper.checkGroupTransactions(transactions)
    helper.checkObjectId(createBy)

    name = name.toString().trim()
    members.push(createBy)
    members = members.map((m)=>ObjectId(m.toString().trim()))
    transactions = transactions.map((t)=>t.trim())

    const groupCollection = await groups()
    const insertInfo = await groupCollection.insertOne({
        members,
        name,
        transactions,
    });


    for( i = 0; i < members.length; i++){
        await users.addGroupToUser(members[i].toString(),insertInfo.insertedId.toString())
    }
    
    if (!insertInfo.acknowledged || !insertInfo.insertedId) throw 'Error while adding group'
    return { inserted : true , _id: insertInfo.insertedId}
}

const updateGroup = async (
    groupId,
    members,
    name,
    transactions
) => {

    helper.checkObjectId(groupId)
    helper.checkGroupMembers(members)
    helper.checkGroupName(name)
    helper.checkGroupTransactions(transactions)

    groupId = groupId.toString().trim()
    name = name.toString().trim()
    members = members.map((m)=>m.trim())
    transactions = transactions.map((t)=>t.trim())

    const groupCollection = await groups();
    const groupObj = await getGroupById(groupId)
    groupObj.name = name
    groupObj.transactions = transactions
    groupObj.members = members

    const updatedInfo = await groupCollection.replaceOne(
        {_id: ObjectId(groupId)},
        groupObj
    )

    if (updatedInfo.modifiedCount === 0) {
    throw 'Could not update group successfully'
    }

    return { modified : true }
}

const deleteGroup = async (groupId) => {

    helper.checkObjectId(groupId)
    groupId = groupId.trim()

    const groupCollection = await groups();
    const groupObj = await getGroupById(groupId)
    groupObj.members.map(async (userId)=>{
        await users.deleteGroupFromUser(userId, groupId);
    })
    const deletionInfo = await groupCollection.deleteOne({_id: ObjectId(groupId)})
    if(deletionInfo.deletedCount === 0) 
        throw 'Could not delete group'

    return { deleted : true }
}

const getAllGroups = async () => {
    const groupCollection = await groups();
    const groupList = await groupCollection.find({}).toArray()
    return groupList
}

const getGroupById = async (groupId) => {
    helper.checkObjectId(groupId)
    groupId = groupId.toString().trim()
    const groupCollection = await groups();
    const groupObj = await groupCollection.findOne({_id: ObjectId(groupId)})
    if(!groupObj || groupObj==undefined)
        throw 'No group found with given Id'
    return groupObj
}

const getGroupsByUser = async (userId) => {
    helper.checkObjectId(userId)
    userId = userId.toString().trim()
    let userData = await users.getUserDetails(userId)
    return userData.groups
}

const addTransactionToGroup = async (groupId,transactionId) => {
    helper.checkObjectId(groupId);
    helper.checkObjectId(transactionId);
    let group = await getGroupById(groupId);
    group.transactions.push(transactionId)

    const groupCollection = await groups();
    const info = await groupCollection.updateOne(
        {_id: ObjectId(groupId)},
        { $set: { transactions : group.transactions }}
      );
      if(info.modifiedCount === 0){
        throw new Error('Cannot update User');
      }
    return await getGroupById(groupId)
}

module.exports = {
    createGroup,
    updateGroup,
    deleteGroup,
    getAllGroups,
    getGroupsByUser,
    getGroupById,
    addTransactionToGroup
}