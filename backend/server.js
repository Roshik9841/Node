const express = require("express");
const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv").config();
const cors = require("cors");

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());

app.use("/api/data",require("./routes/dataRoute"));
connectDb();

app.listen(port,()=>{
    console.log("Server is running on port " + port);
})