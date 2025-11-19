 
 
 const http = require('http');

http.createServer(function(req,res){

    res.write("Welcome back");
    res.end();
}).listen(8080)