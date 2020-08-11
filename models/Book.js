require('dotenv').config()
const mongoose = require("mongoose");
var slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const bookSchema = new mongoose.Schema({
   title: {type:String, required: true},
   author: {type:String, required: true},
   genre: {type:String, required: true},
   totalChapters: {type:Number,default:0},
   synopsis:{type:String, default:''},
   slug: { type: String, slug: 'title',unique: true },

   chapters: [
      {
         type: mongoose.Types.ObjectId,
         ref: 'Chapter',
      }
   ]
},{timestamps: true})

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
