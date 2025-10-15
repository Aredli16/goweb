import app from "./app";
import config from "./config/config";
import mongoose from "mongoose";

mongoose
  .connect(config.mongoUri)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(config.port, () => {
      console.log(
        `Server running in ${config.nodeEnv} mode on port ${config.port}`,
      );
    });
  })
  .catch((reason) => console.error("MongoDB connection error: ", reason));
