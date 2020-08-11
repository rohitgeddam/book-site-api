var express = require('express')
var router = express.Router()
const HttpStatus = require('http-status-codes');
const authenticate = require("../auth/config");
const User = require('../models/User')

router.get('/:_id',authenticate, function(req, res){
    const {_id} = req.params;
    User.findById(_id).populate("books").populate("comments").exec(function(err, result){
        if(err) return res.json(err)
        return res.json(result)
    })
})

router.get('/',authenticate,function(req,res){
    User.find({},function(err, users){
        if(err) res.json(err)
        res.json(users)
    })
})
  
module.exports = router