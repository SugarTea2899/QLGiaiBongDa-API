const regulationDB = require('../models/regulation');


module.exports = {
    update: async function(req, res, next){
        try {
            const info = req.body;
            const regulation = await regulationDB.findOne();
            
            for (member in info){
                regulation[member] = info[member]
            }
            await regulation.save();
            res.status(200).json({
                message: "update successfully"
            });
        } catch (e) {
            res.status(404).json({
                message: e.message
            });
        }
    }
}