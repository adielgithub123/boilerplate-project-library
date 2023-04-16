/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI)
  .then(console.log("Berhasil konek database"))
  .catch(error => console.log(error))

const bookSchema = new mongoose.Schema({
  title: String,
  comments: [String]
})
const Book = mongoose.model('Book', bookSchema);


module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      Book.find({})
        .then(books => {
          // const newArray = books.map(book => ({ ...book }));
          books.forEach(book => {
            book._doc['commentcount'] = book['comments'].length;
          });
          res.send(books)
        })
        .catch(err => res.send(err))
    })
    
    .post(function (req, res){
      //response will contain new book object including atleast _id and title
      let title = req.body.title;
      if(title===null){
        res.send("missing required field title")
      }
      else{
        Book.create({
          title
        })
          .then((data)=>{
            delete data._doc.comments;
            delete data._doc.__v;
            res.send(data)
          })
          .catch(err => res.send(err))
      }
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      Book.deleteMany({})
        .then(data => res.send("complete delete successful"))
        .catch(err => res.send(err))
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      
      if (mongoose.Types.ObjectId.isValid(bookid)) {
        Book.findById(bookid)
          .then(book => {
            if(book===null){
              res.send("no book exists");
            }
            else{
              book._doc['commentcount'] = book['comments'].length;
              res.send(book)
            }
          })
          .catch(err => res.send(err))
        //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      }
      else{
        res.send("no book exists");
      }
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      if(bookid==""){
        res.send("missing required field title");
      }
      else if(comment==""){
        res.send("missing required field comment");
      }
      else if (mongoose.Types.ObjectId.isValid(bookid)) {
        Book.findByIdAndUpdate(bookid, { $push: { comments: comment } }, { new: true })
          .then(updatedBook => {
            if(updatedBook===null){
              res.send("no book exists");
            }
            else{
              updatedBook._doc['commentcount'] = updatedBook['comments'].length;
              res.send(updatedBook)
            }
          })
          .catch(err => res.send(err))
        //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      }
      else{
        res.send("no book exists");
      }
      //json res format same as .get
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      if (bookid == "") {
        res.send({ "error": "missing _id" })
      }
      else {
        if (mongoose.Types.ObjectId.isValid(_id)) {
          Issue.findByIdAndDelete({_id: _id})
            .then((deletedBook) => {
              if(deletedBook===null){
                res.send("no book exists")
              }
              else{
                res.send("delete successful")
              }
            })
            .catch((error) => {
              console.error(error);
            });
        } else {
          res.send("no book exists")
        }
      }
    });
  
};
