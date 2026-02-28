/*
 * Static Object methods used to extract data into arrays:
 * .keys() gets property names, .values() gets the data, 
 * and .entries() gets [key, value] pairs for easy iteration.
*/
const artifact = {
  name: "Obsidian Crown",
  era: "Ancient",
  value: 50000,
  material: "volcanic glass",
};

const keys = Object.keys(artifact);
const values = Object.values(artifact);
const entries = Object.entries(artifact);

console.log(keys);
console.log(values);
console.log(entries);

/*
The for...of loop structure is the most common way to loop over JS objects
*/
for (const [key, value] of Object.entries(artifact)) {
  console.log(` ${key}: ${value}`);
}

/*
Creating back object from entries in JS
*/
const priceList = [
  ["Obsidian Crown", 50000],
  ["Ruby Pendant", 30000],
  ["Iron Shield", 5000],
];

const priceObject = Object.fromEntries(priceList);
console.log(priceObject); 

/**
 * Object.freeze() makes an object "read-only": it prevents adding new 
 * properties, deleting existing ones, or changing their values. 
 * In non-strict mode, these attempts fail silently without throwing errors.
 */
const displayCase = {
  artifact: "Obsidian",
  location: "Hall A, Case 3",
  locked: true,
};

Object.freeze(displayCase);
delete displayCase.locked;
displayCase.newProp = "test";
console.log(displayCase);

/**
 * Object.seal() prevents adding or deleting properties, but allows 
 * modifying existing ones. Unlike Object.freeze(), you can still 
 * change the value of 'description' or 'verified' here.
 */
const catalogEntry = {
  id: "ART-001",
  description: "Ancient Crows",
  verified: true,
};

Object.seal(catalogEntry);


/**
 * Object.defineProperty() allows fine-grained control over property behavior:
 * 'writable: false' prevents value changes, 'enumerable: false' hides it from 
 * loops/keys, and 'configurable: false' prevents deletion or re-definition.
 */
const secureArtificats = { name: "Ruby Pendant" };
Object.defineProperty(secureArtificats, "catelogId", {
  value: "SEC-999",
  writable: false,
  enumerable: false,
  configurable: false,
});

console.log(secureArtificats.catelogId);
secureArtificats.catelogId = "HACKED";
console.log(secureArtificats.catelogId);

for (const [key, value] of Object.entries(secureArtificats)) {
  console.log(`${key} : ${value}`);
}

/**
 * Object.getOwnPropertyDescriptor() reveals the internal configuration (flags) 
 * of a specific property, showing if it is writable, enumerable, or 
 * configurable. For standard properties, these default to 'true'.
 */
const desc = Object.getOwnPropertyDescriptor(secureArtificats, "name");
console.log(desc);


// loop key points
// 
// 1. for()
// 2. while
// 3. do while
// 4. for...in
// 5. for...of
// 6. map, foreach, filter, reduce


// Just some testing
/**
 * Using Object.entries() to convert the 'marks' object into an array of 
 * [key, value] pairs, then applying .reduce() to iterate through and 
 * return the key (subject) with the highest numeric value.
 */
const testStudent = 
  {
    name: "Rahul",
    marks: { maths: 95, science: 23, english: 20, history: 90 }
  }; 

const rahulMarks = Object.entries(testStudent.marks); 
const maxSubject = rahulMarks.reduce((max, curr) => {return curr[1]>max[1] ? curr:max}, rahulMarks[0])[0]; 
console.log(maxSubject); 

/**
 * Uses array destructuring within .filter() and .map() to isolate specific 
 * parts of the [subject, mark] pairs. It filters for scores above 40 
 * and then extracts only the subject names into a new array.
 */
const passedSubjects = rahulMarks.filter(([_, marks]) => {
  return marks > 40; 
}).map(([subject, _]) => {
  return subject; 
}); 

const failedSubjects = rahulMarks.filter(([_, marks]) => {
  return marks < 40; 
}).map(([subject, _]) => {
  return subject; 
}); 

console.log(passedSubjects); 
console.log(failedSubjects); 