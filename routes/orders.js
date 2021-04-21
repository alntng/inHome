const orderRoutes = (app, fs) => {
  const orderPath = "./data/orders.json";
  const orderLinesPath = "./data/order_lines.json";

  const readFile = (callback, returnJson = false, filePath = orderPath) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        throw err;
      }

      callback(JSON.parse(data));
    });
  };

  const writeFile = (
    fileData,
    callback,
    filePath = orderPath,
    encoding = "utf8"
  ) => {
    fs.writeFile(filePath, fileData, encoding, (err) => {
      if (err) {
        throw err;
      }

      callback();
    });
  };

  //READ
  app.get("/orders", (req, res) => {
    readFile((data) => {
      res.send(data);
    }, true);
  });
};

module.exports = orderRoutes;
