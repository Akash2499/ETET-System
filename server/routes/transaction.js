const express = require('express');
const router = express.Router();
const helper = require('../helper');
const data = require('../data');
const transactionData = data.transactions;    
const xss = require('xss');

router
  .route('/:transactionId')
  .get(async (req, res) => {
    try {
      let transactionId = req.params.transactionId
      helper.checkObjectId(transactionId)
      let transactionObj = await transactionData.getTransactionById(transactionId)
      return res.status(200).send({ transactionObj : transactionObj })
    } catch (e) {
      return res.status(400).send({ Error: e });
    }
  })


router
  .route('/:transactionId')
  .delete(async (req, res) => {
    try {
        let transactionId = req.params.transactionId
        helper.checkObjectId(transactionId)
        let response = await transactionData.deleteTransaction(transactionId)
        if(response.deleted)
            return res.status(200).send({ deleted : true })
        return res.status(400).send({ deleted : false })
      } catch (e) {
        return res.status(400).send({ Error: e });
      }
  })

  router
  .route('/addtransaction')
  .post(async (req, res) => {
    try {
        let userIds = req.body.userIds
        let name = xss(req.body.name)
        let category = xss(req.body.category)
        let paidBy = xss(req.body.paidBy)
        let amount = xss(req.body.amount)
        let groupId = xss(req.body.groupId)
        let comments = req.body.comments

        let response = await transactionData.addTransaction(
            userIds,
            name,
            category,
            paidBy,
            amount,
            groupId,
            comments
        )
        if(response.inserted)
            return res.status(200).send({ inserted : true })
      } catch (e) {
        console.log(e);
        return res.status(400).send({ Error: e });
      }
  })

router
  .route('/edittransaction/:transactionId')
  .put(async (req, res) => {
    try {
        let transactionId = req.params.transactionId
        let userIds = req.body.userIds
        let name = xss(req.body.name)
        let category = xss(req.body.category)
        let paidBy = xss(req.body.paidBy)
        let groupId = xss(req.body.groupId)
        let comments = req.body.comments
        let transactionDate = xss(req.body.transactionDate)

        let response = await transactionData.updateTransaction(
            transactionId,
            userIds,
            name,
            category,
            paidBy,
            groupId,
            comments,
            transactionDate
        )
        if(response.modified)
            return res.status(200).send({ modified : true })
      } catch (e) {
        return res.status(400).send({ Error: e });
      }
  })

router
.route('/editcomment/:transactionId')
  .post(async (req, res) => {  
    try {
        let transactionId = req.params.transactionId
        let comments = req.body.comments
    
        let response = await transactionData.updateCommentToTransaction(transactionId, comments)
        if(response.modified)
            return res.status(200).send({ modified : true })
        return res.status(400).send({ modified : false })
      } catch (e) {
        return res.status(400).send({ Error: e });
      }
  })

router
  .route('/comment/:transactionId')
  .post(async (req, res) => {  
    try {
        let transactionId = req.params.transactionId
        let comment = req.body.comment
    
        let response = await transactionData.addCommentToTransaction(transactionId, comment)
        if(response.modified)
            return res.status(200).send({ modified : true })
        return res.status(400).send({ modified : false })
      } catch (e) {
        return res.status(400).send({ Error: e });
      }
  })
  .put(async (req, res) => {  
    try {
        let transactionId = req.params.transactionId
        let comment = req.body.comment
    
        let response = await transactionData.updateCommentToTransaction(transactionId, comment)
        if(response.modified)
            return res.status(200).send({ modified : true })
        return res.status(400).send({ modified : false })
      } catch (e) {
        return res.status(400).send({ Error: e });
      }
  })

router
  .route('/comment/:transactionId/:commentId')
  .delete(async (req, res) => {  
    try {
        let transactionId = req.params.transactionId
        let commentId = req.params.commentId
    
        let response = await transactionData.deleteCommentToTransaction(transactionId, commentId)
        if(response.modified)
            return res.status(200).send({ modified : true })
        return res.status(400).send({ modified : false })
      } catch (e) {
        return res.status(400).send({ Error: e });
      }
  })

  router
  .route('/madepayment')
  .post(async (req, res) => {  
    try {
      let token = req.body.token
      let transaction = req.body.transaction
      let amount = req.body.amount
        let response = await transactionData.madePayment(token, transaction, amount)
        if(response.success)
            return res.status(200).send({ success : true })
        return res.status(400).send({ success : false })
      } catch (e) {
        return res.status(400).send({ Error: e });
      }
  })

module.exports = router;