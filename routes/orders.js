const orderRoutes = (app, fs) => {
  const orderPath = "./data/orders.json";
  const orderLinesPath = "./data/order_lines.json";

  const currentOrders = require("../data/orders.json");
  const currentOrderLines = require("../data/order_lines.json");
  const currentCustomers = require("../data/customers.json");

  let orderId = Math.max(...currentOrders.map((order) => order.id));

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

  //READ
  app.get("/orders", (req, res) => {
    readFile((data) => {
      res.send(data);
    }, true);
  });

  //CREATE NEW ORDER
  app.post("/orders", (req, res) => {
    try {
      orderId++;

      //create new order
      readFile(
        (data) => {
          let customerIds = currentCustomers.map((customer) => customer.id);
          if (customerIds.includes(req.body.user_id)) {
            let newOrder = { id: orderId, user_id: req.body.user_id };

            data.push(newOrder);

            writeFile(
              JSON.stringify(data, null, 2),
              () => {
                res.status(200).send("new order added");
              },
              orderPath
            );
          } else {
            console.log("That customer does not exist");
            res.sendStatus(404);
          }
        },
        true,
        orderPath
      );

      //add to order_items if customer had an item in their cart
      if (req.body.item_id && req.body.qty) {
        readFile(
          (data) => {
            const { item_id, qty } = req.body;
            let newOrderLine = { order_id: orderId, item_id, qty };

            data.push(newOrderLine);

            writeFile(
              JSON.stringify(data, null, 2),
              () => {
                res.status(200).send("new order lines added");
              },
              orderLinesPath
            );
          },
          true,
          orderLinesPath
        );
      }
    } catch (err) {
      console.log(err);
    }
  });

  //MODIFY AN ORDER
  app.put("/orders/:id", (req, res) => {
    try {
      readFile(
        (data) => {
          const { item_id, qty } = req.body;
          let idx = 0;

          data.forEach((orderLine, i) => {
            if (
              orderLine.order_id === Number(req.params.id) &&
              orderLine.item_id === item_id
            )
              idx = i;
          });

          data[idx] = { ...data[idx], qty };
          if (qty <= 0) {
            data = [...data.slice(0, idx), ...data.slice(idx + 1)];
          }

          writeFile(
            JSON.stringify(data, null, 2),
            () => {
              res.status(200).send(`Order ${req.params.id} updated`);
            },
            orderLinesPath
          );
        },
        true,
        orderLinesPath
      );
    } catch (err) {}
  });
};

module.exports = orderRoutes;
