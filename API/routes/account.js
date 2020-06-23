var express = require('express');
var router = express.Router();
const accountController = require('../controller/account');


/* add an account*/
router.post('/add', async function(req, res, next){
    accountController.add(req, res, next);
});

/*remove an account*/
router.post('/remove', async function(req, res, next){
    accountController.remove(req, res, next);
});

/*authenticate an account*/
router.post('/authenticate', async function(req, res, next){
    accountController.authenticate(req, res, next);
});

module.exports = router;
