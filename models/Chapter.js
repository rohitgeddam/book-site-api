require('dotenv').config()
const mongoose = require("mongoose");
var slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const chapterSchema = new mongoose.Schema({
   title: {type:String, required: true},
   summary: {type:String, default:''},
   book:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
   },
   slug: { type: String, slug: 'title',unique: true},
   comments: [
      {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Comment'
      }
  ]

},{timestamps: true})

const Chapter = mongoose.model('Chapter', chapterSchema);

module.exports = Chapter;
