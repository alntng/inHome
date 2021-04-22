const fs = require("fs");

const readFile = (callback, returnJson = false, filePath) => {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      throw err;
    }

    callback(JSON.parse(data));
  });
};

const writeFile = (fileData, callback, filePath, encoding = "utf8") => {
  fs.writeFile(filePath, fileData, encoding, (err) => {
    if (err) {
      throw err;
    }

    callback();
  });
};

module.exports = { readFile, writeFile };
