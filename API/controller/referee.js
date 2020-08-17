const refereeDB = require('../models/referee');
const upload = require('../config/uploader');
const fs = require('fs');

module.exports = {
    add: async function(req, res, next) {
        try {
            const refereeInfo = req.body;
            refereeInfo.dob = new Date(refereeInfo.dob);
            const existReferee = await refereeDB.findOne({name: refereeInfo.name});

            if (existReferee !== null) {
                res.status(404).json({
                    message: "The referee is already exists"
                });
                return;
            }

            const newReferee = new refereeDB({
                name: refereeInfo.name,
                dob: refereeInfo.dob,
                nationality: refereeInfo.nationality,
                avatar: refereeInfo.avatar
            });

            await newReferee.save();
            res.status(200).json({
                message: "successful"
            });
        } catch(e) {
            res.status(404).json({
                message: e.message
            })
        }
    },

    remove: async function(req, res, next){
        try {
            const refereeID = req.body.refereeId;
            if (refereeID === undefined) {
                res.status(404).json({
                    message: "Referee Id is undefined"
                });
                return;
            }
            const referee = await refereeDB.findById(refereeID);
            if (referee.avatar !== null && referee.length > 0){
                fs.unlink(`./public/${referee.avatar}`, (err) => {
                    if (err){
                        res.status(404).json({
                            message: "remove fail"
                        });
                        return;
                    }
                });
            }
            await refereeDB.findOneAndDelete({_id: refereeID});
            res.status(200).json({
                message: "Removing referee is successful"
            });
        } catch(e) {
            res.status(404).json({
                message: "Referee ID not found"
            });
        }
    },

    update: async function(req, res, next) {
        try {
            const id = req.body.refereeId;
            if (id === undefined) {
                res.status(404).json({
                    message: "referee id is undefined"
                });
                return;
            }

            const aReferee = await refereeDB.findById(id);
            for (member in req.body) {
                if (member != "refereeId") {
                    aReferee[member] = req.body[member];
                }
            }

            await aReferee.save();
            res.status(200).json({
                refereeID: aReferee._id,
                message: "updating referee is successful"
            });
        } catch(e) {
            res.status(404).json({
                message: "referee id is not found"
            });
        }
    },

    search: async function(req, res, next) {
        try {
            let val = req.query.name;
            if (val === undefined) {
                val = "";
            }

            const list = await refereeDB.find({name: {"$regex": val, "$options": "i"}});
            res.status(200).json(list);
        } catch(e) {
            res.status(404).json({
                message: e.message
            });
        }
    },

    getInfo: async function(req, res, next) {
        try {
            const refereeId = req.query.refereeId;
            if (refereeId === undefined) {
                res.status(404).json({
                    message: "referee id is undefined"
                });
                return;
            }

            const referee = await refereeDB.findById(refereeId);
            res.status(200).json(referee);
        } catch(e) {
            res.status(404).json({
                message: "referee id is not found"
            });
        }
    },

    uploadAvatar: async function(req, res, next){
        if (req.file === undefined){
            res.status(404).json({
                message: "upload avatar failed"
            });
            return;
        }
        try{
            const id = req.query.id;
            const referee = await refereeDB.findById(id);

            if (referee.avatar !== null && referee.avatar.length > 0 && referee.avatar != `images/${req.file.filename}`){
                fs.unlink(`./public/${referee.avatar}`, (err) => {
                    if (err){
                        res.status(404).json({
                            message: "upload fail"
                        });
                        return;
                    }
                });
            }

            referee.avatar = `images/${req.file.filename}`;
            await referee.save();
            res.status(200).json({
                message: "upload avatar successful"
            });
        }catch(e){
            fs.unlink(`./public/images/${req.file.filename}`, (err) =>{
                if (err){
                    res.status(404).json({
                        message: "upload fail"
                    });
                    return;
                }
            });

            res.status(404).json({
                message: "Player ID is not found"
            });
        }
    },
    getList: async function(req, res, next){
        try {
            const list = await refereeDB.find();
            res.status(200).json(list);
        } catch (e) {
            res.status(404).json({
                message: e.message
            });
        }
    }
}