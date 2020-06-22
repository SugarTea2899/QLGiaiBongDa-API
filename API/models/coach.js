const mongoose = require('mongoose');

mongoose.connect(process.env.URI, {useUnifiedTopology: true, useNewUrlParser: true});

const coachSchema = new mongoose.Schema({
    name: String,
    dob: Date,
    nationality: String,
    avatar: String
}, {collection: 'coaches'});

module.exports = mongoose.model('coaches', coachSchema);