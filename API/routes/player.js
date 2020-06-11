var express = require('express');
var router = express.Router();
const playerController = require('../controller/player');

/* add player*/
router.post('/add', async function(req, res, next){
    playerController.add(req, res, next);
});

module.exports = router;