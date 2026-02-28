// console.log(brewPotion("Healing Herbs", 3));
function brewPotion(ingredient, dose) {
  return `Brewing potion with ${ingredient} (x${dose})... Potion ready`;
}

const mixElixir = function (ingredient) {
  return `Mixing elexir with ${ingredient} `;
};

// // no own 'this', no `arguments` object
const distilEssence = (ingredient) => {
  return `Mixing elexir with ${ingredient} `;
};

/**
 * The 'arguments' object is an "Array-like" object, not a true Array, meaning
 * it lacks built-in methods like .map() or .pop(). To use array features, 
 * convert it with Array.from() or use modern rest parameters (...args).
 */
function oldBrewingLogs() {
  console.log("Type: ", typeof arguments);
  console.log("Is Array: ", Array.isArray(arguments));
  const argsArray = Array.from(arguments);
  console.log(argsArray);
}

oldBrewingLogs("Sage", "Rosemary");

/**
 * Arrow functions do not have their own 'arguments' object; they inherit it 
 * from their lexical parent. Using 'arguments' here typically throws a 
 * ReferenceError unless nested. Use rest parameters (...args) instead.
 */
const arrowBrew = () => {
  try {
    console.log(arguments);
  } catch (e) {
    // console.log(e);
    console.log(e.message);
  }
};

arrowBrew("Sage", "Rosemary");
console.log("Program continue");

/*
Variables are scoped when using 'let' OR 'const' keywords. 
*/
let globalCount = 0;

function brewAndCount(name) {
  globalCount++;
}

// // HOF
function anotherFunctionForClass(brewAndCount) {
  return function newBrew() {
    //do something
  };
}

// //IIFE
// //

// //()()
// // (function () {})()(() => {})();
/*
The main use case of an IIFE (Immediately Invoked Function Expression) is to create a private scope and prevent "polluting" the global namespace.
Before modern JavaScript (ES6) introduced let, const, and modules, IIFEs were the primary way developers kept their code from breaking other 
scripts.
*/
const potionShop = (function () {
  let inventory = 0;

  return {
    brew() {
      inventory++;
      return `Brew potion #${inventory}`;
    },
    getStock() {
      return inventory;
    },
  };
})();
console.log(potionShop);
console.log(potionShop.brew());
console.log(potionShop.inventory);
console.log(potionShop.getStock());

/**
 * This is a Closure: the inner function 'displayName' maintains access to 
 * its lexical scope ('name' variable) even after 'makeFunc' has finished 
 * execution and returned.
 */
function makeFunc() {
  const name = "Mozilla";
  function displayName() {
    console.log(name);
  }
  return displayName;
}

const myFunc = makeFunc();
myFunc();