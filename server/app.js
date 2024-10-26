// Import necessary modules
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

// Initialize Express app
const app = express();

// Import routers
const authRouter = require("./routes/auth");
const categoryRouter = require("./routes/categories");
const productRouter = require("./routes/products");
const brainTreeRouter = require("./routes/braintree");
const orderRouter = require("./routes/orders");
const usersRouter = require("./routes/users");
const customizeRouter = require("./routes/customize");

// Import folder creation script
const CreateAllFolder = require("./config/uploadFolderCreateScript");

// Create necessary folders if they don't exist
CreateAllFolder();

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
app.use(express.static("public")); // Serve static files from the "public" folder
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Define API routes
app.use("/api", authRouter);
app.use("/api/user", usersRouter);
app.use("/api/category", categoryRouter);
app.use("/api/product", productRouter);
app.use("/api", brainTreeRouter);
app.use("/api/order", orderRouter);
app.use("/api/customize", customizeRouter);

// Add a root route
app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log("Server is running on", PORT);
});
