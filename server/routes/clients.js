const express = require('express');
const router = express.Router();
const Client = require('../models/Client');
const User = require('../models/User');
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

// CREATE - Add new client
router.post('/', verifyToken, async (req, res) => {
    try {
        const clientData = {
            ...req.body,
            createdBy: req.user.id
        };

        const newClient = new Client(clientData);
        const savedClient = await newClient.save();
        
        // Populate creator info
        await savedClient.populate('createdBy', 'username');
        
        res.status(201).json({
            message: 'Client created successfully',
            client: savedClient
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: 'Client with this name already exists' });
        }
        res.status(500).json({ error: err.message });
    }
});

// READ - Get all clients with filtering and pagination
router.get('/', verifyToken, async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            status,
            source,
            search,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        // Build filter
        const filter = {};
        if (status) filter.status = status;
        if (source) filter.source = source;
        if (search) {
            filter.$text = { $search: search };
        }

        // Build sort
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const clients = await Client.find(filter)
            .populate('createdBy', 'username')
            .populate('assignedTo', 'username')
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Client.countDocuments(filter);

        res.json({
            clients,
            pagination: {
                current: parseInt(page),
                pageSize: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// READ - Get single client by ID
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const client = await Client.findById(req.params.id)
            .populate('createdBy', 'username')
            .populate('assignedTo', 'username')
            .populate('notes.createdBy', 'username');

        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }

        res.json(client);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE - Update client information
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const updateData = {
            ...req.body,
            updatedAt: Date.now()
        };

        const updatedClient = await Client.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).populate('createdBy', 'username')
         .populate('assignedTo', 'username');

        if (!updatedClient) {
            return res.status(404).json({ message: 'Client not found' });
        }

        res.json({
            message: 'Client updated successfully',
            client: updatedClient
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: 'Client with this name already exists' });
        }
        res.status(500).json({ error: err.message });
    }
});

// UPDATE - Update client status
router.patch('/:id/status', verifyToken, async (req, res) => {
    try {
        const { status } = req.body;
        
        if (!['Lead', 'Prospect', 'Active Client', 'Inactive Client', 'Lost'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const updatedClient = await Client.findByIdAndUpdate(
            req.params.id,
            { 
                status,
                lastContactDate: new Date()
            },
            { new: true }
        );

        if (!updatedClient) {
            return res.status(404).json({ message: 'Client not found' });
        }

        res.json({
            message: 'Status updated successfully',
            client: updatedClient
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ADD - Add note to client
router.post('/:id/notes', verifyToken, async (req, res) => {
    try {
        const { text } = req.body;
        
        if (!text) {
            return res.status(400).json({ message: 'Note text is required' });
        }

        const client = await Client.findById(req.params.id);
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }

        client.notes.push({
            text,
            createdBy: req.user.id
        });

        client.lastContactDate = new Date();
        const updatedClient = await client.save()
            .populate('notes.createdBy', 'username');

        res.json({
            message: 'Note added successfully',
            client: updatedClient
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE - Update follow-up date
router.patch('/:id/followup', verifyToken, async (req, res) => {
    try {
        const { nextFollowUpDate } = req.body;
        
        const updatedClient = await Client.findByIdAndUpdate(
            req.params.id,
            { nextFollowUpDate },
            { new: true }
        );

        if (!updatedClient) {
            return res.status(404).json({ message: 'Client not found' });
        }

        res.json({
            message: 'Follow-up date updated successfully',
            client: updatedClient
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE - Remove client
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const client = await Client.findByIdAndDelete(req.params.id);
        
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }

        res.json({
            message: 'Client deleted successfully',
            client: client
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE - Remove note from client
router.delete('/:id/notes/:noteId', verifyToken, async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }

        client.notes = client.notes.filter(note => note._id.toString() !== req.params.noteId);
        await client.save();

        res.json({
            message: 'Note deleted successfully',
            client: client
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET - Client statistics
router.get('/stats/overview', verifyToken, async (req, res) => {
    try {
        const stats = await Client.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const totalClients = await Client.countDocuments();
        const recentClients = await Client.countDocuments({
            createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        });

        res.json({
            total: totalClients,
            recent: recentClients,
            byStatus: stats.reduce((acc, stat) => {
                acc[stat._id] = stat.count;
                return acc;
            }, {})
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
