// @desc Get all contacts
// @route GET /api/contacts
// @access public


const getContacts = ((req,res)=>{
    res.status(200).send("Get all contacts");
});

// @desc Get  contacts
// @route GET /api/contacts
// @access public


const getContact = ((req,res)=>{
    const id = req.params.id;
    res.status(200).send("Get  contacts for "+id);
});


// @desc Create new contacts
// @route Get /api/contacts
// @access public


const createContact = ((req,res)=>{
    res.status(201).send("Created contact");
});

// @desc update  contacts
// @route PUT /api/contacts
// @access public

const updateContact = ((req,res)=>{
    const id = req.params.id;
    res.status(200).send("update contacts for "+id);
});

// @desc delete  contacts
// @route DELETE /api/contacts
// @access public

const deleteContact = ((req,res)=>{
    const id = req.params.id;
    res.status(200).send("delete contacts for "+id);
});

module.exports = {getContact,createContact,getContacts,updateContact,deleteContact};