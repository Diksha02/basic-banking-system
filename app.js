//jshint esversion:6
require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const Customer = require("./models/customers");

const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

const PORT = process.env.PORT || 3000;

mongoose.connect(
  "mongodb+srv://" +
    process.env.DB_USER +
    ":" +
    process.env.DB_PASSWORD +
    "@cluster0.yao28.mongodb.net/bankDB?retryWrites=true&w=majority" ||
    "mongodb://localhost:27017/bankDB",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  }
);

mongoose.connection.on("connected", () =>
  console.log("Successfully connected to Mongodb")
);

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home", {
    activeTab: "home",
    homeStartingContent: homeStartingContent,
    aboutContent: aboutContent,
    contactContent: contactContent,
  });
});

app.get("/about", (req, res) => {
  res.render("about", { activeTab: "about", aboutContent: aboutContent });
});

app.get("/contact", (req, res) => {
  res.render("contact", {
    activeTab: "contact",
    contactContent: contactContent,
  });
});

app.get("/customers", (req, res) => {
  Customer.find((err, docs) => {
    if (err) {
      console.log(err);
    } else {
      res.render("customers", {
        activeTab: "customers",
        customers: docs,
        custName: custName,
        custBalance: custBalance,
      });
    }
  });
});

let custName = "";
let custBalance = "";
let recieverName = "";

app.get("/customers/:custName1", (req, res) => {
  let name = req.params.custName1;
  Customer.findOne({ name: name }, (err, doc) => {
    if (err) {
      console.log(err);
    } else {
      custName = doc.name;
      custBalance = doc.balance;
      Customer.find({ name: { $ne: name } }, (err, docs) => {
        if (err) {
          console.log(err);
        } else {
          res.render("customer", {
            activeTab: "customers",
            customers: docs,
            custName: custName,
            custBalance: custBalance,
            reqParams: name,
            recieverName: recieverName,
          });
        }
      });
    }
  });
});

app.post("/customers/:custName1", (req, res) => {
  let custName = req.params.custName1;
  let custBalance = req.body.custBalance;
  let amount = req.body.amount;
  let recieverName = req.body.recieverName;

  custBalance = custBalance - amount;

  Customer.findOneAndUpdate(
    { name: custName },
    { balance: custBalance },
    (err, doc) => {
      if (err) {
        return console.log(err);
      }
      Customer.findOneAndUpdate(
        { name: recieverName },
        { $inc: { balance: amount } },
        (err, doc) => {
          if (err) {
            return console.log(err);
          }

          res.redirect("/success");
        }
      );
    }
  );
});

app.post("/customer", (req, res) => {
  const name = req.body.selectedCustomerName;
  res.redirect("/customers/" + name);
  recieverName = "";
});

app.post("/customer/transaction", (req, res) => {
  const name1 = req.body.selectedCustomerName1;
  recieverName = req.body.selectedCustomerName2;
  res.redirect("/customers/" + name1);
});

app.get("/success", (req, res) => {
  res.render("success");
});

app.get("*", (req, res) => {
  res.send("<h1>404 NOT FOUND</h1>");
});

app.listen(PORT, () => {
  console.log("Server started...");
});
