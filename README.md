# Alan Tang's RESTful inHome API

**Installation**<br/>
`git clone` the repo to your local machine

After git cloning the repo, simply run `npm install` which should install the following NPM packages

- Express
- Body Parser
- Nodemon

From there, `npm start` will start your development server on Port 3001, or whichever port you have specified in the **_server.js_** file

## Requests

For testing these calls, I used Postman, however use what ever API tool you prefer

**Create a Customer**<br/>
Route: http://localhost:3001/customers<br/>
Request: POST<br/>
req.body: `{"name":"New Customer Name"}`<br/>

_The customer's ID will be auto generated and assigned to the new customer_<br/>

**Update a customer's name**<br/>
Route: http://localhost:3001/customers/:id<br/>
Request: PUT<br/>
req.body: `{"name":"Modified Customer Name"}`<br/>

**Create an order for a customer**<br/>
Route: http://localhost:3001/orders<br/>
Request: POST<br/>
req.body:`{"user_id": num, "item_id": num, "qty": num }`<br/>

_item_id_ and _qty_ are optional key/value pairs to include in the req.body when creating a new order. Whenever a new order is created, an entry is made into _orders.json_. If _item_id_ and _qty_ are included, respective entries will made written into _order_lines.json_<br/>

**Modify an order item quantity**<br/>
MODIFY ITEM QUANTITY:<br/>
Route: http://localhost:3001/orders/:id<br/>
Request: PUT<br/>
req.body: `{"item_id": num, "qty": num}`<br/>
_if the updated qty is 0, the order_line will be deleted from order_lines.json_<br/>

DELETING ITEM FROM ORDER:<br/>
Route: http://localhost:3001/orders/:id<br/>
Request: DELETE<br/>
req.body: `N/A`<br/>
_Separate delete route if the customer decided to purge multiple quantities of an item all at once_<br/>

## Recommendation Endpoint<br/>

Route: http://localhost:3001/items/top3<br/>
Request: GET<br/>
req.body: `N/A`<br/>

I like how in my solution for the recommendation, along with all of the routes, the database (.json) files are read, that way we know we are always handling the latest information in our database. One con of my approach however is that whenever the '/top3' route is hit, it is re-reading our entire database, re-calculating the top 3 most ordered items. As more and more orders are placed, the time to process all of this will grow exponentially. To improve on this, I would implement a cache or some sort to prevent duplicate calculations.
