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
    }
}