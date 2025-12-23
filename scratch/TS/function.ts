const add = (a: number, b: number) => {
  return a + b;
};

const subtract = (a: number, b: number): number => {
  return a - b;
};

const profile = {
  name: "alex",
  age: 20,
  coords: {
    lat: 0,
    lng: 15,
  },
  setAge(age: number): void {
    this.age = age;
  },
};

//object destructuring with annotation
const { age }: { age: number } = profile;

const {
  coords: { lat, lng },
}: { coords: { lat: number; lng: number } } = profile;

//arrays

const carMakers: string[] = ["ford", "toyota", "chevy"];

const carsByMake: string[][] = [
  ["F150", "F250"],
  ["Corolla", "borolla"],
  ["Camaro", "vet"],
];
type Vehicle = {
  name: string;
  year: number;
  broken: boolean;
  summary():string;
};
const oldCivic = {
  name: "civic",
  year: 2000,
  broken: true,
  summary():string{
    return `Name:${this.name}`;
  }
};

const printVehicle = (vehicle: Vehicle): void => {
  console.log(`Name:${vehicle.name}`);
  console.log(`Year:${vehicle.year}`);
  console.log(`Broken:${vehicle.broken}`);
  console.log(vehicle.summary());
};

printVehicle(oldCivic);