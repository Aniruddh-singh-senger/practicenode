// const lib = require("./lib.js");
// const http = require("http");
// const fs = require("fs");
// // import {sum,diff} from './newLib.js'

// const data = fs.readFileSync("data.json", "utf-8");

// const index = fs.readFileSync("index.html", "utf-8");

// const server = http.createServer((req, res) => {
//   switch (req.url) {
//     case "/":
//         res.setHeader("Content-Type", "text/html");
//         res.end(index);
//       break;
//     case "/api":
//       res.setHeader("Content-Type", "application/json");
//       res.end(data);
//       break;
//     default:
//         res.writeHead(404);
//         res.end()
//       break;
//   }

//   console.log("server started");
//   // res.setHeader('Conteny-Type: application/json')
// //   res.setHeader("dummy", "dummy");

//   // <h1>hello</h1>
// });

// server.listen(8080);

const express = require("express");
const ProductRouter = require("./Routes/Product.js");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("db successfully started"))
  .catch((err) => console.log(err));

const server = express();

server.use(express.json());

server.use("/products", ProductRouter.Router);

server.listen(process.env.PORT || 8080, () => console.log("server started"));
