const colors: string[] = ["red", "blue", "green"];
const apples:number =5;
console.log(apples);
class Car {}
let car: Car = new Car();

let point: { x: number; y: number } = {
  x: 10,
  y: 20,
};
//Annoation for function
const logNumber: (i: number) => void = (i: number) => {
  console.log(i);
};
logNumber(5);

let foundWord:boolean = false;
for(let i=0;i<=colors.length;i++){
    if(colors[i]==='green'){
        foundWord=true;
    }
}
console.log(foundWord);
let num = [-12,12,-2];
let noAbove: number[] | boolean=false;

for(let i=0;i<=num.length;i++){
    if(num[i]<0){
        noAbove =num[i];
    }
}

console.log(noAbove);