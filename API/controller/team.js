const teamDB = require('../models/team');

module.exports = {
    add: async function(req, res, next){
        try{
            const teamInfo = req.body;

            const existTeam = await teamDB.findOne({name: teamInfo.name});

            if (existTeam !== null){
                res.status(404).json({
                    message: "Team's number is existed."
                });
                return;
            }

            const newTeam = new teamDB({
              name: teamInfo.name,
              stadium: teamInfo.stadium,
              sponsor: teamInfo.sponsor,
              captainId: teamInfo.captainId,
              coachId: teamInfo.coachId,
              currentRanking: 0,
              logo: String
            });

            await newTeam.save();
            res.status(200).json({
                message: "Success"
            });

        }catch(e){
            res.status(404).json({
                message: e.message
            })
        }

    }
}
