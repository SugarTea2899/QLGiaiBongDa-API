var express = require('express');
var router = express.Router();
const playerController = require('../controller/player');
const upload = require('../config/uploader');


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

/* get free player list */
router.get('/free', async function(req, res, next){
    playerController.getFreeList(req, res, next);
});

/* search player list by name */
router.get('/search', async function(req, res, next){
    playerController.search(req, res, next);
});

/* get player's detail info */
router.get('/info', async function(req, res, next){
    playerController.getInfo(req, res, next);
});

/* upload player avatar */
router.post('/upload-avatar', upload.single('avatar'), function(req, res, next){
    playerController.uploadAvatar(req, res, next);
});

/* get list player in a team */
router.get('/teammate', async function(req, res, next){
    playerController.getListPlayer(req, res, next);
});

/* get list top goal */
router.get('/top-goal', async function(req, res, next){
    playerController.getListTopGoal(req, res, next);
});

/* get list top clean sheet */
router.get('/top-clean-sheet', async function(req, res, next){
    playerController.getListTopCleanSheet(req, res, next);
});

/* get top assistance list */
router.get('/top-assistance', async function(req, res, next){
    playerController.getTopAssistance(req, res, next);
});

/* get all player */
router.get('/get-all-player', async function(req, res, next){
    playerController.getAllPlayer(req, res, next);
});

/* get list player by team name */
router.get('/get-by-team-name', async function(req, res, next){
    playerController.getListPlayerByTeamName(req, res, next);
});

module.exports = router;