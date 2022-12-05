const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const transactions = mongoCollections.transactions;
const helper = require('../helper');
const bcryptjs = require('bcryptjs');
const saltRounds = 16;
const {ObjectId} = require('mongodb')

const addTransaction = async (
    userIds,
    name,
    category,
    paidBy,
    groupId,
    description,
    comments
) => {

    name = name.trim()
    category = category.trim()
    paidBy = paidBy.trim()
    groupId = groupId.trim()
    description = description.trim()
    comments = comments.trim()

    const transactionCollection = await transactions()
    const insertInfo = await transactionCollection.insertOne({
        userIds,
        name,
        category,
        paidBy,
        groupId,
        description,
        comments
    });
    
    if (!insertInfo.acknowledged || !insertInfo.insertedId) throw 'Error while adding transaction'
    return { inserted : true };
}

const addCommentToTransaction = async (transactionId, comment) => {
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
    commentId = commentId.trim()
    comment = comment.trim()
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
    description,
    comments
) => {

    transactionId = transactionId.trim()
    name = name.trim()
    category = category.trim()
    paidBy = paidBy.trim()
    groupId = groupId.trim()
    description = description.trim()
    comments = comments.trim()

    const transactionCollection = await transactions();
    let transactionObj = await getTransactionById(transactionId)
    
    transactionObj.userIds = userIds
    transactionObj.name = name
    transactionObj.category = category
    transactionObj.paidBy = paidBy
    transactionObj.groupId = groupId
    transactionObj.description = description
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
    transactionId = transactionId.trim()
    const transactionCollection = await transactions();

    const deletionInfo = await transactionCollection.deleteOne({_id: ObjectId(transactionId)})
    if(deletionInfo.deletedCount === 0) 
        throw 'Could not delete transaction'

    return { deleted : true }
}

const getTransactionById = async (transactionId) => {
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

const getUserTransactions = async (userId) => {

    userId = userId.trim()
    const transactionsList = await getAllTransactions();
    const userTransactions =  transactionsList.filter((transactions)=>transactions.paidBy==userId)
    return userTransactions
}

const getUserTransactionsByMonth = async (userId, month) => {
    userId = userId.trim()
    month = month.trim()
    const userTransactions = await getUserTransactions(userId)
    const monthTransactions = userTransactions.filter((transactions)=>{
        return parseInt(transactions.TransactionDate.split("/")[0])==month
    })
    return monthTransactions
}

const getUserTransactionsByCategory = async (userId, category) => {
    userId = userId.trim()
    category = category.trim()
    const userTransactions = await getUserTransactions(userId)
    const categoryTransactions = userTransactions.filter((transactions)=>{
        return transactions.Category = category
    })
    return categoryTransactions
}

module.exports = {
    addTransaction,
    getUserTransactions,
    getUserTransactionsByMonth,
    getUserTransactionsByCategory,
    updateTransaction,
    deleteTransaction,
    addCommentToTransaction,
    updateCommentToTransaction,
    deleteCommentToTransaction
}