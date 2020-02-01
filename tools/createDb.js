/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");
const sampleData = require("./sampleData");

const { dictionaries, entries } = sampleData;
const data = JSON.stringify({ dictionaries, entries });
const filepath = path.join(__dirname, "db.json");

fs.writeFile(filepath, data, function (err) {
  err ? console.log(err) : console.log("Mock DB created.");
});
