// jwt
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

const passport = require('passport');
const HttpStatus = require('http-status-codes');

//models
const User = require('../models/User');
// jwt setup
const jwt_options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
}
const verify = (payload, done) => {
    User.findOne({_id: payload.user._id}, function(err, user){
        if(err){
            return done(err, false);
        }
        if(user) {
            return done(null, user);
        }
        else {
            return done(null, false);
        }
    })
}

passport.use(new JwtStrategy(jwt_options, verify))

const authenticate = (req, res, next) => {
  return passport.authenticate('jwt', {session: false}, (err,user) => {
      if(err) return res.status(HttpStatus.EXPECTATION_FAILED).json("error")
      
      if(user){
          req.user = user;
          next();
      }
      else{
          return res.status(HttpStatus.EXPECTATION_FAILED).json("no user found")
      }
  })(req,res)

}


module.exports = authenticate