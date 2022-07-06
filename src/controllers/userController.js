const userModel = require("../models/userModel")

const isValid = (ele)=>{
    if(typeof ele == "string" && ele.trim().length ) return true;
    return false;
};


const createUser = async (req,res) =>{

    try {
        let getUsersData = req.body
        if(Object.keys(data).lenght==0) return res.status(404).send({
            status:false,
            msg:"Please Enter Data To Create User"
        })
        
        let {title,name,phone,email,password,address} =getUsersData
         
        if(!isValid(title)) return res.status(400).send({
            status:false,
            msg:"Please Enter Valid title"
        })
        if(!isValid(name)) return res.status(400).send({
            status:false,
            msg:"Plaese Enter Valid Name"
        });
        if(!isValid(phone)) return res.status(400).send({
            status:false,
            msg:"Please Enter Valid phone Number"
        });
        if(!isValid(email)) return res.status(400).send({
            status:false,
            msg:"Please Enter Valid Email"
        });
        if(!isValid(password)) return res.status(400).send({
            status:false,
            msg:"Please Enter Valid Password"
        });
        if(!isValid(address)) return res.status(400).send({
            status:false,
            msg:"Please Enter Valid Address"
        })


        let savedData = await userModel.create(getUsersData);
        res.status(201).send({
            status:true,  data: savedData, msg:"User Created Successfully"
        })

    } catch (error) {
        console.log(error)
        return res.status(500).send({status:false, msg:MessageChannel.error})
        
    }
}
module.exports.createUser = createUser