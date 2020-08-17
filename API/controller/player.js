const playerDB = require('../models/player');
const teamDB = require('../models/team');
const matchDB = require('../models/match');
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
            const id = req.query.id;
            const player = await playerDB.findById(id);

            if (player.avatar !== null && player.avatar != `images/${req.file.filename}`){
                fs.unlink(`./public/${player.avatar}`, (err) => {
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
            fs.unlink(`./public/images/${req.file.filename}`, (err) =>{
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
    },
    getListPlayerByTeamName: async function(req, res, next) {
        try {
            const matchId = req.query.matchId;
            if (matchId === undefined || matchId == null) {
                res.status(404).json({
                    message: "MatchId is undefined"
                });
                return;
            }
            const matchInfo = await matchDB.findById(matchId).lean();
            const homeTeamInfo = await teamDB.findOne({name: matchInfo.homeTeam}).lean();
            const guestTeamInfo = await teamDB.findOne({name: matchInfo.guestTeam}).lean();

            const listHome = await playerDB.find({teamId: homeTeamInfo._id}).lean();
            const listGuest = await playerDB.find({teamId: guestTeamInfo._id}).lean();
            res.status(200).json({
                listHome: listHome,
                listGuest: listGuest
            });
        } catch(e) {
            res.status(404).json({
                message: e.message
            })
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
    },
    getAllPlayer: async function(req, res, next) {
        try {
            const list = await playerDB.find().lean();
            for (i = 0; i < list.length; i++) {
                const teamInfo = await teamDB.findById(list[i].teamId);
                if (teamInfo !== null) {
                    list[i].logoTeam = teamInfo.logo;
                    list[i].nameTeam = teamInfo.name;
                }
            }
            res.status(200).json(list);
        } catch(e) {
            res.status(400).json({
                message: e.message
            });
        }
    }
}