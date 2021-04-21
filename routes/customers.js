const customerRoutes = (app, fs) => {
  // variables

  const dataPath = "./data/customers.json";
  const currentCustomers = require("../data/customers.json");

  let nextId = 0;
  currentCustomers.forEach((customer) => {
    nextId = Math.max(customer.id, nextId);
  });

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
    readFile((data) => {
      // add the new user
      req.body.id = ++nextId;
      data.push(req.body);

      writeFile(JSON.stringify(data), () => {
        res.status(200).send("new user added");
      });
    }, true);
  });

  // UPDATE
  app.put("/users/:id", (req, res) => {
    readFile((data) => {
      // add the new user
      const userIdx = data.filter(
        (customer) => customer.id === req.params["id"]
      );

      data[userIdx].name = req.body.name;
      //   data[userId] = req.body;

      writeFile(JSON.stringify(data, null, 2), () => {
        res.status(200).send(`users id:${userId} updated`);
      });
    }, true);
  });
};

module.exports = customerRoutes;
