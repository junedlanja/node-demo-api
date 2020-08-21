const mongoose = require('mongoose');

const eventSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        info: {
            type: String,
            required: true,
            trim: true,
        },
        location: {
            type: String,
            required: true,
            trim: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        rsvp: {
            type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
            required: true,
            default: []
        },
        status: {
            type: Number,
            required: true,
            default: 1
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        }
    },
    {
        timestamps: true
    }
);

eventSchema.pre('validate', function (next) {
    if (this.startDate > this.endDate) {
        next(new Error('End date must be greater than Start date'));
    } else {
        next();
    }
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
