require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

//my routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");
const paymentRoutes = require("./routes/payment");

const app = express();

//connecting with mongodb
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("CONNECTED WITH MONGODB"))
  .catch(() => console.log("Error in connecting to MONGODB"));

//Middlewares
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json()); // parse application/json
app.use(cookieParser());
app.use(cors());

//My Routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", orderRoutes);
app.use("/api", paymentRoutes);

//launching the application on the port
const port = process.env.PORT || 2000;
app.listen(port, () => console.log(`Server is started at PORT: ${port}`));