/*
new keyword use krne pe kya hota hai
Step-1: new use krne pe sbse pehle ek brand new {} bnta hai 
Step-2: {} ka prototype and function (idhr TataCar) ka prototype link kiya jaata hai
Step-3: this ko unn variables ka reference (jo bhi new se define kiye jaate hai) unka reference mil jaata hai. Bind this to new object (this-object binding)
Step-4: agr constructor/function explicitly object return nai krta hai, vo new ka kaam hai
Ye 4 steps hmesha hrr case mein follow honge.

`new` keyword ek shared memory mein operate krta hai
*/

function TataCar(chassisNumber, modelName) {
  
  this.chassisNumber = chassisNumber;
  
  this.modelName = modelName;
  this.fuelLevel = 100;
  
}

TataCar.prototype.status = function () {
  return `Tata ${this.modelName} #${this.chassisNumber} | Fuel: ${this.fuelLevel}`;
};

const car1 = new TataCar("MH-101", "Nexon");
const car2 = new TataCar("DL-202", "Harrier");

console.log(car1.modelName);
console.log(car2.modelName);
console.log(car1.status());
console.log(car2.status());

/*
This is not same as above
Here each instance is getting its own copy of method
Inko factory functions bolte hain
*/
function createAutoRickshaw(id, route) {
  return {
    id,
    route,
    run() {
      return `Auto ${this.id} running on ${this.route}`;
    },
  };
}

const auto1 = createAutoRickshaw("UP-1", "Lucknow-kanpu");
const auto2 = createAutoRickshaw("UP-2", "Agra-Mathura");

console.log(auto1.run());
console.log(auto2.run());
