const userModel = require("../models/userModel")

                  const jwt = require("jsonwebtoken")

const checkEmail = require("email-validator");
// const bookModel = require("../models/bookModel");



const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    if (typeof value === "number") return false;
    return true;
  };
const isValidTitle = function (value) {
    return ["Mr", "Mrs", "Miss"].indexOf(value) != -1
};

//❌❌❌❌❌❌❌❌❌❌========= User Creation ========❌❌❌❌❌❌❌❌❌❌//

const createUser = async (req,res) =>{

    try {
        let getUsersData = req.body
        if(!Object.keys(getUsersData).lenght < 0) return res.status(404).send({
            status:false,
            msg:"🚫Please Enter Data To Create User🚫"
        })
        
        let {title,name,phone,email,password,address} =getUsersData
        if(!title ) return res.status(400).send({status: false, msg: "🚫Title is missing Please enter title😋🚫"});    
        if(!isValidTitle(title)) { 
        return res.status(400).send({status: false, msg: "🚫Please Enter Valid title bitween One of them 👉 'Mr','Mrs','Miss'🚫"});  
        } 
        const regexValidator = function(val){
            let regx = /^[a-zA-z]+([\s][a-zA-Z]+)*$/;
            return regx.test(val);
        }
        if(!(isValid(name) && regexValidator(name))) return res.status(400).send({
            status:false,
            msg:"🚫Plaese Enter Valid Name🚫"
        });

        const phoneRegex = /^[6-9]\d{9}$/gi;
        let usedPhone = await userModel.findOne({phone:phone})
        if(usedPhone){
            return res.status(400).send({
                status:false , msg: " Phone is allready Used Please  Use Another Phone"
        })
        }

        if(!(isValid(phone) && phoneRegex.test(phone))) return res.status(400).send({
            status:false,
            msg:"🚫Please Enter Valid Indian phone Number🚫"
        });
        let usedEmail = await userModel.findOne({email:email})
        if(usedEmail){
            return res.status(400).send({status:false, message:"email already in use"})
        }

        if(!(isValid(email) && checkEmail.validate(email))) return res.status(400).send({
            status:false,
            msg:"🚫Please Enter Valid Email🚫"
        });

        const checkPassword = /^[a-zA-Z0-9!@#$%^&*]{8,15}$/;

        if(!(isValid(password) && checkPassword.test(password))) return res.status(400).send({
            status:false,
            msg:"🚫Please Enter Valid Password Minumum 8 Character and Maximum 15 🚫"
        });
        if(!(address)) return res.status(400).send({
            status:false,
            msg:"🚫Please Enter Valid Address🚫"
        })


        let savedData = await userModel.create(getUsersData);
        res.status(201).send({
            status:true,  message:"User Created Successfully", data: savedData
        })

    } 
    catch (error) {
        console.log(error)
        return res.status(500).send({status:false, msg:error.message})
        
    }
};


//❌❌❌❌❌❌❌❌❌❌=========== User Login ==========❌❌❌❌❌❌❌❌❌❌//

const loginUser = async (req,res)=> {
    try {
          let {email,password} = req.body
         if(!email)  return res.status(400).send({
            status:false,
            msg:" ❌ ${email} is not Correct Please  Provide Correct Email to Login ❌"
         });
         if(!password) return res.status(400).send({
            status:false,
            msg: "❌ ${password} is not Correct please provide Correct Password to Login ❌"
         })

        let  user = await userModel.findOne({email:email,password:password});
        if(!user) return res.staus(400).send({
            status:false,
            msg:"❌Email or ❌Password is incorrect please enter valid email and password"
        });

        let token = jwt.sign({
            userId : user._id,
            // exp:"Story",
            // iat:"abcd",
                  projrct : 3,
                       group : "group20"
        }, `functionUp-project-3`
        ) ;
        res.setHeader('x-api-key' , token)
        console.log(token)
        return res.status(200).send({
            status:true, data: token,
            msg:"✔️🙂User Loggedin Successfully✔️🙂"
        });

    } catch (error) {
        console.log(error)
        return res.status(500).send({status:false, msg:error.message})
    }
};


module.exports = {createUser,loginUser}