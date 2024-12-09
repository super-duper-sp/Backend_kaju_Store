const express = require("express");
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDb = require("./config/dbConnection");
const cookieParser = require("cookie-parser");


const { OpenAI } = require("openai");



connectDb();

const app = express();

const port = process.env.PORT || 8000;

// Middleware
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


const corsOptions = {
  origin: ['http://localhost:3000', 'https://syncshop.vercel.app','https://shopsync-3zt2.onrender.com'],
  credentials: true, // Allow credentials (cookies, etc.) to be sent
};

app.use(cors(corsOptions));








const apiRoutes = require("./routes/apiRoutes");
app.use("/api", apiRoutes);

const aiRoutes = require("./routes/aiRoutes");
app.use("/ai", aiRoutes);

const authRoutes = require("./routes/authRoutes");
app.use("/api/user", authRoutes);

const shopRoutes = require("./routes/shopRoutes");
app.use("/api/shop", shopRoutes);


app.get('/', (req, res) => {
  res.send('Server is Running');
})

app.listen(port, () => {
  console.log(`Server Running on port ${port}`);
});
