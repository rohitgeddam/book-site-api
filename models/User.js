require('dotenv').config()
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    username: {
        required: [true, "username can't be blank"],
        match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
        type: String,
        lowercase: true,
        unique: true,
    },
    email: {
        type: String,
        lowercase: true,
        required: [true, "can't be blank"],
        match: [/\S+@\S+\.\S+/, 'is invalid'],
        unique: true,
    },
    avatar: {
        type: String,
    },
    hash: {
        type: String,
    },
    isAdmin: {
        type:Boolean,
        defult: false,
    },
    isAuthor: {
        type: Boolean,
        defult: false,
    },
    books: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Book"
        }
    ],
    chapters: [
        {
            book: {type: mongoose.Schema.Types.ObjectId, ref: 'Book'},
            chapter: {type: mongoose.Schema.Types.ObjectId, ref: 'Chapter'}
        },
    ],
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
  },{timestamps: true});

userSchema.methods.setPassword = function(password){
    this.hash = bcrypt.hashSync(password, 12)
    console.log("hash", this.hash)
}

userSchema.methods.validatePassword = function(password){
    return bcrypt.compareSync(password, this.hash);
}

userSchema.methods.getSignedJwt = function(){
    console.log('jwt sec', process.env.JWT_SECRET)
    return jwt.sign({ user: {_id: this._id}}, process.env.JWT_SECRET);
}

const User = mongoose.model('User', userSchema);

module.exports = User;
