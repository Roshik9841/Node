const os = require("os");
const path = require("path");

console.log(path.sep);
const absolute = path.resolve(__dirname);
console.log(absolute);

const user = os.userInfo();
console.log(user);
