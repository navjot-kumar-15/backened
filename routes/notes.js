const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");

//ROUTE :1;
// Getting All The Notes by using : GET -> method  "api/auth/notes. Login required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

//ROUTE :2;
// Add a New Notes using : POST -> method  "api/auth/addnote". Login required
router.post(
  "/addnote",
  fetchuser,
  [
    // Validator using
    body("title", "Enter the valid title").isLength({ min: 3 }),
    body("description", "Description must be atleat 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      // Destructure from the notes
      const { title, description, tag } = req.body;
      // If there are error then shows bad request and the errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      // Creating the new notes with the user id
      const note = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const noteSave = await note.save();
      res.json(noteSave);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
);

//ROUTE :3;
// Updating an existing notes using : POST -> method  "api/auth/updatenote". Login required

router.put("/updatenote/:id", fetchuser, async (req, res) => {
  const { title, description, tag } = req.body;

  try {
    // creating newNote object
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }

    //   Find the note to be updated and update it
    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not Found");
    }

    //   Checking the user is requesting to update is same or not
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Note Allowed");
    }

    note = await Notes.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json({ note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

//ROUTE :4;
// Delete an existing notes using : Delete -> method  "api/auth/deletenote". Login required

router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  const { title, description, tag } = req.body;

  try {
    //   Find the note to be deleted and deleted it
    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not Found");
    }

    //   Checking the user is requesting to update is same or not
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Note Allowed");
    }

    note = await Notes.findByIdAndDelete(req.params.id);
    res.json({ Success: "Note has been deleted", note: note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
