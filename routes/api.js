/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const mongoose = require("mongoose");
const bookReview = require("../library").bookReview;

module.exports = function (app) {

  app.route('/api/books')
    .get(async function (req, res){
      // response will be array of book objects
      // json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      const thisThing = await bookReview.find();
      let sorted = thisThing.map((a, b) => {
        return {comments: a.comments, _id: a._id, title: a.title, commentcount: a.commentcount}
      });

      res.json(sorted);
    })
    
    .post(function (req, res){
      // both Book Title and [submit] New Book Title
      const id = new mongoose.Types.ObjectId();
      const title = req.body.title;

      if(!title){
        return res.json('missing required field title');
      }
      const newBookReview = new bookReview({
        comments: [],
        _id: id,
        title: title, 
        commentcount: 0,
      });

      newBookReview.save();

      res.json({_id: id, title: title});
      // maybe insert title and id into said library object, and then fill in blanks later?
      // response will contain new book object including atleast _id and title
    })
    
    .delete(async function(req, res){
      // if successful response will be 'complete delete successful'
      // located at drop down menu when you click on a books title
      
      let nothre = await bookReview.find().deleteMany()
      if(nothre.deletedCount > 0){
        return res.json("complete delete successful");
      }
    });


  app.route('/api/books/:id')
    .get(async function (req, res){
      let bookid = req.params.id;
      const keyboard = await bookReview.findById(bookid);
      if(!keyboard || keyboard == null){
        return res.json('no book exists')
      };
      res.json({_id: keyboard._id, title: keyboard.title, comments: keyboard.comments});
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(async function(req, res){
      // used with ID of past thing duh
      const bookid = req.params.id;
      const comment = req.body.comment;
      //eventually make if id exists and doesn't exist
      //push comments into comments array
      //give a comment count eventually

      const keyboard = await bookReview.findById(bookid);

      if(!keyboard){
        return res.json("no book exists");
      };

      if(!comment){
        return res.json("missing required field comment");
      };

      keyboard.comments.push(comment)
      keyboard.commentcount = keyboard.commentcount + 1

      keyboard.save();

      res.json(keyboard);
      //json res format same as .get
    })
    
    .delete(async function(req, res){
      // removes entire database of books
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      
      const keyboard = await bookReview.findByIdAndDelete(bookid);
      if(!keyboard){
        return res.json("no book exists");
      }
      return res.json("delete successful");
    });
  
};
