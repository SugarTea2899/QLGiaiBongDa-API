const refereeDB = require('../models/referee');

module.exports = {
    add: async function(req, res, next) {
        try {
            const refereeInfo = req.body;
            refereeInfo.dob = new Date(refereeInfo.dob);
            const existReferee = await refereeDB.findOne({name: refereeInfo.name});

            if (existReferee !== null) {
                res.status(404).json({
                    message: "The referee is already exists"
                });
                return;
            }

            const newReferee = new refereeDB({
                name: refereeInfo.name,
                dob: refereeInfo.dob,
                nationality: refereeInfo.nationality
            });

            await newReferee.save();
            res.status(200).json({
                message: "successful"
            });
        } catch(e) {
            res.status(404).json({
                message: e.message
            })
        }
    },

    remove: async function(req, res, next){
        try {
            const refereeID = req.body.refereeId;
            if (refereeID === undefined) {
                res.status(404).json({
                    message: "Referee Id is undefined"
                });
                return;
            }

            await refereeDB.findOneAndDelete({_id: refereeID});
            res.status(200).json({
                message: "Removing referee is successful"
            });
        } catch(e) {
            res.status(404).json({
                message: "Referee ID not found"
            });
        }
    },

    update: async function(req, res, next) {
        try {
            const id = req.body.refereeId;
            if (id === undefined) {
                res.status(404).json({
                    message: "referee id is undefined"
                });
                return;
            }

            const aReferee = await refereeDB.findById(id);
            for (member in req.body) {
                if (member != "refereeId") {
                    aReferee[member] = req.body[member];
                }
            }

            await aReferee.save();
            res.status(200).json({
                message: "updating referee is successful"
            });
        } catch(e) {
            res.status(404).json({
                message: "referee id is not found"
            });
        }
    },

    search: async function(req, res, next) {
        try {
            let val = req.query.name;
            if (val === undefined) {
                val = "";
            }

            const list = await refereeDB.find({name: {"$regex": val, "$options": "i"}});
            res.status(200).json(list);
        } catch(e) {
            res.status(404).json({
                message: e.message
            });
        }
    },

    getInfo: async function(req, res, next) {
        try {
            const refereeId = req.query.refereeId;
            if (refereeId === undefined) {
                res.status(404).json({
                    message: "referee id is undefined"
                });
                return;
            }

            const referee = await refereeDB.findById(refereeId);
            res.status(200).json(referee);
        } catch(e) {
            res.status(404).json({
                message: "referee id is not found"
            });
        }
    }
}