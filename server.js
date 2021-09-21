// server.js

const express = require("express");
const app = express();
const PORT = 3000;

const knex = require("knex")({
  client: "postgresql",
  connection: {
    host: "localhost",
    port: "5432",
    user: "root",
    password: "root",
    database: "contacts_db"
  },
  useNullAsDefault: true
})


app.get("/", (req, res) => {
  knex.select("*").from("contacts").then(res => console.log("Example res: " + res));
  res.status(200).send('Hello world');
});

app.post("/", (req, res) => {
})

app.listen(PORT, function() {
  console.log('Server is running on PORT:',PORT);
});