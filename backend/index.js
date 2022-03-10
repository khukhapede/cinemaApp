require("dotenv").config();
const express = require("express");
const cors = require("cors");

const router = require("./src/routes/routes");

const app = express();

const port = 5000;

const http = require("http");

const server = http.createServer(app);

app.use(express.json());
app.use(cors());

app.use("/api/v1/", router);
app.use("/Media", express.static("Media"));

app.listen(port, () => console.log(`Listening on port ${port}!`));
