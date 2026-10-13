console.log("1. Program Started");

setTimeout(() => {
  console.log("4. setTimeout callback executed");
}, 0);

Promise.resolve().then(() => {
  console.log("3. Promise callback executed");
});

console.log("2. Program Finished");

console.log("5. Event Loop demonstration completed");