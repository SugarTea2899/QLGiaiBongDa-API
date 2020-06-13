const mongoose = require('mongoose');

mongoose.connect(process.env.URI, {useUnifiedTopology: true, useNewUrlParser: true});

const refereeSchema = new mongoose.Schema({
    name: String,
    dob: Date,
    nationality: String
}, {collection: 'referees'});

module.exports = mongoose.model('referees', refereeSchema);