const rankDB = require('../models/rank');
const teamDB = require('../models/team');
const rank = require('../models/rank');
module.exports = {
    init: async function(req, res, next){
        try {
            const season = req.query.season;
            const teamList = await teamDB.find();

            for (i = 0; i < teamList.length; i++){
                if (teamList[i].currentRanking != -1){
                    const r = new rankDB({
                        point: 0,
                        team: teamList[i].name,
                        goal: 0,
                        conceded: 0,
                        win: 0,
                        draw: 0,
                        loss: 0,
                        season: season
                    });
                    await r.save();
                }
            }

            res.status(200).json({
                message: "successfully"
            });
        } catch (e) {
            res.status(404).json({
                message: e.message
            }); 
        }
    },
    getCurRank: async function(req, res, next){
        try {
            const season = req.query.season;
            const list = await rank.find({season: season});
            res.status(200).json(list);
        } catch (e) {
            res.status(404).json({
                message: e.message
            });
        }
    }
}