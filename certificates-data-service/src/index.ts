import express from "express";
import cors from "cors";
import router from "./routes/index.js";
import mongoose from "mongoose";

const app = express();

process.on("warning", (e) => console.warn(e.stack));
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: "GET,POST,PUT,DELETE",
  })
);
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use("/api", router);

const start = async () => {
  try {
    await mongoose.connect("mongodb://localhost:2717/newdb");
    await app.listen(3008, () => {
      console.log("Application has been started");
    });
  } catch (e) {
    console.log(e);
  }
};

start();
