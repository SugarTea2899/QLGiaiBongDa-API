const matchDB = require('../models/match');

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
                guestRedCard: matchInfo.guestRedCard
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
    }
}