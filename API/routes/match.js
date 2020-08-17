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

/* search match */
router.get('/search', async function(req, res, next){
    matchController.search(req, res, next);
})

/* add match detail */
router.post('/add-detail', async function(req, res, next){
    matchController.addDetail(req, res, next);
});


/* get all detail of match */
router.get('/detail', async function(req, res, next){
    matchController.getMatchDetail(req, res, next);
})

/* get confrontation history between two teams */
router.get('/confrontation-history', async function(req, res, next){
    matchController.getConfrontationHistory(req, res, next);
});

/* get confrontation history between two teams */
router.get('/history', async function(req, res, next){
    matchController.getHistory(req, res, next);
});

/* update match state */
router.post('/update-state', async function(req, res, next){
    matchController.updateStateMatch(req, res, next);
});

/* get match info */
router.post('/get-match-info', async function(req, res, next){
    matchController.getMatchInfo(req, res, next);
});

router.get('/recent-round', async function(req, res, next){
    matchController.getRecentRound(req, res, next);
});

router.get('/recent-match', async function(req, res, next){
    matchController.getRecentMatch(req, res, next);
});

module.exports = router;
