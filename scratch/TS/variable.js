var colors = ["red", "blue", "green"];
var apples = 5;
console.log(apples);
var Car = /** @class */ (function () {
    function Car() {
    }
    return Car;
}());
var car = new Car();
var point = {
    x: 10,
    y: 20,
};
//Annoation for function
var logNumber = function (i) {
    console.log(i);
};
logNumber(5);
var foundWord = false;
for (var i = 0; i <= colors.length; i++) {
    if (colors[i] === 'green') {
        foundWord = true;
    }
}
console.log(foundWord);
var num = [-12, 12, -2];
var noAbove = false;
for (var i = 0; i <= num.length; i++) {
    if (num[i] < 0) {
        noAbove = num[i];
    }
}
console.log(noAbove);
