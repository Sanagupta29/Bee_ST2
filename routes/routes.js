const express = require('express');
const router = express.Router();
const Model = require('../model/model');;
const bcrypt = require('bcryptjs');
const joi = require('joi');
const jwt = require('jsonwebtoken');
const verify = require('../authVerify');

// console.log(Model);
const registerSchema = joi.object({
    username:joi.string().required(),
    age: joi.number().required(),
    email : joi.string().required().email(),
    password: joi.string().required().min(8), 
})

// Register user
router.post('/registerUser',async(req,res)=>{
    const emailExits = await Model.findOne({email:req.body.email})
    if(emailExits){
        res.status(400).send("Email already exits")
        return
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password,salt);

    const user = new Model({
        username :req.body.username,
        age : req.body.age,
        email : req.body.email,
        password:hashedPassword
    })

    try{
        const {error} = await registerSchema.validateAsync(req.body);
        const result = await user.save();
        res.status(200).send("User registered successfully");
    }catch(error){
        res.status(400).send(error)
    }
})

// Login user
const loginSchema = joi.object({
    email : joi.string().required().email(),
    password: joi.string().required().min(8),
})
router.post('/login',async(req,res)=>{

    try{
        const {error} = await loginSchema.validateAsync(req.body);
    }
    catch(error){
        res.status(400).send(error);
    }

   const user =  await Model.findOne({email : req.body.email});
//    console.log(user.email);
   if(!user){
    res.status(400).send("incorrect email id");
   }

   const validPassword = await bcrypt.compare(req.body.password,user.password);

   if(validPassword){
    // res.status(200).send("Login successful")
    const token = jwt.sign({_id : user._id},process.env.Token_Secret);
    res.header("auth-token",token).send(token);
   }
   else{
    res.status(400).send("incorrect password");
   }

})

router.get('/getAllPost',verify,(req,res) =>{
    res.send("All data sent successfully");
})
module.exports = router;

