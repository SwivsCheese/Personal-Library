const mongoose = require('mongoose');
const { Schema } = mongoose;

const BookReviewSchema = new Schema({
    comments: Array,
    _id: String,
    title: String, 
    commentcount: Number
});

const bookReview = mongoose.model("bookReview", BookReviewSchema);

exports.bookReview = bookReview;
