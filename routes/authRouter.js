var express = require('express')
var router = express.Router()
const HttpStatus = require('http-status-codes');

const User = require('../models/User')

router.post('/signup', (req,res) => {
    const {email, username, password} = req.body;
    User.findOne({email},function(err,user){
        if(err) return res.status(INTERNAL_SERVER_ERROR).json(err)
        if(user){
            if(user.username == username){
                res.status(HttpStatus.CONFLICT).json("User already registerd with this username");
            }else{

                res.status(HttpStatus.CONFLICT).json("User already registerd with this email id");
            }
        }
        if(!user){
            const newUser = new User({email,username})
            newUser.setPassword(password)
            newUser.save(function(err,newUser){
                if(err) return res.status(HttpStatus.EXPECTATION_FAILED).json(err)
                console.log(newUser);
                res.status(HttpStatus.CREATED).json(newUser)
            });
        }
    })
})


router.post('/login', (req, res) => {
    const {email, password} = req.body;
    User.findOne({email}, function(err, user){
        if(err) return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err)
        if(user){
            if(user.validatePassword(password)){
                const token = user.getSignedJwt();
                return res.status(HttpStatus.OK).json(token);
            }
            else{
                return res.status(HttpStatus.EXPECTATION_FAILED).json("email or password in incorrect.")
            }
        }else{
            // no user found
            return res.status(HttpStatus.EXPECTATION_FAILED).json("user with this email not found please signup.")
        }
    })
})

  
module.exports = router