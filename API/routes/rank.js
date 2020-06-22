var express = require('express');
var router = express.Router();
const rankController = require('../controller/rank');

router.get('/init', async function(req, res, next){
    rankController.init(req, res, next);
})

router.get('/current', async function(req, res, next){
    rankController.getCurRank(req, res, next);
})
module.exports = router;
