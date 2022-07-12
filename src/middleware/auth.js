// const userModel = require("../models/userModel")

const jwt = require("jsonwebtoken")
const bookModel = require("../models/bookModel")
const ObjectId=require("mongoose").Types.ObjectId

const isValidObjectId = function (data) {
    let stringId = data.toString().toLowerCase();
    if (!ObjectId.isValid(stringId)) {
        return false;
    }
  
    var result = new ObjectId(stringId);
    if (result.toString() != stringId) {
        return false;
    }
    return true;
  }
  

//❌❌❌❌❌❌❌❌❌❌=========== Authentication ==========❌❌❌❌❌❌❌❌❌❌//

const authentication = function(req, res, next){
    try{
        let token = req.headers["x-api-key"]
        if(!token){
            return res.status(401).send({status: false, message: "token not present"})
        }
        let decodedToken = jwt.verify(token, "functionUp-project-3", { ignoreExpiration: true, }, function (err, decoded) {
            if (err) { return res.status(400).send({ status: false, meessage: "token invalid" }) }
            else {
              if (Date.now() > decoded.exp * 1000) {
                return res.status(401).send({ status: false, msg: "Session Expired", });
              }
              req.decodedToken = decodedToken
            //   req.userId = decoded.userId;
            //   next();
            }
          });
        next();
    }

    catch(err){
        return res.status(500).send({status: false, message: err.message})
    }
}


//❌❌❌❌❌❌❌❌❌❌=========== Authorisation ==========❌❌❌❌❌❌❌❌❌❌//

// const authorization = async (req,res,next) => {
//     try {
//         let decodedToken = req.decodedToken
//         let bookId = req.params.bookId;
//         let book = await bookModel.findById(bookId)
//          if(!book) return res.status(404).send({
//             status:false,
//             message: "  The BOOK You entered does not exist in database  "
//          })

//          user = book.userId.toString();

//          if(user != decodedToken.userId){
//             return res.status(403).send({
//                 status:false,
//                 message:" Opps  You are not Athorised for this action  SORRY  "
//             })
//          }
//          next();

//     }
//     catch (error) {
//         console.log(error)
//         return res.status(500).send({status:false, message:error.message})
//     }
// };




const authorization = async function(req , res , next){
    try{
        
        let decodedToken = req.decodedToken
        let bookId = req.params.bookId
        if (!isValidObjectId(bookId)) {
                  return res
                    .status(400)
                    .send({ status: false, message: "bookId not valid" });
                }
        let book = await bookModel.findById(bookId)
        if(!book) return res.status(404).send({status : false , msg: "book is not present"})
        
        if(book.userId != decodedToken.userId) {  
        return res.status(403).send({status: false , msg:"Unauthorized user"})}
        else{
            req.book = book
            next()
        }
    }
    catch(err){
        res.status(500).send({status:false , msg: err.message})
    }
}


module.exports ={authentication,authorization}







































