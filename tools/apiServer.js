/*
This uses json-server, but with the module approach: https://github.com/typicode/json-server#module
Downside: You can't pass the json-server command line options.
Instead, can override some defaults by passing a config object to jsonServer.defaults();
You have to check the source code to set some items.
Examples:
Validation/Customization: https://github.com/typicode/json-server/issues/266
Delay: https://github.com/typicode/json-server/issues/534
ID: https://github.com/typicode/json-server/issues/613#issuecomment-325393041
Relevant source code: https://github.com/typicode/json-server/blob/master/src/cli/run.js
*/

/* eslint-disable no-console */
const jsonServer = require("json-server");
const server = jsonServer.create();
const path = require("path");
const router = jsonServer.router(path.join(__dirname, "db.json"));

// Can pass a limited number of options to this to override (some) defaults. See https://github.com/typicode/json-server#api
const middlewares = jsonServer.defaults({
  // Display json-server's built in homepage when json-server starts.
  static: "node_modules/json-server/dist"
});

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// To handle POST, PUT and PATCH you need to use a body-parser. Using JSON Server's bodyParser
server.use(jsonServer.bodyParser);

// Declaring custom routes below. Add custom routes before JSON Server router
server.post("/entries/bulk", (req, res) => {
  const db = router.db;

  if (Array.isArray(req.body)) {
    req.body.forEach(element => {
      insert(db, "entries", element);
    });
  } else {
    insert(db, "entries", req.body);
  }
  const result = db.get("entries");
  res.status(200).send(result);

  function insert(db, collection, data) {
    const table = db.get(collection);
    table.push(data).write();
  }
});

// Use default router
server.use(router);

// Start server
const port = 3001;
server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
});

// Centralized logic

// Returns a URL friendly slug
// function createSlug(value) {
//   return value
//     .replace(/[^a-z0-9_]+/gi, "-")
//     .replace(/^-|-$/g, "")
//     .toLowerCase();
// }

// function validateCourse(course) {
//   if (!course.title) return "Title is required.";
//   if (!course.authorId) return "Author is required.";
//   if (!course.category) return "Category is required.";
//   return "";
// }
