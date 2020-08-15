var express = require('express');
var router = express.Router();
const regulationController = require('../controller/regulation');
/* GET home page. */
router.post('/update', async function(req, res, next) {
  regulationController.update(req, res, next);
});

module.exports = router;