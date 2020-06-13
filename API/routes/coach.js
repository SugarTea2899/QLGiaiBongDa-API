var express = require('express');
var router = express.Router();
const coachController = require('../controller/coach');

/* add coach */
router.post('/add', async function(req, res, next){
    coachController.add(req, res, next);
});

/* remove coach */
router.post('/remove', async function(req, res, next){
    coachController.remove(req, res, next);
});

/* update coach */
router.post('/update', async function(req, res, next){
    coachController.update(req, res, next);
});

/* search coach list by name */
router.get('/search', async function(req, res, next){
    coachController.search(req, res, next);
});

/* get coach's info */
router.get('/info', async function(req, res, next){
    coachController.getInfo(req, res, next);
});

module.exports = router;