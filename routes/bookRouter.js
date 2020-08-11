var express = require('express')
var router = express.Router()
const HttpStatus = require('http-status-codes');

const Book = require('../models/Book')
const Chapter = require('../models/Chapter')
const Comment = require("../models/Comment")

const authenticate = require("../auth/config");



//create a book
router.post('/new',authenticate,function(req,res){
    const user = req.user;
    
    const {
        title,
        author,
        genre,
        totalChapters,
        synopsis,
    } = req.body;
    if(user.isAdmin || user.isAuthor){
        const newBook = new Book({
            title,author,genre,totalChapters,synopsis
        })
        newBook.save(function(err,book){
            if(err) return res.json("error")
            else{
                user.books.push(newBook._id)
                res.json(book)
            }
        })
    }
    else{
        res.json("not authorized. you are not an admin")
    }
  
})

router.get('/',authenticate,function(req,res){
    // get all books;
    Book.find(function(err,books){
        if(err) return res.json(err)
        res.json(books);
    })
})

router.get('/:book_slug',authenticate, function(req,res){
    const bookSlug = req.params.book_slug
    Book.findOne({slug: bookSlug}).populate('chapters').exec( function(err,book){
        if(err) return res.json(err);
        res.json(book);
    })
})

router.get('/:bookId',authenticate, function(req,res){
    const bookId = req.params.bookId
    Book.findById(bookId).populate('chapters').exec(function(err,book){
        if(err) return res.json(err);
        res.json(book);
    })
})

//chaapter
router.post('/:book_slug/chapter/new',authenticate, function(req,res){
    const bookSlug = req.params.book_slug;
    const {title, summary} = req.body;
    Book.findOne({slug: bookSlug}, function(err, book){
        if(err) return res.json(err);
        const newChapter = new Chapter({
            title,summary
        })
        newChapter.book = book._id
        book.chapters.push(newChapter._id)
        book.save(function(err, book){
            if(err) return res.json(err);
            newChapter.save(function(err, newChapter){
                if(err) return res.json(err);
                //save chapter to booklist
                res.json(newChapter);
            })
        })
        
    })
})

router.get('/:book_slug/chapter/:chapter_slug',authenticate, function(req, res){
    const {bookSlug, chapter_slug} = req.params;
    Chapter.findOne({slug: chapter_slug}).populate('book').populate('comments').exec(function(err, result){
        if(err) return res.json(err);
        return res.json(result)
    })
})


router.post('/:book_slug/chapter/:chapter_slug/comments/new', authenticate, function(req,res){
    const {book_slug, chapter_slug} = req.params;
    const {content} = req.body;
    const user = req.user;
    Book.findOne({slug: book_slug}, function(err, book){
        if(err) res.json(err)
        Chapter.findOne({slug: chapter_slug},function(err, chapter){

            const newComment = new Comment({content})
            newComment.book = book._id;
            newComment.chapter = chapter._id;
            newComment.user = user._id;
            chapter.comments.push(newComment._id)
            chapter.save(function(err,chapter){
                if(err) return res.json(err);

                newComment.save(function(err, comment){
                    if(err) res.json(err);
                    res.json(comment)
                })
            })
        })
    })
})


router.get('/:book_slug/chapter/:chapter_slug/comments/:commentId', authenticate, function(req,res){
    const {bookSlug, chapter_slug, commentId} = req.params;
    const user = req.user;
    Comment.findOne({slug: chapter_slug}).populate('book').populate('chapter').populate('user').exec(function(err, comment){
        if(err) res.json(err);
        return res.json(comment);
    })
})



module.exports = router