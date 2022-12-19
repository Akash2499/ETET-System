const express = require('express');
const router = express.Router();
const helper = require('../helper');
const data = require('../data');
const groupData = data.groups;    
const xss = require('xss');
router
  .route('/:groupId')
  .get(async (req, res) => {
    try {
      let groupId = req.params.groupId
      helper.checkObjectId(groupId)
      let gorupObj = await groupData.getGroupById(groupId)
      return res.status(200).send({ gorupObj : gorupObj })
    } catch (e) {
      return res.status(400).send({ Error: e });
    }
  })
  .delete(async (req, res) => {
    try {
        let groupId = req.params.groupId;
        helper.checkObjectId(groupId)
        let response = await groupData.deleteGroup(groupId)
        if(response.deleted)
            return res.status(200).send({ deleted : true })
        return res.status(400).send({ deleted : false })
      } catch (e) {
        return res.status(400).send({ Error: e });
      }
  })
  .put(async (req,res) => {
    try{
      let groupId = req.params.groupId;
      let members = req.body.members;
      let groupName = req.body.name;
      let transactions = [];

      let response = await groupData.updateGroup(groupId,xss(members),xss(groupName),transactions);
      if(response.inserted)
        return res.status(200).send({ inserted : true })
    }catch (e) {
        return res.status(400).send({ Error: e });
    }
  })


router
  .route('/creategroup')
  .post(async (req,res) => {
    try{
      let members = req.body.members;
      let groupName = req.body.name;
      let createBy = req.body.userId;
      let transactions = [];

      let response = await groupData.createGroup(xss(members),xss(groupName),transactions, createBy);
      if(response.inserted)
        return res.status(200).send({ inserted : true })
    }catch (e) {
        return res.status(400).send({ Error: e });
    }
  })


router
  .route('/user/:userId')
  .get(async (req,res) => {
    try {
      let userId = req.params.userId;
      helper.checkObjectId(userId)
      let gorupObj = await groupData.getGroupsByUser(userId)
      return res.status(200).send({ gorupObj : gorupObj })
    } catch (e) {
      return res.status(400).send({ Error: e });
    }
  })

module.exports = router;