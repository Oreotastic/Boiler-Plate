const express = require("express");
const app = express();
const path = require("path");
const db = require("./db");
// const axios = require("axios");

const pathDist = path.join(__dirname, "..", "dist");
app.use("/dist", express.static(pathDist));

app.get("/", (req, res, next) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require("./api")(app);

app.use((req, res, next) => {
  next({
    status: 404,
    message: `Page not found for ${req.method} ${req.url}`
  });
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).send({
    message: err.message || JSON.stringify(err)
  });
});

const port = process.env.PORT || 3000;

// app.listen(port, () => console.log("listening"));

db.sync()
  .then(() => {
    app.listen(port, () => {
      console.log(`listening on port ${port}`);
    });
  })
  .catch(error => console.error(error));
