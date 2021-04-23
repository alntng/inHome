const customerRoutes = (app, fs) => {
  const dataPath = "./data/customers.json";
  const currentCustomers = require("../data/customers.json");

  const { readFile, writeFile } = require("./utils");

  let userId = Math.max(...currentCustomers.map((customer) => customer.id));

  // READ
  app.get("/customers", (req, res) => {
    readFile(
      (data) => {
        res.send(data);
      },
      true,
      dataPath
    );
  });

  //   CREATE;
  app.post("/customers", (req, res) => {
    try {
      readFile(
        (data) => {
          // add the new user
          req.body = { id: ++userId, ...req.body };
          data.push(req.body);

          writeFile(
            JSON.stringify(data, null, 2),
            () => {
              res
                .status(200)
                .send(`Added new user: ${req.body.name}, ID# ${userId}`);
            },
            dataPath
          );
        },
        true,
        dataPath
      );
    } catch (err) {
      console.log(err);
    }
  });

  // UPDATE
  app.put("/customers/:id", (req, res) => {
    try {
      readFile(
        (data) => {
          let idx = 0;
          data.forEach((customer, i) => {
            if (customer.id === Number(req.params.id)) idx = i;
          });

          const oldName = data[idx].name;

          data[idx].name = req.body.name;

          writeFile(
            JSON.stringify(data, null, 2),
            () => {
              res
                .status(200)
                .send(`Updated from ${oldName} to ${req.body.name}`);
            },
            dataPath
          );
        },
        true,
        dataPath
      );
    } catch (err) {
      console.log(err);
    }
  });
};

module.exports = customerRoutes;
