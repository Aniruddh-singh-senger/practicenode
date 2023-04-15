const data = require("../data.json");
const Product = require("../Model/Product.js");
const CryptoJS = require("crypto-js");
const path = require("path");
const jwt = require("jsonwebtoken");

const staticPage = path.join(__dirname, "../Public");

exports.createProduct = async (req, res) => {
  const newUser = new Product({
    username: req.body.username,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString(),
  });

  try {
    const saveUser = await newUser.save();
    res.status(201).json(saveUser);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.userlogin = async (req, res) => {
  try {
    const userLogin = await Product.findOne({ username: req.body.username });
    if (!userLogin) {
      res.status(401).json("wrong crendials");
    } else {
      const hasedPassword = CryptoJS.AES.decrypt(
        userLogin.password,
        process.env.PASS_SEC
      ).toString(CryptoJS.enc.Utf8);
      if (hasedPassword !== req.body.password) {
        res.status(401).json("wrong crendials");
      } else {
        const authToken = jwt.sign(
          {
            id: userLogin._id,
            isAdmin: userLogin.isAdmin,
          },
          process.env.JWT_SEC,
          { expiresIn: "3d" }
        );

        const { password, ...others } = userLogin._doc;

        res.status(201).json({ ...others, authToken });
      }
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.updateUser = async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString();
  }
  try {
    const updateUser = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(201).json(updateUser);
  } catch (error) {
    res.status(500).json(error);
  }
};

// exports.createProduct =  (req, res) => {
//   console.log(req.body);
//   data.products.push(req.body);
//   res.json(req.body);
// }

exports.getAllProducts = (req, res) => res.json(data);

exports.getProduct = (req, res) => {
  const id = +req.params.id;
  const product = data.products.find((p) => p.id === id);
  res.json(product);
};

exports.updateProduct = (req, res) => {
  const id = +req.params.id;
  const productIndex = data.products.findIndex((p) => p.id === id);
  data.products.splice(productIndex, 1, { ...req.body, id: id });
  res.status(201).json();
};

exports.updateButNotReplace = (req, res) => {
  const id = +req.params.id;
  const productIndex = data.products.findIndex((p) => p.id === id);
  const product = data.products[productIndex];
  data.products.splice(productIndex, 1, { ...product, ...req.body });
  res.status(201).json();
};

exports.deleteProduct = (req, res) => {
  const id = +req.params.id;
  const productIndex = data.products.findIndex((p) => p.id === id);
  const product = data.products[productIndex];
  data.products.splice(productIndex, 1);
  res.status(201).json(product);
};

exports.homePage = (req, res) => {
  res.sendFile(`${staticPage}/index.html`);
};

exports.aboutPage = (req, res) => {
  res.sendFile(`${staticPage}/about.html`);
};

exports.invalidPage = (req, res) => {
  res.sendFile(`${staticPage}/invalid.html`);
};
