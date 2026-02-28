/*
call and apply => basic chef (kitchen, samagri, sbb kuch dena pdega, immediately cook krta hai). Returns a direct value
bind => return a new function (delegation bhejta hai, kisi ko bhejunga)
bind, call and apply this ko override krte hain
*/


function cookDish(ingredient, style) {
  return `${this.name} prepares ${ingredient} in ${style} style !`;
}
console.log(cookDish());

const sharmaKitchen = { name: "Sharma jis Kitchen" };
const guptaKitchen = { name: "Gupta jis Kitchen" };

// If I have to pass individual argumments, I use call
console.log(cookDish.call(sharmaKitchen, "Paneer and spices", "Muglai"));


// If I have to pass an array, I will have to use apply
const guptaOrder = ["Chole kulche", "Punjabi Dhaba"];
console.log(cookDish.apply(guptaKitchen, guptaOrder));

const bills = [100, 30, 45, 50];

/**
 * Math.max.apply(null, bills) is the ES5 way to "spread" an array into individual arguments.
 * The 'null' refers to the 'this' context; since Math.max is a static utility, it doesn't 
 * need an object instance, so 'null' serves as a mandatory syntax placeholder.
 * Modern ES6 replaces this with the cleaner spread syntax: Math.max(...bills).
 */
Math.max.apply(null, bills);
Math.max(...bills);


/*
Bind ka main kaam hai ki vo function return krta hai. Bss pehle ye jaano
 */
function reportDelivery(location, status) {
  return `${this.name} at ${location}: ${status}`;
}

const deliveryBoy = { name: "Ranveer" };

console.log("Call: ", reportDelivery.call(deliveryBoy, "Lyari", "Ordered"));
console.log("Apply: ", reportDelivery.apply(deliveryBoy, ["Mars", "Pick up"]));
console.log("Bind: ", reportDelivery.bind(deliveryBoy, "Haridwar", "WHAT"));

const bindReport = reportDelivery.bind(deliveryBoy);
console.log(bindReport("Haridwar", "WHAT"));
