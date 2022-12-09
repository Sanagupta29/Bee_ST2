const express = require('express');
//const { Model } = require('mongoose');
const routerB = express.Router();
const Model = require('../model/model2');

// post method
routerB.post('/createPost', async (req,res)=>{
    //res.send("Post created");
    const newPost = new Model({
        title : req.body.title,
        author : req.body.author,
        content : req.body.content,
    })
    // console.log(newPost)
    try{
        const result = await newPost.save();
        res.status(200).json(result)
    }catch(error){
      
        res.status(400).json({message : error.message})
    }
})

// get
routerB.get('/getAllPost', async (req,res)=>{
    //res.send("All POST DATA :-");

    try{
        const result = await Model.find();
        res.status(200).json(result);
    }catch(error){
        res.status(500).json({message : error.message});
    }
})

routerB.get('/getPost/:id',async (req,res)=>{
    try{
        const id = req.params.id;
        const result = await Model.findById(id);
        res.status(200).json(result);
    }catch(error){
        res.status(500).json({message : error.message});
    }

    // res.send(`post with id ${id}`);
})

//patch
routerB.patch('/editPost/:id',async (req,res)=>{
    try{
        const id = req.params.id;
        const newData  = req.body;
        const options = {new:true};
        const result = await Model.findByIdAndUpdate(id,newData,options);
        res.send(result);
    }catch(error){
        res.status(500).json({message : error.message});
    }
   // res.send(`post with id ${id}`);
})

//delete
routerB.delete('/deletePost/:id',async (req,res)=>{
    try{
        const id = req.params.id;
        const result = await Model.findByIdAndDelete(id);
        res.send(`delted title is ${result.title}`);
    }catch(error){
        res.status(500).json({message : error.message});
    }
    //res.send(`post with id ${id}`);
})

module.exports = routerB;