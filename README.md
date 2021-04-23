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

_item_id_ and _qty_ are optional key/value pairs to include in the req.body when creating a new order. Whenever a new order is created, an entry is made into _orders.json_. If _item_id_ and _qty_ are included, respective entries will be written into _order_lines.json_<br/>

**Modify an order item quantity**<br/>
MODIFY ITEM QUANTITY:<br/>
Route: http://localhost:3001/orders/:id<br/>
Request: PUT<br/>
req.body: `{"item_id": num, "qty": num}`<br/>

DELETING ITEM FROM ORDER:<br/>
Route: http://localhost:3001/orders/:id<br/>
Request: DELETE<br/>
req.body: `N/A`<br/>
_When a customer deletes or sets the quantity of an item to 0, the respective entry in order_lines.json will reflect the updated value of 0 instead of removing the entry from the array acting as a “soft delete” so if in the future the customer decides to re-add the item, the entry can be updated once again, as well as keeping the data line for possible marketing /research purposes. ie: If a certain Item_id has many 0 qty’s in order_lines indicating that many customers are changing their mind about purchasing that item._<br/>

## Recommendation Endpoint<br/>

Route: http://localhost:3001/items/top3<br/>
Request: GET<br/>
req.body: `N/A`<br/>

One pro of my solution is that the route for recommendation, along with all of my other routes, the database (.json) files are read when the route is hit ensuring that we are handling the latest information from our database. At the same time though, this is partially a con because while the data might be up to date, as more orders are placed, re-reading the database each time the route is hit can become more resource intensive. To improve on this, I would implement a cache to prevent the constant re-reads. The cache will keep a count of all items that were ordered, and each time a new order is placed, the cache will increment or decrement the item Item_id’s order count respectively.

One other con is that it only received the top 3 items. If given more time, I would refactor the function to be able to return a dynamic amount of the most popular items.

## Change Recommendation Solution to incorporate a customer's past order history<br/>

To incorporate a a customer’s order history, I would add a separate middleware function that would filter out the order_lines.json for only orders that are linked to the customer id. I would grab the customer id from from either a piece of state, local storage, cookie etc, depending on how the app is built.
