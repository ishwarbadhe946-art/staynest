const fs = require("fs");

const filePath = "03-file-system/hostel-data.txt";

const hostelData = `
StayNest PG & Hostel Finder

Hostel Name: NestView Premium PG
Location: Andheri East, Mumbai
Rent: ?8500
Type: PG
Availability: Available
`;

console.log("Creating hostel information file...");

fs.writeFileSync(filePath, hostelData);

console.log("File created successfully.");

const data = fs.readFileSync(filePath, "utf8");

console.log("\n--- Hostel Information ---");
console.log(data);

const updatedData = data + `
Hostel Name: UrbanStay Student Hostel
Location: Powai, Mumbai
Rent: ?6500
Type: Hostel
Availability: Available
`;

fs.writeFileSync(filePath, updatedData);

console.log("File updated successfully.");

fs.appendFileSync(
  filePath,
  "\nStayNest provides comfortable accommodation for students."
);

console.log("Additional information appended successfully.");

console.log("\n--- Final File Content ---");

const finalData = fs.readFileSync(filePath, "utf8");

console.log(finalData);
