const coachDB = require('../models/coach');
const { remove } = require('../models/coach');
const upload = require('../config/uploader');
const fs = require('fs');

module.exports = {
    add: async function(req, res, next) {
        try {
            const coachInfo = req.body;
            coachInfo.dob = new Date(coachInfo.dob);
            const existCoach = await coachDB.findOne({name: coachInfo.name});

            if (existCoach !== null) {
                res.status(404).json({
                    message: "The coach is already exist"
                });
                return;
            }

            const newCoach = new coachDB({
                name: coachInfo.name,
                dob: coachInfo.dob,
                nationality: coachInfo.nationality,
                avatar: coachInfo.avatar
            });

            await newCoach.save();
            res.status(200).json({
                message: "successful"
            });
        }catch(e){
            res.status(404).json({
                message: e.message
            });
        }
    },

    remove: async function(req, res, next) {
        try {
            const coachID = req.body.coachId;
            if (coachID === undefined) {
                res.status(404).json({
                    message: "Coach Id is undefined"
                });
                return;
            }
            const coach = await coachDB.findById(coachID);
            if (coach.avatar !== null || coach.avatar.length == 0){
                fs.unlink(`./public/${coach.avatar}`, (err) => {
                    if (err) {
                        res.status(404).json({
                            message: "remove fail"
                        });
                        return;
                    };
                });
            }
            await coachDB.findOneAndDelete({_id: coachID});
            res.status(200).json({
                message: "Removing coach is successful"
            });
        }catch(e) {
            res.status(404).json({
                message: "Coach ID not found"
            });
        }
    },

    update: async function(req, res, next) {
        try {
            const id = req.body.coachId;
            if (id === undefined) {
                res.status(404).json({
                    message: "coach id is undefined"
                });
                return;
            }

            const coach = await coachDB.findById(id);
            for (member in req.body) {
                if (member != "coachId") {
                    coach[member] = req.body[member];
                }
            }

            await coach.save();
            res.status(200).json({
                coachId: coach._id,
                message: "updating coach is successful"
            });
        } catch(e) {
            res.status(404).json({
                message: "coach id is not found"
            });
        }
    },

    search: async function(req, res, next) {
        try {
            let val = req.query.name;
            if (val === undefined) {
                val = "";
            }

            const list = await coachDB.find({name: {"$regex": val, "$options": "i"}});
            res.status(200).json(list);
        } catch(e) {
            res.status(404).json({
                message: e.message
            });
        }
    },

    getInfo: async function(req, res, next) {
        try {
            const coachId = req.query.coachId;
            if (coachId === undefined) {
                res.status(404).json({
                    message: "coach id is undefined"
                });
                return;
            }

            const coach = await coachDB.findById(coachId);
            res.status(200).json(coach);
        } catch(e) {
            res.status(404).json({
                message: "coach id is not found"
            });
        }
    },

    uploadAvatar: async function(req, res, next){
        if (req.file === undefined) {
            res.status(404).json({
                message: "upload avatar failed"
            });
            return;
        }
        try {
            const id = req.query.id;
            const coach = await coachDB.findById(id);
            if (coach.avatar !== null && coach.avatar.length > 0 && coach.avatar != `images/${req.file.filename}`){
                fs.unlink(`./public/${coach.avatar}`, (err) => {
                    if (err) {
                        next(err);
                    };
                });
            }

            coach.avatar = `images/${req.file.filename}`;
            await coach.save();
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
                message: "Coach ID is not found"
            });
        } 
    },
    getCoachList: async function(req, res, next){
        try {
            const list = await coachDB.find();
            res.status(200).json(list);
        } catch (e) {
            res.status(404).json({
                message: e.message
            });
        }
    }
}