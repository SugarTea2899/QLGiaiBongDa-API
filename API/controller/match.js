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
                round: matchInfo.round
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
    }
}