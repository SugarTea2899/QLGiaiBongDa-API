var express = require('express');
var router = express.Router();
const teamController = require('../controller/team');

/* add team*/
router.post('/add', async function(req, res, next){
    teamController.add(req, res, next);
});

module.exports = router;
