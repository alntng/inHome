const { readFile, writeFile } = require("./utils");

const orderRoutes = (app, fs) => {
  const orderPath = "./data/orders.json";
  const orderLinesPath = "./data/order_lines.json";

  const currentOrders = require("../data/orders.json");
  const currentOrderLines = require("../data/order_lines.json");
  const currentCustomers = require("../data/customers.json");

  const { readFile, writeFile } = require("./utils");

  let orderId = Math.max(...currentOrders.map((order) => order.id));

  //READ
  app.get("/orders", (req, res) => {
    readFile(
      (data) => {
        res.send(data);
      },
      true,
      orderPath
    );
  });

  //CREATE NEW ORDER
  app.post("/orders", (req, res) => {
    try {
      orderId++;

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
                return;
              },
              orderLinesPath
            );
          },
          true,
          orderLinesPath
        );
      }

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
                res.status(200).send(`Order ${orderId} created`);
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
            res.status(400).send("Can not have a negative quantity");
          }

          writeFile(
            JSON.stringify(data, null, 2),
            () => {
              res
                .status(200)
                .send(
                  `Order ${req.params.id} updated: \n You now have ${qty} of item ${item_id} in your cart`
                );
            },
            orderLinesPath
          );
        },
        true,
        orderLinesPath
      );
    } catch (err) {
      console.log(err);
    }
  });

  //DELETE an item from an order
  //seperate route in case the user had multiply qty and wanted to remove in one go
  app.delete("/orders/:id", (req, res) => {
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

          data[idx] = { ...data[idx], qty: 0 };

          writeFile(
            JSON.stringify(data, null, 2),
            () => {
              res
                .status(200)
                .send(`Item ${item_id} removed from order ${req.params.id}`);
            },
            orderLinesPath
          );
        },
        true,
        orderLinesPath
      );
    } catch (err) {
      console.log(err);
    }
  });
};

module.exports = orderRoutes;
