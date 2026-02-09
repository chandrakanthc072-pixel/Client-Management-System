const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');
const jwt = require('jsonwebtoken');

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'Access Denied' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid Token' });
    }
};

// Create Lead (Public)
router.post('/', async (req, res) => {
    try {
        const newLead = new Lead(req.body);
        const savedLead = await newLead.save();
        res.status(201).json(savedLead);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get All Leads (Protected)
router.get('/', verifyToken, async (req, res) => {
    try {
        const leads = await Lead.find().sort({ createdAt: -1 });
        res.json(leads);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Lead Status (Protected)
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const updatedLead = await Lead.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.json(updatedLead);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add Note (Protected)
router.post('/:id/notes', verifyToken, async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id);
        if (!lead) return res.status(404).json({ message: 'Lead not found' });

        lead.notes.push({ text: req.body.text });
        const updatedLead = await lead.save();
        res.json(updatedLead);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete Lead (Protected)
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        await Lead.findByIdAndDelete(req.params.id);
        res.json({ message: 'Lead deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
