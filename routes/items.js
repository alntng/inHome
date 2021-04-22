const itemRoutes = (app, fs) => {
  const itemPath = "./data/items.json";
  const orderLinesPath = "./data/order_lines.json";
  const itemList = require("../data/items.json");

  const { readFile, writeFile } = require("./utils");

  //get all items
  app.get("/items", (req, res) => {
    readFile(
      (data) => {
        res.send(data);
      },
      true,
      itemPath
    );
  });

  //Top 3 ordered items
  app.get("/items/top3", (req, res) => {
    readFile(
      (data) => {
        const itemCount = {};

        data.forEach((orderLine) => {
          const { item_id, qty } = orderLine;

          if (!itemCount[item_id]) {
            itemCount[item_id] = qty;
          } else {
            itemCount[item_id] += qty;
          }
        });

        const getThreeLargestKeys = (obj) => {
          let k1, k2, k3;
          let v1, v2, v3;
          v1 = v2 = v3 = -Infinity;

          // O(1)
          let insertKey = function (key) {
            let value = obj[key]; // note 1

            if (value >= v1) {
              v3 = v2;
              v2 = v1;
              v1 = value;
              k3 = k2;
              k2 = k1;
              k1 = key;
            } else if (value >= v2) {
              v3 = v2;
              v2 = value;
              k3 = k2;
              k2 = key;
            } else if (value >= v3) {
              v3 = value;
              k3 = key;
            }
          };

          // O(n)
          for (var key in obj) {
            insertKey(key);
          }

          return [k1, k2, k3];
        };

        const topThreeIds = getThreeLargestKeys(itemCount).map((key) =>
          Number(key)
        );

        const filteredArray = itemList
          .filter((n) => {
            return topThreeIds.indexOf(n.id) !== -1;
          })
          .map((item) => item.name);

        res.status(200).send(filteredArray);
      },
      true,
      orderLinesPath
    );
  });
};

module.exports = itemRoutes;
