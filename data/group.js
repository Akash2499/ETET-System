const mongoCollections = require('../config/mongoCollections');
const groups = mongoCollections.groups;
const helper = require('../helper');
const {ObjectId} = require('mongodb')
const users = require('./user')

const createGroup = async (
    members,
    name,
    transactions
) => {
    name = name.trim()

    const groupCollection = await groups()
    const insertInfo = await groupCollection.insertOne({
        members,
        name,
        transactions,
    });
    
    if (!insertInfo.acknowledged || !insertInfo.insertedId) throw 'Error while adding group'
    return { inserted : true };
}

const updateGroup = async (
    groupId,
    members,
    name,
    transactions
) => {
    groupId = groupId.trim()
    name = name.trim()

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
    groupId = groupId.trim()
    const groupCollection = await groups();
    const groupObj = await groupCollection.findOne({_id: ObjectId(groupId)})
    if(!groupObj || groupObj==undefined)
        throw 'No group found with given Id'
    return groupObj
}

const getGroupsByUser = async (userId) => {
    userId = userId.trim()
    let groupList = await getAllGroups()
    groupList = groupList.filter((group)=>{
        return group.members.includes(ObjectId(userId))
    })
    return groupList
}

module.exports = {
    createGroup,
    updateGroup,
    deleteGroup,
    getAllGroups,
    getGroupsByUser
}