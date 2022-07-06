const mongoose = require('mongoose')
const validator = require('validator')
const userSchema = new mongoose.Schema({

    
        title: {
            type: String, 
            require : true,
            enum : ['Mr', 'Mrs', 'Miss']
        },


        name: {

            type : String,
            require: true
        },


        phone: {
            type: String, 
            require: true,
            unique: true
        },
        email: {
            type : String,
             required : true,
             unique : true,
             validate : {
             validator : validator.isEmail,
            message : "Not a valid email"}
        }, 


        password: {
            type : String,
            required : true,
             
          },



        address: {
          street:{ 
          type: String
         },
          city: {
          type: String
          },
          pincode: {
          type: String
         }
        },


      timestamps: true 
    
})

module.exports = mongoose.model('User', userSchema)