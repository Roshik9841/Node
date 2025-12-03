const asyncHandler = require('express-async-handler');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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
    const {email,password} = req.body;
    if(!email || !password){
        res.status(400);
        throw new Error("All fields are mandatoyr");
    }

    const user = await User.findOne({email});
    //compare password with hashed password
    if(user && (await bcrypt.compare(password,user.password))){
        const accessToken = jwt.sign({        //kk pathauni bhanera yesma lekhxa
            user:{        
                username:user.username,
                email:user.email,
                id:user.id,
            },
        },process.env.ACCESS_TOKEN_SECRET,{expiresIn:"1m"});           //yo env bata token ko pw leko ani kati time paxi expire hunxa bhanera leko
        res.status(200).json({accessToken});
    }else{
        res.status(401);
        throw new Error("Email or password is not valid");
    }
});

//@desc Current user info
//@router POST /api/users/current
//@access private
const currentUser = asyncHandler(async(req,res)=>{

    res.json(req.user);

})
module.exports = {registerUser,loginUser,currentUser};