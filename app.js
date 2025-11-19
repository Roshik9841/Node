 
 
//  const http = require('http');

// http.createServer(function(req,res){

//     res.writeHead(200,{'Content-Type':'text/html'});
//     res.write("Welcome back");
//     res.end();
// }).listen(8080)


const express = require('express');

const app = express();

app.get('/',(req,res)=>{
    res.send("Welcome to Express js");
})


app.get('/alien',(req,res)=>{
    res.send("Hi I am alien");
})

app.listen(9000,(req,res)=>{
    console.log("Server is running on port 9000");
});