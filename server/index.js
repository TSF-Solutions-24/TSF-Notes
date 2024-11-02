require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('./config.json');
const { authenticateToken } = require('./utilities'); 
const User = require('./models/userModel');
const Note = require('./models/noteModel');

const app = express();
app.use(cors());
app.use(express.json());

// Database connection with MongoDB Atlas
mongoose.connect(config.connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error("MongoDB Connection Error:", err));

// Create Account
app.post('/create-account', async (req, res) => {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
        return res.status(400).json({ error: true, message: "All fields are required" });
    }

    const isUser = await User.findOne({ email });
    if (isUser) {
        return res.status(400).json({ error: true, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ fullName, email, password: hashedPassword });
    await user.save();

    const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET);
    return res.json({
        error: false,
        user: { fullName: user.fullName, email: user.email },
        accessToken,
        message: "Registration Successful",
    });
});

// Login Account
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: true, message: "Email and password are required" });
    }

    const userInfo = await User.findOne({ email });
    if (!userInfo) {
        return res.status(400).json({ error: true, message: "User Not Found" });
    }

    const isPasswordValid = await bcrypt.compare(password, userInfo.password);
    if (!isPasswordValid) {
        return res.status(400).json({ error: true, message: "Invalid Credentials" });
    }

    const accessToken = jwt.sign({ userId: userInfo._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
    return res.json({
        error: false,
        message: "Login Successful",
        email,
        accessToken,
    });
});

// Get user details
app.get('/get-user', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ error: true, message: "User not found" });
        }
        return res.json({
            user: { fullName: user.fullName, email: user.email, _id: user._id, createdOn: user.createdOn },
            message: "User fetched successfully",
        });
    } catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).json({ error: true, message: "Internal server error" });
    }
});

// Add note
app.post('/add-note', authenticateToken, async (req, res) => {
    const { title, content, tags } = req.body;
    const userId = req.user.userId;

    if (!title || !content) {
        return res.status(400).json({ error: true, message: "Title and content are required" });
    }

    try {
        const note = new Note({
            title,
            content,
            tags: tags || [],
            userId
        });
        await note.save();

        return res.json({
            error: false,
            note,
            message: "Note added successfully"
        });
    } catch (error) {
        console.error("Error adding note:", error);
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
        });
    }
});

// Edit Note API
app.put('/edit-note/:noteId', authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { title, content, tags, isPinned } = req.body;
    const userId = req.user.userId;

    if (!title && !content && !tags && isPinned === undefined) {
        return res.status(400).json({ error: true, message: "No changes provided" });
    }

    try {
        const note = await Note.findOne({ _id: noteId, userId });
        if (!note) {
            return res.status(404).json({ error: true, message: "Note not found" });
        }

        if (title) note.title = title;
        if (content) note.content = content;
        if (tags) note.tags = tags;
        if (isPinned !== undefined) note.isPinned = isPinned;

        await note.save();
        return res.json({ error: false, message: "Note edited successfully", note });
    } catch (error) {
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
});

// Get all notes
app.get('/get-all-notes', authenticateToken, async (req, res) => {
    try {
        const notes = await Note.find({ userId: req.user.userId }).sort({ isPinned: -1 });
        return res.json({
            error: false,
            notes,
            message: "All notes received successfully"
        });
    } catch (error) {
        console.error("Error fetching notes:", error);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
});

// Delete notes
app.delete('/delete-note/:noteId', authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const userId = req.user.userId;

    try {
        const note = await Note.findOne({ _id: noteId, userId });
        if (!note) {
            return res.status(404).json({ error: true, message: "Note not found" });
        }
        await Note.deleteOne({ _id: noteId, userId });
        return res.json({ error: false, message: "Note deleted successfully" });
    } catch (error) {
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
});

// Update isPinned value
app.put('/update-note-pin/:noteId', authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { isPinned } = req.body;
    const userId = req.user.userId;

    try {
        const note = await Note.findOne({ _id: noteId, userId });
        if (!note) {
            return res.status(404).json({ error: true, message: "Note not found" });
        }

        note.isPinned = isPinned;
        await note.save();
        return res.json({ error: false, message: "Note pinned successfully", note });
    } catch (error) {
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
});

// Search notes
app.get('/search-notes', authenticateToken, async (req, res) => {
    const userId = req.user.userId;
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ error: true, message: "Search query is required" });
    }

    try {
        const matchingNotes = await Note.find({
            userId,
            $or: [
                { title: { $regex: new RegExp(query, "i") } },
                { content: { $regex: new RegExp(query, "i") } }
            ]
        });

        return res.json({
            error: false,
            notes: matchingNotes,
            message: "Notes matching the search query retrieved successfully"
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: true, message: "Internal Server Error" });
    }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
});

module.exports = app;
