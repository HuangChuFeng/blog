require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", (e: Error) => console.error(e));
db.once("open", () => console.log("Connected to Database"));

app.use(express.json());

const notesRouter = require("./routes/notes");
app.use("/notes", notesRouter);

app.listen(5000, () => console.log("Server Started~"));

export {};
