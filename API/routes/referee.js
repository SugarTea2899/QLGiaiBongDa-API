var express = require('express');
var router = express.Router();
const refereeController = require('../controller/referee');

/* add referee */
router.post('/add', async function(req, res, next){
    refereeController.add(req, res, next)
});

module.exports = router;