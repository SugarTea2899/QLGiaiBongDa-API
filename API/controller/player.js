const playerDB = require('../models/player');
const upload = require('../config/uploader');
const fs = require('fs');


module.exports = {
    add: async function(req, res, next){
        try{
            const playerInfo = req.body;
            playerInfo.dob = new Date(playerInfo.dob);
            const existPlayer = await playerDB.findOne({number: playerInfo.number});

            if (existPlayer !== null && playerInfo.teamId !== null && playerInfo.teamId == existPlayer.teamId){
                res.status(404).json({
                    message: "Player's number exist."
                });
                return;
            }

            const newPlayer = new playerDB({
                name: playerInfo.name,
                dob: playerInfo.dob,
                type: playerInfo.type,
                nationality: playerInfo.nationality,
                teamId: playerInfo.teamId,
                avatar: playerInfo.avatar,
                number: playerInfo.number,
                totalRedCard: 0,
                totalYellowCard: 0,
                totalGoal: 0,
                totalAssist: 0,
                totalCleanSheet: 0
            });

            await newPlayer.save();
            res.status(200).json({
                playerId: newPlayer._id,
                message: "successful"
            });

        }catch(e){
            res.status(404).json({
                message: e.message
            })
        }

    },
    remove: async function(req, res, next){
        try{
            const playerId = req.body.playerId;
            if (playerId === undefined){
                res.status(404).json({
                    message: "player Id is undefined."
                });
                return;
            }
            await playerDB.findOneAndDelete({_id: playerId});
            res.status(200).json({
                message: "removing player is successful"
            });
        }catch(e){
            res.status(404).json({
                message: "player ID is not found"
            });
        }
    },
    update: async function(req, res, next){
        try{
            const id = req.body.playerId;
            if (id === undefined){
                res.status(404).json({
                    message: "player ID is undefined"
                });
                return;
            }
            const player = await playerDB.findById(id); //catch below

            for (member in req.body){
                if (member != "playerId"){
                    player[member] = req.body[member];
                }
            }

            await player.save();
            res.status(200).json({
                message: "updating player is successful"
            });
        }catch(e){
            res.status(404).json({
                message: "player ID is not found"
            });
        }
    },
    getFreeList: async function(req, res, next){
        try{
            const list = await playerDB.find({teamId: null});
            res.status(200).json(list);
        }catch(e){
            res.status(404).json({
                message: e.message
            });
        }
    },
    search: async function(req, res, next){
        try{
            let val = req.query.name;
            if (val === undefined)
                val = "";

            const list = await playerDB.find({name: {"$regex": val, "$options": "i"}});
            res.status(200).json(list);
        }catch(e){
            res.status(404).json({
                message: e.message
            });
        }
    },
    getInfo: async function(req, res, next){
        try{
            const playerId = req.query.playerId;
            if (playerId === undefined){
                res.status(404).json({
                    message: "Player ID is undefined"
                });
                return;
            }
            const player = await playerDB.findById(playerId);
            res.status(200).json(player);
        }catch(e){
            res.status(404).json({
                message: "Player ID is not found"
            });
            return;
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
            const id = req.query.playerId;
            const player = await playerDB.findById(id);

            if (player.avatar !== null && player.avatar != `images/${req.file.filename}`){
                fs.unlink(`./${player.avatar}`, (err) => {
                    if (err)
                        next(err);
                });
            }

            player.avatar = `images/${req.file.filename}`;
            await player.save();
            res.status(200).json({
                message: "upload avatar successful"
            });
        }catch(e){
            fs.unlink(`./images/${req.file.filename}`, (err) =>{
                if (err)
                    next(err);
            });

            res.status(404).json({
                message: "Player ID is not found"
            });
        }
    },
    getListPlayer: async function(req, res, next){
        try {
            const teamId = req.query.teamId;
            if (teamId === undefined || teamId === null){
                res.status(404).json({
                    message: "Team ID is undefine"
                });
                return;
            }
            const list = await playerDB.find({teamId: teamId});
            res.status(200).json(list);
        } catch (e) {
            res.status(404).json({
                message: e.message
            });
        }
    }
}