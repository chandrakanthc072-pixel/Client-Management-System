const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
    country: { type: String, default: 'USA' }
});

const NoteSchema = new mongoose.Schema({
    text: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: { type: Date, default: Date.now }
});

const ContactSchema = new mongoose.Schema({
    type: { 
        type: String, 
        enum: ['Phone', 'Email', 'Mobile', 'Work', 'Home', 'Other'],
        required: true 
    },
    value: { type: String, required: true },
    isPrimary: { type: Boolean, default: false }
});

const ClientSchema = new mongoose.Schema({
    // Basic Information
    name: { 
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        company: { type: String }
    },
    displayName: { 
        type: String, 
        required: true,
        unique: true 
    },
    
    // Contact Information
    contacts: [ContactSchema],
    primaryEmail: { 
        type: String, 
        required: true,
        lowercase: true,
        trim: true
    },
    
    // Address
    address: AddressSchema,
    
    // Business Information
    company: { type: String },
    jobTitle: { type: String },
    industry: { type: String },
    website: { type: String },
    
    // Lead/Client Status
    status: {
        type: String,
        enum: ['Lead', 'Prospect', 'Active Client', 'Inactive Client', 'Lost'],
        default: 'Lead'
    },
    source: {
        type: String,
        enum: ['Website', 'Referral', 'Social Media', 'Email', 'Phone', 'Event', 'Other'],
        default: 'Website'
    },
    
    // Financial Information
    budget: { type: Number },
    currency: { type: String, default: 'USD' },
    
    // Communication Preferences
    preferredContact: {
        type: String,
        enum: ['Email', 'Phone', 'Mobile', 'Mail'],
        default: 'Email'
    },
    
    // Notes and History
    notes: [NoteSchema],
    tags: [{ type: String }],
    
    // Important Dates
    lastContactDate: { type: Date },
    nextFollowUpDate: { type: Date },
    
    // Metadata
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Virtual for full name
ClientSchema.virtual('fullName').get(function() {
    return `${this.name.firstName} ${this.name.lastName}`;
});

// Pre-save middleware to update displayName and updatedAt
ClientSchema.pre('save', function(next) {
    if (this.name.firstName && this.name.lastName) {
        this.displayName = `${this.name.firstName} ${this.name.lastName}`;
        if (this.name.company) {
            this.displayName += ` - ${this.name.company}`;
        }
    }
    this.updatedAt = Date.now();
    next();
});

// Index for better search performance
ClientSchema.index({ displayName: 'text', 'name.firstName': 'text', 'name.lastName': 'text', company: 'text' });
ClientSchema.index({ primaryEmail: 1 });
ClientSchema.index({ status: 1 });
ClientSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Client', ClientSchema);
