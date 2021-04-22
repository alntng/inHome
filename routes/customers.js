const customerRoutes = (app, fs) => {
  // variables
  const dataPath = "./data/customers.json";
  const currentCustomers = require("../data/customers.json");
  const { readFile, writeFile } = require("./utils");

  let userId = Math.max(...currentCustomers.map((customer) => customer.id));

  // READ
  app.get("/customers", (req, res) => {
    readFile((data) => {
      res.send(data);
    }, true);
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
              res.status(200).send("new user added");
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

          data[idx].name = req.body.name;

          writeFile(
            JSON.stringify(data, null, 2),
            () => {
              res.status(200).send(`users id:${req.params.id} updated`);
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
