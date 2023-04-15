const express = require("express");
const productController = require("../Controller/Product");
const {verifyToken} = require("../Middleware/VerifyToken")
const router = express.Router()

router
.post("/", productController.createProduct)

.post("/login", productController.userlogin)

.get("/", productController.getAllProducts)

.get("/home", productController.homePage)

.get("/about", productController.aboutPage)

.get("*", productController.invalidPage)

.get("/:id", productController.getProduct)

// .put("/:id", productController.updateProduct)

.put("/:id",verifyToken, productController.updateUser)

.patch("/:id", productController.updateButNotReplace)

.delete("/:id", productController.deleteProduct)




exports.Router = router