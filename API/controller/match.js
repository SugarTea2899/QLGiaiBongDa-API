const matchDB = require('../models/match');
const matchDetailDB = require('../models/matchDetail');
const playerDB = require('../models/player');
const teamDB = require('../models/team');
const regualationDB = require('../models/regulation');
const rankDB = require('../models/rank');
module.exports = {
    add: async function(req, res, next) {
        try {
            const matchInfo = req.body;
            matchInfo.dateStart = new Date(matchInfo.dateStart);
            const existMatch = await matchDB.findOne({homeTeam: matchInfo.homeTeam, guestTeam: matchInfo.guestTeam});

            if (existMatch !== null) {
                res.status(404).json({
                    message: "The match is already exist"
                });
                return;
            }

            const newMatch = new matchDB({
                homeTeam: matchInfo.homeTeam,
                guestTeam: matchInfo.guestTeam,
                dateStart: matchInfo.dateStart,
                stadium: matchInfo.stadium,
                refereeId: matchInfo.refereeId,
                round: matchInfo.round,
                homeGoal: matchInfo.homeGoal,
                guestGoal: matchInfo.guestGoal,
                homeYellowCard: matchInfo.homeYellowCard,
                guestYellowCard: matchInfo.guestYellowCard,
                homeRedCard: matchInfo.homeRedCard,
                guestRedCard: matchInfo.guestRedCard,
                stateMatch: matchInfo.stateMatch
            });

            await newMatch.save();
            res.status(200).json({
                message: "successful"
            });
        } catch(e) {
            res.status(404).json({
                message: e.message
            });
        }
    },

    remove: async function(req, res, next){
        try {
            const matchId = req.body.matchId;
            if (matchId === undefined) {
                res.status(404).json({
                    message: "match id is undefined"
                });
                return;
            }

            await matchDB.findOneAndDelete({_id: matchId});
            res.status(200).json({
                message: "successful"
            });
        } catch(e) {
            res.status(404).json({
                message: "match id is not found"
            });
        }
    },

    update: async function(req, res, next) {
        try {
            const id = req.body.matchId;
            if (id === undefined) {
                res.status(404).json({
                    message: "match id is undefined"
                });
                return;
            }

            const match = await matchDB.findById(id);
            for (member in req.body) {
                if (member != "matchId") {
                    match[member] = req.body[member];
                }
            }

            await match.save();
            res.status(200).json({
                message: "updating match is successful"
            });
        } catch(e) {
            res.status(404).json({
                message: "match id is not found"
            });
        }
    },

    updateStateMatch: async function(req, res, next) {
        try {
            const id = req.body.matchId;
            if (id === undefined) {
                res.status(404).json({
                    message: "match id is undefined"
                });
                return;
            }
            const match = await matchDB.findById(id);
            const state = req.body.stateMatch;
            match.stateMatch = state;
            //update point
            if (state == 2){
                const regulation = await regualationDB.findOne();
                const date = new Date(match.dateStart);
                if (match.homeGoal > match.guestGoal){
                    const wTeam =  await rankDB.findOne({
                        team: match.homeTeam,
                        season: date.getFullYear()
                    });
                    const lTeam = await rankDB.findOne({
                        team: match.guestTeam,
                        season: date.getFullYear()
                    });
                    wTeam.point += regulation.winPoint;
                    wTeam.goal += match.homeGoal;
                    wTeam.conceded += match.guestGoal;
                    wTeam.win++;
                    
                    lTeam.goal += match.guestGoal;
                    lTeam.conceded += match.homeGoal;
                    lTeam.loss++;

                    await lTeam.save();
                    await wTeam.save();
                }else{
                    if (match.homeGoal < match.guestGoal){
                        const wTeam =  await rankDB.findOne({
                            team: match.guestTeam,
                            season: date.getFullYear()
                        });
                        const lTeam = await rankDB.findOne({
                            team: match.homeTeam,
                            season: date.getFullYear()
                        });
                        wTeam.point += regulation.winPoint;
                        wTeam.goal += match.guestGoal;
                        wTeam.conceded += match.homeGoal;
                        wTeam.win++;
                        
                        lTeam.goal += match.homeGoal;
                        lTeam.conceded += match.guestGoal;
                        lTeam.loss++;
                        await lTeam.save();
                        await wTeam.save();
                    }else{ //draw match
                        const gTeam =  await rankDB.findOne({
                            team: match.guestTeam,
                            season: date.getFullYear()
                        });
                        const hTeam = await rankDB.findOne({
                            team: match.homeTeam,
                            season: date.getFullYear()
                        });
                        gTeam.point += regulation.drawPoint;
                        gTeam.goal += match.guestGoal;
                        gTeam.conceded += match.homeGoal;
                        gTeam.draw++;

                        hTeam.point += regulation.drawPoint;
                        hTeam.goal += match.homeGoal;
                        hTeam.conceded += match.guestGoal;
                        hTeam.draw++;
                        await gTeam.save();
                        await hTeam.save();
                    }
                }
            }
            //----
            await match.save();
            res.status(200).json({
                message: "updating state match is successful"
            });
        } catch(e) {
            res.status(404).json({
                message: "match id is not found"
            });
        }
    },

    search: async function(req, res, next) {
        try {
            let val = req.query.teamId;
            if (val === undefined) {
                val = "";
            }

            const list = await matchDB.find({$or:[{homeTeam: val},{guestTeam: val}]});
            res.status(200).json(list);
        } catch(e) {
            res.status(404).json({
                message: e.message
            });
        }
    },
    addDetail: async function (req, res, next){
        try {
            const detail = req.body;
            if (!(0 <= detail.type && detail.type <= 6)){
                res.status(400).json({
                    message: "Type value is wrong"
                });
                return;
            }
            const newDetail = new matchDetailDB({
                matchId: detail.matchId,
                type: detail.type,
                minute: detail.minute,
                isHomeTeam: detail.isHomeTeam,
                playerId: detail.playerId,
                inId: detail.inId,
                outId: detail.outId
            });
            
            const curMatch = await matchDB.findById(detail.matchId);
            switch (detail.type){
                case 0: case 1:
                    if (detail.isHomeTeam)
                        curMatch.homeGoal++;
                    else
                        curMatch.guestGoal++;
                    break;
                case 2:
                    if (detail.isHomeTeam)
                        curMatch.guestGoal++;
                    else
                        curMatch.homeGoal++;
                    break;
                case 4:
                    if (detail.isHomeTeam)
                        curMatch.homeYellowCard++;
                    else
                        curMatch.guestYellowCard++;
                    break;
                case 5:
                    if (detail.isHomeTeam)
                        curMatch.homeRedCard++;
                    else
                        curMatch.guestRedCard++;
                    break;
                
            }
            
            const player = await playerDB.findById(detail.playerId);
            switch (detail.type){
                case 0: case 1:
                    player.totalGoal++;
                    break;
                case 3:
                    player.totalAssist++;
                    break;
                case 4:
                    player.totalYellowCard++;
                    break;
                case 5:
                    player.totalRedCard++;
                    break;
            }

            await curMatch.save();
            await player.save();
            await newDetail.save();
            res.status(200).json({
                message: "successful"
            });
        } catch (e) {
            res.status(400).json({
                message: e.message
            });
            return;
        }
    },
    getMatchDetail: async function(req, res, next){
        try {
            const matchId = req.query.matchId;
            if (matchId === undefined){
                res.status(400).json({
                    message: "Match ID is undefinded"
                });
                return;
            }
            let list = await matchDetailDB.find({matchId: matchId}).sort({minute: 1}).lean();
            for (i = 0; i < list.length; i++){
                if (list[i].type != 6){
                    const player = await playerDB.findById(list[i].playerId);
                    list[i].playerIn = player;
                }else{
                    const playerIn = await playerDB.findById(list[i].inId);
                    const playerOut = await playerDB.findById(list[i].outId);
                    list[i].playerIn = playerIn;
                    list[i].playerOut = playerOut;
                }
            }
            res.status(200).json(list);
        } catch (e) {
            res.status(404).json({
                message: e.message
            });
        }
    },
    getConfrontationHistory: async function(req, res, next){
        try {
            const teamA = req.query.teamA;
            const teamB = req.query.teamB;
            let arrFilter = [];
            arrFilter.push(teamA);
            arrFilter.push(teamB);

            const list = await matchDB.find({
                homeTeam: {$in: arrFilter},
                guestTeam: {$in: arrFilter},
                stateMatch: 2
            });
            res.status(200).json(list);
        } catch (e) {
            res.status(404).json({
                message: e.message
            });
        }
    },
    getHistory: async function(req, res, next){
        try {
            const team = req.query.team;
            const stateMatch = req.query.stateMatch;
            if (team === undefined || stateMatch === undefined){
                res.status(400).json({
                    message: "team or statMatch is not found"
                });
                return;
            }
            if (stateMatch == 3){
                const list = await matchDB.find();
                res.status(200).json(list);
                return;
            }
            const list = await matchDB.find({
                $or:[{homeTeam: team},{guestTeam: team}],
                stateMatch: stateMatch
            });
            res.status(200).json(list);
        } catch (e) {
            res.status(404).json({
                message: e.message
            });
        }
    }, 
    getMatchInfo: async function (req, res, next){
        try{
            const id = req.query.matchId;
            if (id === undefined){
                res.status(404).json({
                    message: "Match Id not found"
                });
                return;
            }

            let match = await matchDB.findById(id).lean();
            const homeInfo = await teamDB.findOne({name: match.homeTeam});
            match.logoHome = homeInfo.logo;
            const guestInfo = await teamDB.findOne({name: match.guestTeam});
            match.logoGuest = guestInfo.logo;
            res.status(200).json(match);
        }catch(e){
            res.status(404).json({
                message: e.message
            });
            return;
        }
    }
}