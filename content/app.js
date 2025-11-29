const os = require("os");
const path = require("path");

console.log(path.sep);
const absolute = path.resolve(__dirname);
console.log(absolute);

const user = os.userInfo();
console.log(user);

const person = {"name": "John", "age": 30, "city": "New York"};

const {name,age} = person;

console.log(name, age);



const {readFileSync, writeFileSync, write} = require("fs");

const first  = readFileSync("/first.txt",'utf8');
const second = readFileSync("./second.txt",'utf8');

console.log(first, second);

const first2 = writeFileSync("./result-sync.txt","huasdasd");

console.log(first2);