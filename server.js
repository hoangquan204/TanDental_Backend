require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db.config");
const staffRoutes = require("./routes/staffRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// test
app.get("/", (req, res) => {
  res.send("API OK");
});

const PORT = process.env.PORT || 3000;

// 🔥 start server đúng chuẩn
const startServer = async () => {
  try {
    await connectDB();

    app.use("/api/staff", staffRoutes);

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
};

startServer();