const mongoose = require('mongoose');

mongoose.connect(process.env.URI, {useUnifiedTopology: true, useNewUrlParser: true});

const matchSchema = new mongoose.Schema({
    homeTeam: String,
    guestTeam: String,
    dateStart: Date,
    stadium: String,
    refereeId: String,
    round: Number,
    homeGoal: Number,
    guestGoal: Number,
    homeYellowCard: Number,
    guestYellowCard: Number,
    homeRedCard: Number,
    guestRedCard: Number
}, {collection: 'matches'});

module.exports = mongoose.model('matches', matchSchema);