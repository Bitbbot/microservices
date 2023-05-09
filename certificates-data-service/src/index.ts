import express from "express";
import cors from "cors";
import router from "./routes/index.js";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { run } from "./services/kafka.js";
dotenv.config();

const app = express();

process.on("warning", (e) => console.warn(e.stack));
app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE",
  })
);
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use("/api", router);

const start = async () => {
  try {
    // await mongoose.connect(
    //   `mongodb://localhost:${process.env.MONGO_CERTIFICATES_PORT}/${process.env.MONGO_CERTIFICATES_NAME}`
    // );
    await mongoose.connect(
      `mongodb://${process.env.MONGO_CERTIFICATES_URL}/${process.env.MONGO_CERTIFICATES_NAME}`
    );
    run();
    await app.listen(process.env.CERTIFICATES_DATA_SERVICE_PORT, () => {
      console.log("Application has been started");
    });
  } catch (e) {
    console.log(e);
  }
};

start();
