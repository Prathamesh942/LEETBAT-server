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

// Define the schema with an implicit timestamp
const noteSchema = new mongoose.Schema({
  questionName: String,
  questionNumber: String,
  questionTopics: [String],
  url: String,
  note: String,
  timestamp: {
    type: String,
    default: () => new Date().toISOString(), // Automatically sets the timestamp
  },
});

const Note = mongoose.model("Note", noteSchema);

app.post("/api/notes", async (req, res) => {
  try {
    const { questionNumber, ...noteData } = req.body;

    // Update the note if it exists or create a new one
    const updatedNote = await Note.findOneAndUpdate(
      { questionNumber }, // Search by questionNumber
      { ...noteData, timestamp: new Date().toISOString() }, // Update fields
      { new: true, upsert: true } // Create if not found
    );

    res.status(200).send("Note saved or updated successfully.");
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to save or update note.");
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
