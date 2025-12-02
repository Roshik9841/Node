const asyncHandler = require('express-async-handler');
const bcrypt = require("bcrypt");
const User = require('../models/userModel');

// @descRegister a user
//@route POST /api/users/register
//access public
const registerUser = asyncHandler(async (req, res) => {
    const {username,email,password} = req.body;
    if(!username || !email || !password){
        res.status(400);
        throw new Error("All fields are mandatory");
    }
    const userAvailable = await User.findOne({email});
    if(userAvailable){
        res.status(400);
        throw new Error("User already registered");
    }
    //hash password
    const hashedPassword = await bcrypt.hash(password,10);
    console.log("Hashed password: "+hashedPassword);
    const createUser = await User.create({username,email,password:hashedPassword});
    console.log(`User created ${createUser}`);

    if(createUser){
        res.status(201).json({_id:createUser._id,email:createUser.email});
    }else{
        res.status(400);
        throw new Error("User data is not valid");
    }
 
});
//@desc login a user
//@router POST /api/users/login
//@access private
const loginUser = asyncHandler(async (req, res) => {
     res.json({message:"Login the user"})
});

//@desc Current user info
//@router POST /api/users/current
//@access private
const currentUser = asyncHandler(async(req,res)=>{

    res.json({message:"Current  user info"});

})
module.exports = {registerUser,loginUser,currentUser};