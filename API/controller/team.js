const teamDB = require('../models/team');

module.exports = {
    add: async function(req, res, next){
        try{
            const teamInfo = req.body;
            const existTeamName = await teamDB.findOne({name: teamInfo.name});
            const existshortName = await teamDB.findOne({shortName: teamInfo.shortName});
            if (existTeamName !== null){
                res.status(404).json({
                    message: "Team's name exists."
                });
                return;
            }

            if (existshortName !== null){
                res.status(404).json({
                    message: "Team's short name exists."
                });
                return;
            }

            const newTeam = new teamDB({
              name: teamInfo.name,
              shortName: teamInfo.shortName,
              stadium: teamInfo.stadium,
              sponsor: teamInfo.sponsor,
              captainId: teamInfo.captainId,
              coachId: teamInfo.coachId,
              currentRanking: 0,
              logo: teamInfo.logo
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
    },
    remove: async function(req, res, next){
        try{
            const teamId = req.body.teamId;
            if (teamId === undefined){
                res.status(404).json({
                    message: "teamID is undefined."
                });
                return;
            }
            await teamDB.findOneAndDelete({_id: teamId});
            res.status(200).json({
                message: "Team deleted successfully"
            });
        }catch(e){
            res.status(404).json({
                message: "Team not found"
            });
        }
    },
    search: async function(req, res, next){
        try{
            let val = req.query.name;
            if (val === undefined)
                val = "";

            const list = await teamDB.find({name: {"$regex": val, "$options": "i"}});
            res.status(200).json(list);
        }catch(e){
            res.status(404).json({
                message: e.message
            });
        }
    },
    getInfo: async function(req, res, next){
        try{
            const teamId = req.query.teamId;
            if (teamId === undefined){
                res.status(404).json({
                    message: "teamID is undefined"
                });
                return;
            }
            const team = await teamDB.findById(teamId);
            res.status(200).json(team);
        }catch(e){
            res.status(404).json({
                message: "Team ID is not found"
            });
            return;
        }
    },
    update: async function(req, res, next){
        try{
            const id = req.body.teamId;
            if (id === undefined){
                res.status(404).json({
                    message: "teamID is undefined"
                });
                return;
            }
            const team = await teamDB.findById(id); //catch below

            for (key in req.body){
                if (key != "teamId"){
                    team[key] = req.body[key];
                }
            }

            await team.save();
            res.status(200).json({
                message: "Team info updated successfully"
            });
        }catch(e){
            res.status(404).json({
                message: "Team not found"
            });
        }
    }
}
