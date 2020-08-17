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
                avatar: null,
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
            const player = playerDB.findById(playerId);
            if (player.avatar !== null && player.avatar.length > 0){
                fs.unlink(`./public/${player.avatar}`, (err) =>{
                    if (err){
                        res.status(404).json({
                            message: "remove fail"
                        });
                        return;
                    }
                });
            }
            await playerDB.findOneAndDelete({_id: playerId});
            res.status(200).json({
                message: "removing player is successful"
            });
        }catch(e){
            console.log(e.message);
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
            if (player === null){
                res.status(404).json({
                    message: "player ID is not found"
                });
                return;
            }

            for (member in req.body){
                if (member != "playerId"){
                    player[member] = req.body[member];
                }
            }

            await player.save();
            res.status(200).json({
                playerId: player._id,
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
            if (player === null){
                res.status(404).json({
                    message: "Player ID is not found"
                });
                return;
            }
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
            const id = req.query.id;
            const player = await playerDB.findById(id);

            if (player.avatar !== null && player.avatar.length > 0 && player.avatar != `images/${req.file.filename}`){
                fs.unlink(`./public/${player.avatar}`, (err) => {
                    if (err){
                        res.status(404).json({
                            message: "upload avatar failed"
                        });
                        return;
                    }
                });
            }

            player.avatar = `images/${req.file.filename}`;
            await player.save();
            res.status(200).json({
                message: "upload avatar successful"
            });
        }catch(e){
            fs.unlink(`./public/images/${req.file.filename}`, (err) =>{
                if (err)
                    next(err);
            });

            res.status(404).json({
                message: e.message
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
    },
    getListTopGoal: async function(req, res, next){
        try {
            const list = await playerDB.find().sort({totalGoal: -1});
            const ans = [];
            
            if (list.length == 0){
                res.status(200).json(ans);
                return;
            }
    
            const max = list[0].totalGoal;

            for (i = 0; i < list.length; i++){
                if (list[i].totalGoal == max){
                    ans.push(list[i]);
                }else{
                    break;
                }
            }
            res.status(200).json(ans); 
        } catch (e) {
            res.status(400).json({
                message: e.message
            });
        }
    },
    getListTopCleanSheet: async function(req, res, next){
        try {
            const list =  await playerDB.find().sort({totalCleanSheet: -1});
            const ans = [];

            if (list.length == 0){
                res.status(200).json(ans);
                return;
            }
    
            const max = list[0].totalCleanSheet;

            for (i = 0; i < list.length; i++){
                if (list[i].totalCleanSheet == max){
                    ans.push(list[i]);
                }else{
                    break;
                }
            }
            res.status(200).json(ans); 
        } catch (e) {
            res.status(400).json({
                message: e.message
            });
        }
    },
    getTopAssistance: async function(req, res, next){
        try {
            const list =  await playerDB.find().sort({totalAssist: -1});
            const ans = [];

            if (list.length == 0){
                res.status(200).json(ans);
                return;
            }
    
            const max = list[0].totalAssist;

            for (i = 0; i < list.length; i++){
                if (list[i].totalAssist == max){
                    ans.push(list[i]);
                }else{
                    break;
                }
            }
            res.status(200).json(ans); 
        } catch (e) {
            res.status(400).json({
                message: e.message
            });
        }       
    }
}