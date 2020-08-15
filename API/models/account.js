const mongoose = require('mongoose');

mongoose.connect(process.env.URI, {useUnifiedTopology: true, useNewUrlParser: true});

const accountSchema = new mongoose.Schema({
    username: String,
    password: String
}, {collection: 'account'});

module.exports = mongoose.model('account', accountSchema);
