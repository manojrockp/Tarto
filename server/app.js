const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// Initialize Express app
const app = express();

// Import folder creation script
const createAllFolder = require("./config/uploadFolderCreateScript");

// Create necessary folders if they don't exist
createAllFolder();

// Database connection
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("==============Mongodb Database Connected Successfully=============="))
  .catch((err) => console.log("Database Not Connected !!!", err));

// Middleware
app.use(morgan("dev"));
app.use(cookieParser());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Serve static files from the client build folder
app.use(express.static(path.join(__dirname, "../client/build")));

// Define API routes
const authRouter = require("./routes/auth");
const categoryRouter = require("./routes/categories");
const productRouter = require("./routes/products");
const brainTreeRouter = require("./routes/braintree");
const orderRouter = require("./routes/orders");
const usersRouter = require("./routes/users");
const customizeRouter = require("./routes/customize");

app.use("/api", authRouter);
app.use("/api/user", usersRouter);
app.use("/api/category", categoryRouter);
app.use("/api/product", productRouter);
app.use("/api", brainTreeRouter);
app.use("/api/order", orderRouter);
app.use("/api/customize", customizeRouter);

// Serve the React client for any other route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log("Server is running on", PORT);
});
