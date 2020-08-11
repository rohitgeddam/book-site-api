require('dotenv').config()
const mongoose = require("mongoose");
var slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const commentSchema = new mongoose.Schema({
    book: {
        type: mongoose.Schema.ObjectId,
        ref: 'Book'
    },

   chapter: 
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Chapter',
      },
   user: {

       type: mongoose.Schema.Types.ObjectId,
       ref: 'User'
    },

    content:{
        type: String,
        required: true,
    }

},{timestamps: true})

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
