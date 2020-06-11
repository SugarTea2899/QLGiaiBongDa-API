const mongoose = require('mongoose');

mongoose.connect(process.env.URI, { useUnifiedTopology: true, useNewUrlParser: true });

const playerSchema = new mongoose.Schema({
    name: String,
    dob: Date,
    type: Number,
    nationality: String,
    teamId: String,
    totalRedCard: Number,
    totalGoal: Number,
    totalAssist: Number,
    totalYellowCard: Number,
    totalCleanSheet: Number,
    avatar: String,
    number: Number
}, {collection: 'players'});

module.exports = mongoose.model('players', playerSchema);