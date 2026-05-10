/*
Prototype ka sbse major kaam kya hai? Inheritance ka hai? Basically kehta hai ki ye saari properties mujhe 
transfer krdo. 
*/
const prithviraj = {
  name: "Prithviraj",
  generation: "grandfather",
  cookTraditionalDish() {
    return `${this.name} cooks an ancient family recipe`;
  },
};

/* 
Apna kamaya hua hai? Nai hai. Isiliye console.log(raj) ek null value return krta hai. 
*/
const raj = Object.create(prithviraj);
raj.name = "Raj";
raj.generation = "father";
raj.runBusiness = function () {
  return `${this.name} runs the family business`;
};
console.log(raj);

/*
Prototypal Inheritance in action
*/
const ranbir = Object.create(raj);
ranbir.name = "ranbir";
ranbir.generation = "son";
ranbir.makeFilm = function () {
  return `${this.name} directs blockbustur movies`;
};

console.log(ranbir.makeFilm());
console.log(ranbir.runBusiness());
console.log(ranbir.cookTraditionalDish());


/*
A polyfill is a piece of code used to provide modern functionality to older browsers that do not natively support it. 
Aur main whi cheez yahan observe krr rha huin. 

Interview ka question in JS
  - Implement your own map
  - Implement your own reduce 
  - Implement your own forEach
*/

Array.prototype.last = function () {
  return this[this.length - 1];
};

Array.prototype.hitesh = "hitesh"


console.log([1, 2, 3].hitesh)

String.prototype.upperCase = function () {
  
}

console.log([1, 2, 3].last());
console.log(["Ani", "hitesh", "Akash"].last());


Array.prototype.mapTwo = function () {
  this
}