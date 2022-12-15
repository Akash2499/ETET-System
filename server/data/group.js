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

    name = name.trim()
    members.push(createBy)
    members = members.map((m)=>ObjectId(m.trim()))
    transactions = transactions.map((t)=>t.trim())

    const groupCollection = await groups()
    const insertInfo = await groupCollection.insertOne({
        members,
        name,
        transactions,
    });

    await members.map(async (m)=>{
        await users.addGroupToUser(m.toString(), insertInfo.insertedId.toString())
    })
    
    if (!insertInfo.acknowledged || !insertInfo.insertedId) throw 'Error while adding group'
    return { inserted : true }
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

    groupId = groupId.trim()
    name = name.trim()
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
    groupId = groupId.trim()
    const groupCollection = await groups();
    const groupObj = await groupCollection.findOne({_id: ObjectId(groupId)})
    if(!groupObj || groupObj==undefined)
        throw 'No group found with given Id'
    return groupObj
}

const getGroupsByUser = async (userId) => {
    helper.checkObjectId(userId)
    userId = userId.trim()
    let userData = await users.getUserDetails(userId)
    return userData.groups
}

module.exports = {
    createGroup,
    updateGroup,
    deleteGroup,
    getAllGroups,
    getGroupsByUser,
    getGroupById
}