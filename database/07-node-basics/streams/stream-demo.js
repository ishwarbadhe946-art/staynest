const fs = require("fs");

const inputFile = "05-streams/input.txt";
const outputFile = "05-streams/output.txt";

console.log("========== NODE.JS STREAM DEMONSTRATION ==========");

const readStream = fs.createReadStream(inputFile, {
  encoding: "utf8",
  highWaterMark: 50
});

const writeStream = fs.createWriteStream(outputFile);

readStream.on("data", (chunk) => {
  console.log("\nReceived Chunk:");
  console.log(chunk);

  writeStream.write(chunk);
});

readStream.on("end", () => {
  console.log("\nAll data has been read successfully.");

  writeStream.end(() => {
    console.log("Data written successfully to output.txt.");
  });
});

readStream.on("error", (error) => {
  console.error("Read Stream Error:", error.message);
});

writeStream.on("error", (error) => {
  console.error("Write Stream Error:", error.message);
});