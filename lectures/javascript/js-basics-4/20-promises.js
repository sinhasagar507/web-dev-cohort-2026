/*
### Event Loop Priority System
- **Synchronous tasks have the highest priority** and execute first, line by line
- **Microtask queue** (including promises) has the second highest priority
- **Macrotask queue** (including timers like setTimeout) has the lowest priority
- The call stack manages ongoing work and executes synchronous code
- Many interview questions focus on this priority system
*/
// console.log("Swastik");
// Promise.resolve("resolveed value").then((v) => {
//   console.log("Microtask ", v);
// });
// console.log("Avishek");

function boilWater(time) {
  return new Promise((res, rej) => {
    console.log("Krte h ji boil water");
    if (typeof time !== "number" || time < 0) {
      rej(new Error("ms must be in number and greater than zero"));
    }
    setTimeout(() => {
      res("Ubal gya");
    }, time);
  });
}

/*
2 tarike hain to utilize the above created Promise() object downstream. 
Either .then(), .catch() mechanism use kro ya async() await() ka utilization kro
koi bhi chlega 
*/
// boilWater(200)
//   .then((msg) => console.log("Resolved: ", msg))
//   .catch((err) => console.log("Rejected: ", err.message));

//   async function checkBoilStaus () {
//     try {
//     const resolveStatus = await boilWater(2000);
//     console.log(resolveStatus);
//     } catch(error) {
//       console.log("Error aa gya ji", error.message);
//     } 
//   }

//   checkBoilStaus();

function grindLeaves() {
  return Promise.resolve("Leaves grounded");
}

// 2nd parameter is dena is optional. So error ki zarurat nai hai 
function steepTea(time) {
  return new Promise((res) => {
    setTimeout(() => res("Steeped tea"), time);
  });
}

function addSugar(spoons) {
  return `Added ${spoons} sugar`;
}


// grindLeaves()
//   .then((val))