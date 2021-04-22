const customerRoutes = require("./customers");
const orderRoutes = require("./orders");
const itemRoutes = require("./items");

const appRouter = (app, fs) => {
  app.get("/", (req, res) => {
    res.send("welcome to the development api-server");
  });

  // run our user route module here to complete the wire up
  customerRoutes(app, fs);
  orderRoutes(app, fs);
  itemRoutes(app, fs);
};

module.exports = appRouter;
