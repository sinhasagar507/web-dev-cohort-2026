/*
1. The Node.js "Module" Wrapper
When you run a file in Node.js (e.g., node app.js), Node doesn't just run your code raw. It wraps your entire file inside a secret function that looks like this:
Because your code is technically inside this "wrapper function," and that function is called with module.exports as the context, this points to module.exports, which starts as an 
empty object {}.In a Node file: console.log(this) $\rightarrow$ {}
In a Node file: console.log(global) $\rightarrow$ <ref *1> Object [global]
*/
// console.log(this);


// function ranveerOnGlobalStage() {
//   return typeof this;
// }

// console.log(ranveerOnGlobalStage());

/*
In regular JS, if a function isn't part of an object, 'this' usually defaults to the window (global) object. 
This causes massive security and logic issues. In strict mode, `this` remains `undefined`.
*/
// function ranveerWithNoScript() {
//   return this;
// }
// console.log(ranveerWithNoScript());

// const bollywoodFilm = {
//   name: "Bajirao Mastani",
//   lead: "Ranveer",

//   introduce() {
//     return `${this.lead} performs in ${this.name}`;
//   },
// };

// const bollywoodFilm2 = {
//   name: "Dhurandhar",
//   lead: "Ranveer",

//   introduce() {
//     return `${this.lead} performs in ${this.name}`;
//   },
// };

// console.log(bollywoodFilm.introduce());
// console.log(bollywoodFilm2.introduce());

/*
Interview Question showcasing JS quirks
*/
// const filmDirector = {
//   name: "Sanjay Leela Bhansali",
//   cast: ["Ranveer", "Deepika", "Priyanka"],

//   announceCast() {
//     this.cast.forEach((actor) => {
//       console.log(`${this.name} introduces ${actor}`);
//     });
//   },
// };

// filmDirector.announceCast();

/*
`this` in arrow functions binds itself to the `lexically closest environment`. This means that `this` in an arrow function 
refers to the value of `this` in that function's closest enclosing context. 
This is a famous interview gotcha question
*/
// const filmSet = {
//   crew: "Spot boys",
//   prepareProps() {
//     console.log(`Outer this.crew: ${this.crew}`);

//     function arrangeChairs() {
//       console.log(`Inner this.crew: ${this.crew}`);
//     }
//     arrangeChairs();

//     const arrangeLights = () => {
//       console.log(`Arrow this.crew: ${this.crew}`);
//     };
//     arrangeLights();
//   },
// };

// filmSet.prepareProps();

// // Detached Methods
// //

// const actor = {
//   name: "Ranveer",
//   bow() {
//     return `${this.name} takes a bow`;
//   },
// };
// console.log(actor.bow());
// const detachedBow = actor.bow;

// console.log(detachedBow());

// const myfunctionOne = function () {
//   console.log(this);
// };

// const myfunctionTwo = () => {
//   console.log(this);
// };

// myfunctionOne();
// myfunctionTwo();


function srushti(idea) {
  console.log(`Heya!!! ${idea}`)
}
function sagar() {
  srushti('Machuu'); 
}

sagar(); 