const mongoose = require('mongoose');

mongoose.connect(process.env.URI, { useUnifiedTopology: true, useNewUrlParser: true });

const regulationSchema = new mongoose.Schema({
    minAge: Number,
    maxQuantity: Number,
    maxForeign: Number,
    winPoint: Number,
    drawPoint: Number,
    lossPoint: Number,
    maxSubstitution: Number,
    nTeam: Number
}, {collection: 'regulations'});

module.exports = mongoose.model('regulations', regulationSchema);