const playerDB = require('../models/player');

module.exports = {
    add: async function(req, res, next){
        try{
            const playerInfo = req.body;
            playerInfo.dob = new Date(playerInfo.dob);
            const existPlayer = await playerDB.findOne({number: playerInfo.number});

            if (existPlayer !== null){
                res.status(404).json({
                    message: "Player's number is existed."
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
                message: "successfull"
            });

        }catch(e){
            res.status(404).json({
                message: e.message
            })
        }

    }
}