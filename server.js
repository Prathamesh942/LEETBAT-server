const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config({
  path: "./.env",
});

const app = express();
app.use(bodyParser.json());
app.use(cors());
console.log(process.env.MONGO);

mongoose.connect(process.env.MONGO, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const noteSchema = new mongoose.Schema({
  questionName: String,
  questionNumber: String,
  questionTopics: [String],
  url: String,
  timestamp: String,
  note: String,
});

const Note = mongoose.model("Note", noteSchema);

app.post("/api/notes", async (req, res) => {
  try {
    const newNote = new Note(req.body);
    await newNote.save();
    res.status(200).send("Note saved successfully.");
  } catch (err) {
    res.status(500).send("Failed to save note.");
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
