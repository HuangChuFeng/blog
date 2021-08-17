const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("notes", noteSchema);
