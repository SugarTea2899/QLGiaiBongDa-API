const mongoose = require('mongoose');

mongoose.connect(process.env.URI, {useUnifiedTopology: true, useNewUrlParser: true});

const matchSchema = new mongoose.Schema({
    homeTeam: String,
    guestTeam: String,
    dataStart: Date,
    stadium: String,
    refereeId: String,
    round: Number
}, {collection: 'matches'});

module.exports = mongoose.model('matches', matchSchema);