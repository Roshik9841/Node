// @desc Get all contacts
// @route GET /api/contacts
// @access public


const getContacts = ((req,res)=>{
    res.status(200).json("Get all contacts");
});

// @desc Get  contacts
// @route GET /api/contacts
// @access public


const getContact = ((req,res)=>{
    const id = req.params.id;
    res.status(200).json("Get  contacts for "+id);
});


// @desc Create new contacts
// @route Get /api/contacts
// @access public


const createContact = ((req,res)=>{
    console.log("The req body is", req.body);
    const{name,email,phone}  = req.body;
    if(!name || !email || !phone){
        res.status(400);
        throw new Error("All fields are mandatory!");
    }
    res.status(201).json("Created contact");
});

// @desc update  contacts
// @route PUT /api/contacts
// @access public

const updateContact = ((req,res)=>{
    const id = req.params.id;
    res.status(200).json("update contacts for "+id);
});

// @desc delete  contacts
// @route DELETE /api/contacts
// @access public

const deleteContact = ((req,res)=>{
    const id = req.params.id;
    res.status(200).json("delete contacts for "+id);
});

module.exports = {getContact,createContact,getContacts,updateContact,deleteContact};