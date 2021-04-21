const customerRoutes = (app, fs) => {
  // variables

  const dataPath = "./data/customers.json";
  const currentCustomers = require("../data/customers.json");

  let userId = Math.max(...currentCustomers.map((customer) => customer.id));

  const readFile = (callback, returnJson = false, filePath = dataPath) => {
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
    filePath = dataPath,
    encoding = "utf8"
  ) => {
    fs.writeFile(filePath, fileData, encoding, (err) => {
      if (err) {
        throw err;
      }

      callback();
    });
  };

  // READ
  app.get("/customers", (req, res) => {
    readFile((data) => {
      res.send(data);
    }, true);
  });

  //   CREATE;
  app.post("/customers", (req, res) => {
    try {
      readFile((data) => {
        // add the new user
        req.body = { id: ++userId, ...req.body };
        data.push(req.body);

        writeFile(JSON.stringify(data, null, 2), () => {
          res.status(200).send("new user added");
        });
      }, true);
    } catch (err) {
      console.log(err);
    }
  });

  // UPDATE
  app.put("/customers/:id", (req, res) => {
    try {
      readFile((data) => {
        let idx = 0;
        data.forEach((customer, i) => {
          if (customer.id === Number(req.params.id)) idx = i;
        });

        data[idx].name = req.body.name;

        writeFile(JSON.stringify(data, null, 2), () => {
          res.status(200).send(`users id:${req.params.id} updated`);
        });
      }, true);
    } catch (err) {
      console.log(err);
    }
  });
};

module.exports = customerRoutes;
