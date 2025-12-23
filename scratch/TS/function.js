var add = function (a, b) {
    return a + b;
};
var subtract = function (a, b) {
    return a - b;
};
var profile = {
    name: "alex",
    age: 20,
    coords: {
        lat: 0,
        lng: 15,
    },
    setAge: function (age) {
        this.age = age;
    },
};
//object destructuring with annotation
var age = profile.age;
var _a = profile.coords, lat = _a.lat, lng = _a.lng;
//arrays
var carMakers = ["ford", "toyota", "chevy"];
var carsByMake = [
    ["F150", "F250"],
    ["Corolla", "borolla"],
    ["Camaro", "vet"],
];
var oldCivic = {
    name: "civic",
    year: 2000,
    broken: true,
    summary: function () {
        return "Name:".concat(this.name);
    }
};
var printVehicle = function (vehicle) {
    console.log("Name:".concat(vehicle.name));
    console.log("Year:".concat(vehicle.year));
    console.log("Broken:".concat(vehicle.broken));
    console.log(vehicle.summary());
};
printVehicle(oldCivic);
