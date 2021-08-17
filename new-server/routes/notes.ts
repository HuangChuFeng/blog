const express = require("express");
const router = express.Router();

const Notes = require("../models/note");

router.get("/", async (req: any, res: any) => {
  try {
    const notes = await Notes.find();
    res.json(notes);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
