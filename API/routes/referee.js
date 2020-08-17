var express = require('express');
var router = express.Router();
const refereeController = require('../controller/referee');
const upload = require('../config/uploader');

/* add referee */
router.post('/add', async function(req, res, next){
    refereeController.add(req, res, next)
});

/* remove referee */
router.post('/remove', async function(req, res, next){
    refereeController.remove(req, res, next)
});

/* update referee */
router.post('/update', async function(req, res, next){
    refereeController.update(req, res, next)
});

/* search referee list by name */
router.get('/search', async function(req, res, next){
    refereeController.search(req, res, next);
});

/* get referee's info */
router.get('/info', async function(req, res, next){
    refereeController.getInfo(req, res, next);
});

/* upload referee avatar */
router.post('/upload-avatar', upload.single('avatar'), async function(req, res, next){
    refereeController.uploadAvatar(req, res, next);
});

/* get referee list */
router.get('/list', async function(req, res, next){
    refereeController.getList(req, res, next);
})

module.exports = router;