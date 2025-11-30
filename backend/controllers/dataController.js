const asyncHandler = require("express-async-handler");
const Data = require("../models/dataModel");

const getDatas = asyncHandler(async(req,res)=>{
    const all = await Data.find();
    res.status(200).json(all);
});

const createData = asyncHandler(async(req,res)=>{
      const { name, age, address } = req.body;
    if (!name || !age || !address) {
    res.status(400);
    throw new Error('All fields are required');
  }
  const newData = await Data.create({ name, age, address });
  res.status(201).json(newData);
});

const getData = asyncHandler(async(req,res)=>{
    const id = await Data.findById(req.params.id);
    res.status(200).json(id);
});


const updateData = asyncHandler(async(req,res)=>{
    const id = await Data.findById(req.params.id);
    if(!id){
        res.status(500);
        throw new Error("Data not found");
    }
    const updatedData = await Data.findByIdAndUpdate(req.params.id,req.body,{new:true});
    res.status(200).json(updatedData);
});

const deleteData = asyncHandler(async(req,res)=>{
    const id = await Data.findById(req.params.id);
    if(!id){
        res.status(500);
        throw new Error("Data not found");
    }
    const deleteData = await id.remove();
    res.status(200).json({id:req.params.id});
});

module.exports = {getData,createData,getDatas,updateData,deleteData};