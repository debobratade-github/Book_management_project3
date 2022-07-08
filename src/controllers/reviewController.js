// Create review 
const Validator= require("../controllers/bookController")
const reviewModel = require('../models/reviewModel')
const bookModel = require('../models/bookModel')

const mongoose = require('mongoose')
const isValidObjectId = function (value) {
      return mongoose.Types.ObjectId.isValid(value);
}

// Create review 
const createReviewByBookId = async function (req, res) {
    try {
        let bookId = req.params.bookId
        let requestBody = req.body

        if(!bookId) return res.status(400).send({status: false, message: "please give BookId"})
        if (!Validator.isValidObjectId(bookId)) {return res.status(400).send({ status: false, message: "bookId is not a valid Book id" })}
        

        let book = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!book) {return res.status(404).send({ status: false, message: "Book not found" })}

        if (!Validator.isValidBody(requestBody)) {
            return res.status(400).send({ status: false, message: "Invalid request parameter, please provide Review Details" })

        }
       
        const { reviewedBy, rating, review } = requestBody

       
        if (!rating) {
            return res.status(400).send({ status: false, message: " please provide rating" })
        }

        if (!(rating >= 1 || rating <= 5 ) && !(typeof(rating)==Number)) {
            return res.status(400).send({ status: false, message: ' please provide rating between 1 to 5 and type should be Number' })
        }

        let createReviewdata = {
            bookId: bookId,
            reviewedBy: reviewedBy,
            reviewedAt: Date.now(),
            rating: rating,
            review: review
        }
        let reviewdata = await reviewModel.create(createReviewdata)

        await bookModel.findOneAndUpdate({ _id: bookId, isDeleted: false }, { $inc: { reviews: 1 } })

        let newdata = await reviewModel.find(reviewdata).select({ isDeleted: 0, updatedAt: 0, createdAt: 0, __v: 0 })

        res.status(201).send({ status: true, data: newdata })
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message });
    }
}

module.exports.createReviewByBookId = createReviewByBookId

const updateReviews = async function (req, res) {
    try {
      let bookId = req.params.bookId;
      let reviewId= req.params.reviewId

      
      
// params
      if(!bookId) return res.status(400).send({status: false, message: "BookId is required"})
      if (!Validator.isValidObjectId(bookId)) {return res.status(400).send({status: false, message: "Invalid book id"});}
      
      if(!reviewId) return res.status(400).send({status: false, message: "BookId is required"})
      if (!Validator.isValidObjectId(reviewId)) {return res.status(400).send({status: false, message: "Invalid book id"});}
      
      let deletedBook = await bookModel.findOne({_id:bookId, isDeleted:true})
     if (deletedBook) {return res.status(400).send({status:false, msg: "Book has already been deleted."})}
     
     let reviewById= await reviewModel.findOne({_id: reviewId, isDeleted:true})
     if (reviewById) {return res.status(400).send({status:false, msg: "Review has already been deleted."})}

     let isReviewId= await reviewModel.findById({_id: reviewId})

     if (bookId != isReviewId.bookId) {
        return res.status(400).send({status:false, msg: "This review not belongs to this particular book."})
     }
// body       
      let requestBody = req.body;
      if (!Validator.isValidBody(requestBody)) {return res.status(400).send({ status: false, message: "There is no data is input for updating" });}
      
      let { review, rating, reviewedBy } = requestBody;
if(review){
      if (!typeof(review)==String) 
        return res.status(400).send({ status: false, message: "Valid review is required for updatation." });
      
    }
   let obj = {};
   obj.review = review;
if(typeof(rating)=="number"){
  
      if(rating>=1 && rating<=5){
        obj.rating=rating
    
  }
      else{
        return res.status(400).send({ status: false, message: ' please provide rating between 1 to 5 and type should be Number' })
      }
    }
    console.log(10)
     if(reviewedBy){
      if (!typeof(reviewedBy)==String) {
        return res.status(400).send({ status: false, message: "Valid reviewer name is required for updatation." });
      }
    }
    obj.reviewedBy = reviewedBy  

     const updatedTheReview = await reviewModel.findOneAndUpdate(
        { _id: req.params.reviewId },
        obj,
        { new: true }
      );

      return res.status(200).send({status: true,message: "Successfully updated review details",data: updatedTheReview});
      
    } catch (err) {
        console.log(err)
      res.status(500).send({status: false,Error: err.message, });
    }
  };



deleteReview = async function (req, res) {
    try {
        bookId = req.params.bookId;
        reviewId = req.params.reviewId;

        if (!isValidObjectId(bookId)) {
            return res.status(400).send({ statuts: false, message: "bookId is not valid" })
        }
        if (!isValidObjectId(reviewId)) {
            return res
                .status(400)
                .send({ statuts: false, message: "reviewId is not valid" });
        }
        let checkReviewId = await reviewModel.findOne({ _id: reviewId, bookId: bookId, isDeleted: false })
        if (!checkReviewId) {
            return res.status(400).send({ status: false, message: "no review of this bookId exist" })
        }

        let checkBookId = await bookModel.findOne({ _id: bookId, isDeleted: false })
        if (!checkBookId) {
            return res.status(400).send({ status: false, message: "book with given bookId does not exist" })
        }

        let updateReviewStatus = await reviewModel.findOneAndUpdate({ _id: reviewId }, { isDeleted: true }, { new: true });
        let updateReviewCount = await bookModel.findOneAndUpdate({ _id: bookId }, { reviews: checkBookId.reviews - 1 }, { new: true });

        res.status(200).send({ status: true, message: "review deleted", data: updateReviewStatus })
    } catch (err) {
        res.status(500).send({status:false, message:err.message})
    }
}

module.exports.deleteReview = deleteReview
module.exports.updateReviews = updateReviews