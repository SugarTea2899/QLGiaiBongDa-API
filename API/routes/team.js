var express = require('express');
var router = express.Router();
const teamController = require('../controller/team');

/* add team*/
router.post('/add', async function(req, res, next){
    teamController.add(req, res, next);
});

/*remove team*/
router.post('/remove', async function(req, res, next){
    teamController.remove(req, res, next);
});

/*update team*/
router.post('/update', async function(req, res, next){
    teamController.update(req, res, next);
});

/*search team by name*/
router.get('/search', async function(req, res, next){
    teamController.search(req, res, next);
});

/*get info of a team*/
router.get('/getInfo', async function(req, res, next){
    teamController.getInfo(req, res, next);
});

/**/
router.post('/uploadLogo', async function(req, res, next){
    teamController.uploadLogo(req, res, next);
});
module.exports = router;