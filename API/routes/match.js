var express = require('express');
var router = express.Router();

const matchController = require('../controller/match');

/* add match */
router.post('/add', async function(req, res, next){
    matchController.add(req, res, next);
});

/* remove match */
router.post('/remove', async function(req, res, next){
    matchController.remove(req, res, next);
});

/* update match */
router.post('/update', async function(req, res, next){
    matchController.update(req, res, next);
});

module.exports = router;