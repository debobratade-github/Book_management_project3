const bookModel = require('../models/bookModel')

const {isValid, isValidBody, isValidObjectId} = require('../validation/validation')

const createBook = async function (req, res) {
  try
  {
    const bookData = req.body;
  if (!isValidBody(bookData)) {
    return res
      .status(400)
      .send({ status: false, message: "book details required" });
  }
    let { title, excerpt, userId, ISBN, category, subcategory, reviews,  isDeleted, releasedAt} = bookData;
    
    if (!isValid(title)) {
        return res.status(400).send({status:false, message:"Title is Required"})
    }
    if (!isValid(excerpt)) {
      return res
        .status(400)
        .send({ status: false, message: "excerpt is Required" });
    }
    if (!isValidObjectId(userId)) {
      return res
        .status(400)
        .send({ status: false, message: "correct userId is Required" });
    }
    if (!isValid(ISBN)) {
      return res
        .status(400)
        .send({ status: false, message: "ISBN is Required" });
    }
    if (!isValid(category)) {
      return res
        .status(400)
        .send({ status: false, message: "category is Required" });
    }
    if (!isValid(subcategory)) {
        return res.status(400).send({ status: false, message: "subcategory is required" });
    }
    if (!isValid(releasedAt)) {
        return res.status(400).send({ status: false, message: "releasing date required" });
    }
    
    reviews ? reviews : 0;
    isDeleted ? isDeleted : false;
    bookData.deletedAt = isDeleted ? new Date : null;

    let book = await bookModel.create(bookData);

        res.status(201).send({ status: true, message: "Success", data: book })
    } catch (err) {
        res.status(500).send({status:false, message: err.message })
    }
  
};

//////////////=============Delete by BookId================//////////////////

const deleteBook = async (req,res) => {
    
}



















