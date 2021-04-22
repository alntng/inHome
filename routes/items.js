const itemRoutes = (app, fs) => {
  const itemPath = "./data/items.json";
  const orderLinesPath = "./data/order_lines.json";

  const { readFile, writeFile } = require("./utils");

  app.get("/items", (req, res) => {
    readFile(
      (data) => {
        res.send(data);
      },
      true,
      itemPath
    );
  });
};

module.exports = itemRoutes;
