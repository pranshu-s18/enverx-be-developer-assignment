import express from "express";
import mongoose from "mongoose";
import userRoutes from "./routes/users";
import postRoutes from "./routes/posts";

import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use(express.json());
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

mongoose
  .connect(process.env.dbURL!)
  .then(() =>
    app.listen(PORT, () => {
      console.log("Connected to DB");
      console.log(`Listening on port ${PORT}`);
    })
  )
  .catch((e) => console.log(e));
