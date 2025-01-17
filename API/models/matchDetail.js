const mongoose = require('mongoose');
const player = require('./player');

mongoose.connect(process.env.URI, {useUnifiedTopology: true, useNewUrlParser: true});

const matchDetailSchema = new mongoose.Schema({
    matchId: String,
    type: Number,
    minute: Number,
    isHomeTeam: Boolean,
    playerId: String,
    outId: String,
    inId: String
}, {collection: 'matchStatDetail'});

module.exports = mongoose.model('matchStatDetail', matchDetailSchema);