const express = require("express");

const router = express.Router();

router.route("/").get((req,res)=>{
    res.status(200).send("Get all contacts");
});

router.route("/:id").get((req,res)=>{
    const id = req.params.id;
    res.status(200).send("Get  contacts for "+id);
});


router.route("/").post((req,res)=>{
    res.status(200).send("Created contact");
});

router.route("/:id").put((req,res)=>{
    const id = req.params.id;
    res.status(200).send("update contacts for "+id);
});

router.route("/:id").delete((req,res)=>{
    const id = req.params.id;
    res.status(200).send("delete contacts for "+id);
});




module.exports = router;