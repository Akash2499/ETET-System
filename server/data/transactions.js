const mongoCollections = require('../config/mongoCollections');
const transactions = mongoCollections.transactions;
const helper = require('../helper');
const bcryptjs = require('bcryptjs');
const saltRounds = 16;
const {ObjectId} = require('mongodb');
const data = require('./');
const userData = data.users;    
const user = require('./user');
const group = require('./group');

const addTransaction = async (
    userIds,
    name,
    category,
    paidBy,
    amount,
    groupId,
    comments,
    transactionDate
) => {

    //helper.checkUserId(userIds)
    userIds.map((uid)=>{
        helper.checkObjectId(uid.userId)
        uid.userId.trim()
    })
    helper.checkString(name)
    helper.checkObjectId(paidBy)
    helper.checkAmount(amount)

    helper.checkTransactionDate(transactionDate)
    
    name = name.trim()
    category = category.trim()
    paidBy = ObjectId(paidBy.trim())
    transactionDate = transactionDate || helper.getTodaysDate()

    const transactionCollection = await transactions()
    const insertInfo = await transactionCollection.insertOne({
        userIds,
        name,
        category,
        paidBy,
        amount,
        groupId,
        comments,
        transactionDate
    });
    
    if (!insertInfo.acknowledged || !insertInfo.insertedId) throw 'Error while adding transaction'

    //await user.addTransactionToUser(paidBy, insertInfo.insertedId.toString())
    userIds.map(async (u)=>{
        await user.addTransactionToUser(u.userId.toString(), insertInfo.insertedId.toString())
    })

    return { inserted : true };
}

const addCommentToTransaction = async (transactionId, comment) => {
    transactionId = transactionId.toString().trim()
    helper.checkObjectId(transactionId)
    let transactionObj = await getTransactionById(transactionId)
    transactionObj.comments.push({
        _id: new ObjectId(),
        comment
    })

    const transactionCollection = await transactions();
    const updatedInfo = await transactionCollection.replaceOne(
        {_id: transactionObj._id},
        transactionObj
    )

    if (updatedInfo.modifiedCount === 0)
        throw 'Could not add comment to transaction'

    return { modified : true }
}

const updateCommentToTransaction = async (transactionId, commentId, comment) => {

    helper.checkObjectId(transactionId)
    helper.checkObjectId(commentId)
    commentId = commentId.trim()
    let transactionObj = await getTransactionById(transactionId)
    transactionObj.comments = transactionObj.comments.map((c)=>{
        if(c._id.toString() == commentId){
            c.comment = comment
        }
    })
    const transactionCollection = await transactions();
    const updatedInfo = await transactionCollection.replaceOne(
        {_id: transactionObj._id},
        transactionObj
    )

    if (updatedInfo.modifiedCount === 0)
        throw 'Could not update comment to transaction'

    return { modified : true }
}

const deleteCommentToTransaction = async (transactionId, commentId) => {

    helper.checkObjectId(transactionId)
    helper.checkObjectId(commentId)
    commentId = commentId.trim()
    let transactionObj = await getTransactionById(transactionId)
    transactionObj.comments = transactionObj.comments.filter((c)=>c._id.toString()!=commentId)

    const transactionCollection = await transactions();
    const updatedInfo = await transactionCollection.replaceOne(
        {_id: transactionObj._id},
        transactionObj
    )

    if (updatedInfo.modifiedCount === 0)
        throw 'Could not delete comment from transaction'

    return { modified : true }
}

const updateTransaction = async (
    transactionId,
    userIds,
    name,
    category,
    paidBy,
    groupId,
    comments
) => {

    helper.checkObjectId(transactionId)
    helper.checkUserId(userIds)
    userIds = userIds.map((uid)=>{
        helper.checkObjectId(uid)
        return uid.trim()
    })
    helper.checkString(name);
    helper.checkObjectId(paidBy);

    transactionId = transactionId.trim()
    name = name.trim()
    category = category.trim()
    paidBy = paidBy.trim()
    groupId = groupId.trim()

    const transactionCollection = await transactions();
    let transactionObj = await getTransactionById(transactionId)
    
    transactionObj.userIds = userIds
    transactionObj.name = name
    transactionObj.category = category
    transactionObj.paidBy = paidBy
    transactionObj.groupId = groupId
    transactionObj.comments = comments

    const updatedInfo = await transactionCollection.replaceOne(
        {_id: ObjectId(transactionId)},
        transactionObj
    )

    if (updatedInfo.modifiedCount === 0) {
    throw 'Could not update transaction successfully'
    }

    return { modified : true }

}  

const deleteTransaction = async (transactionId) => {
    helper.checkObjectId(transactionId)
    transactionId = transactionId.trim()
    const transactionCollection = await transactions();
    const transactionObj = await getTransactionById(transactionId)
    const deletionInfo = await transactionCollection.deleteOne({_id: ObjectId(transactionId)})
    if(deletionInfo.deletedCount === 0) 
        throw 'Could not delete transaction'

    await user.deleteTransactionOfUser(transactionObj.paidBy)
    transactionObj.userIds.map(async (userId)=>{
        await user.deleteTransactionOfUser(userId)
    })

    return { deleted : true }
}

const getTransactionById = async (transactionId) => {
    helper.checkObjectId(transactionId)
    transactionId = transactionId.trim()
    const transactionCollection = await transactions();
    const transactionObj = await transactionCollection.findOne({_id: ObjectId(transactionId)})
    if(!transactionObj || transactionObj==undefined)
        throw 'No transaction found with given Id'
    return transactionObj
}

const getAllTransactions = async () => {
    const transactionCollection = await transactions();
    const transactionsList = await transactionCollection.find({}).toArray()
    return transactionsList
}

module.exports = {
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addCommentToTransaction,
    updateCommentToTransaction,
    deleteCommentToTransaction,
    getTransactionById,
    getAllTransactions
}
