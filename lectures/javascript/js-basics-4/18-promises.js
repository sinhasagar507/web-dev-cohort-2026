/*
"Callback Hell" - welcome to the special pyramid of doom. This is how 
we used to handle asynchronous sequences before Promises arrived to save our sanity.

What's happening behind the scenes? 
- In this code, you are nesting functions inside other functions to enforce a 
specific order of operations. Since `setTimeOut` is asynchronous, the JS engine moves it to 
the Web APIs container. When the timer hits 100s, the callback is pushed to the Callback Queue 
(or Task Queue). The Event Loop waits for the Call Stack to be empty before pushing that callback 
back into execute. 
*/

/*
Explain every component of the function over here:

function prepareOrderCB(dish, cb) {

setTimeout(() => cb(null, { dish, status: "prepared" }), 100);

}

1. The Function Declaration: prepareOrderCB(dish, cb)
dish: This is a standard parameter. It is the data the function needs to start its job (e.g., "Biryani").

cb (The Callback): This is the most critical part. In JavaScript, functions are "First-Class Citizens," meaning you can pass a function into another function as an argument. cb is a placeholder for a function that will be executed later, once the task is finished.

2. The Asynchronous Trigger: setTimeout(...)
What it does: This is a Web API (in browsers) or a C++ API (in Node.js). It tells the JavaScript engine: "Don't wait for this. Set a timer for 100ms and move on to the next line of code."

Behind the Scenes: The setTimeout is popped off the Call Stack immediately. The actual "waiting" happens outside the main execution thread.

3. The Anonymous Arrow Function: () => cb(...)
This is the "wrapper" function that the setTimeout timer holds onto.

The Execution: Once the 100ms expires, this arrow function is pushed into the Task Queue. When the Call Stack is empty, the Event Loop pushes it onto the stack to be executed.

4. The Callback Execution: cb(null, { dish, status: "prepared" })
This follows the Error-First Pattern:

null: The first argument is reserved for an error. Since the "preparation" succeeded, we pass null to signal that no error occurred.

{ dish, status: "prepared" }: The second argument is the data. We are creating a new object on the fly using Shorthand Property Notation (where dish is the same as dish: dish).

The "Hidden" Component: The Closure
Even though the prepareOrderCB function finishes executing almost instantly, the internal arrow function "remembers" the dish variable. This is thanks to Closures—the inner function keeps a reference to its outer scope's variables so it can use them 100ms later.

Would you like me to show you how to "Promisify" this exact function so you can use it with async/await?

*/
function prepareOrderCB(dish, cb) {
  setTimeout(() => cb(null, { dish, status: "prepared" }), 100);
}
function pickupOrderCB(order, cb) {
  setTimeout(() => cb(null, { ...order, status: "picked-up" }), 100);
}
function deliverOrderCB(order, cb) {
  setTimeout(() => cb(null, { ...order, status: "delivered" }), 100);
}

prepareOrderCB("Biryani", (err, order) => {
  if (err) return console.log(err);
  pickupOrderCB(order, (err, order) => {
    if (err) return console.log(err);
    deliverOrderCB(order, (err, order) => {
      if (err) return console.log(err);
      console.log(`${order.dish}: ${order.status}`);
    });
  });
});
