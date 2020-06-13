var express = require('express');
var router = express.Router();

const matchController = require('../controller/match');

/* add match */
router.post('/add', async function(req, res, next){
    matchController.add(req, res, next);
});

module.exports = router;