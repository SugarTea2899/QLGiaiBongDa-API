const mongoose = require('mongoose');

mongoose.connect(process.env.URI, { useUnifiedTopology: true, useNewUrlParser: true });

const teamSchema = new mongoose.Schema({
    name: String,
    stadium: String,
    sponsor: String,
    captainId: String,
    coachId: String,
    currentRanking: Number,
    logo: String  
}, {collection: 'teams'});

module.exports = mongoose.model('teams', teamSchema);
