const mongoose = require('mongoose');

mongoose.connect(process.env.URI, { useUnifiedTopology: true, useNewUrlParser: true });

const rankSchema = new mongoose.Schema({
    team: String,
    point: Number,
    goal: Number,
    conceded: Number,
    win: Number,
    draw: Number,
    loss: Number,
    season: Number
}, {collection: 'rank'});

module.exports = mongoose.model('rank', rankSchema);