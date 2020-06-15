var express = require('express');
var router = express.Router();
const playerController = require('../controller/player');

/* add player*/
router.post('/add', async function(req, res, next){
    playerController.add(req, res, next);
});

/* remove player */
router.post('/remove', async function(req, res, next){
    playerController.remove(req, res, next);
});

/* update player */
router.post('/update', async function(req, res, next){
    playerController.update(req, res, next);
});
module.exports = router;