// pending, done(fulfil, resolve), nope(not, reject, nako)
//
// const promise = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     // resolve("Chaicode");
//     reject(new Error("Chaicode"));
//   }, 2000);
// });
// console.log(promise);

/*
setTimeout(() => {
  console.log(promise);
}, 3000);
*/

/* Different ways to write the same piece of fulfilling promises
promise.then(console.log).catch(console.log); 

promise.then(
  (data) => console.log(data),
  (error) => console.log(error),
); 

promise.then((data, error) => {
  console.log(data); 
  console.log(error); 
}); 


promise
.then((data) => console.log(data))
.catch((error) => console.log(error));

*/

// promise
//   .then((data) => {
//     newData = data.toUpperCase();
//     return newData;
//   })
//   .then((data) => {
//     return data + ".com";
//   })
//   .then(console.log)
//   .catch((error) => {
//     console.log(error);
//     return "Chai";
//   })
//   .then(console.log);

/*
`Promise.resolve(turant) creates a "Settled Promise object" that is already 
in the fulfilled state with the value "Turant". When you console.log(turant), 
you aren't logging the string itself, but rather the Promise instance wrapper, 
showing its internal state and result.
*/
// const turant = Promise.resolve("Turant");
// console.log(turant);

/*
In this code, Promise.all acts as a "manager" that fulfills each operation, if and only if there isn't any reject. 
In which case, it fails and crashes on the first error instance.
*/
// const allPromiseCheck1 = Promise.all([
//   Promise.resolve("Chai"), 
//   Promise.reject("Error"), 
//   Promise.resolve("Code"),
// ]); 
// allPromiseCheck1.then(console.log).catch(console.log); 
/*
In this code, Promise.allSettled acts as a "manager" that waits for every Promise in the array to finish, regardless of whether 
they succeed or fail. Unlike Promise.all (which short-circuits and crashes on the first error), allSettled is patient—it collects the outcome 
of every single task.
*/
// const allPromiseCheck2 = Promise.allSettled([
//   Promise.resolve("Chai"),
//   Promise.resolve("Code"),
//   Promise.reject("Error"),
// ]);

// allPromiseCheck2.then(console.log);

/*
.any() koi bhi ek success pkdta hai (koi bhi order mein aaye) and uspe operate krta hai
*/
// const allPromiseCheck3 = Promise.any([
//   Promise.reject("Error"),
//   Promise.resolve("Chai"),
//   Promise.resolve("Code"),
// ]);

// allPromiseCheck3.then(console.log).catch(console.log);

/*
The following is the modern, cleaner way to consume promises. Instead of chaining .then() and 
.catch(), async/await allows you to write asynchronous code that looks and behaves like synchronous code

The technical details: 
In your setTimeout, you called resolve twice and then reject. Technically, a Promise can only settle once. 
The moment resolve("Masterji") is called, the Promise transitions from pending to fulfilled. The subsequent resolve("Batman") and reject(...) calls are silently 
ignored by the JavaScript engine.
*/
const hPromise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("Masterji");
    resolve("Batman");
    reject(new Error("Masterji gayab ho gye!"));
  }, 3000);
});

async function nice(){
  try {
    const result = await hPromise;
    console.log(result);
  } catch (error) {
    console.log("Error aa gya ji", error.message);
  }
}

nice();
