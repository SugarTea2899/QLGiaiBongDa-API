var bcrypt = require('bcryptjs');
const accountDB = require('../models/account');
const upload = require('../config/uploader');
const fs = require('fs');
const mySalt = 12;

module.exports = {
    add: async function(req, res, next){
        try{
            const accountInfo = req.body;
            const existAccount = await accountDB.findOne({username: accountInfo.username});

            if (existAccount !== null){
                res.status(404).json({
                    message: "Account's username exists."
                });
                return;
            }
			var accountPassword = accountInfo.password;
            var salt = bcrypt.genSaltSync(mySalt);
            var hash = bcrypt.hashSync(accountPassword, salt);

            const newAccount = new accountDB({
                username: accountInfo.username,
                password: hash
            });

            await newAccount.save();
            res.status(200).json({
                accountId: newAccount._id,
                message: "Success"
            });

        } catch(e){
            res.status(404).json({
                message: e.message
            })
        }
    },
    remove: async function(req, res, next){
        try{
            const username = req.body.username;
            if (username === undefined){
                res.status(404).json({
                    message: "Username is undefined."
                });
                return;
            }
            await accountDB.findOneAndDelete({username: username});
            res.status(200).json({
                message: "Account removed successfully"
            });
        }catch(e){
            res.status(404).json({
                message: "Account ID is not found"
            });
        }
    },
    authenticate: async function(req, res, next){
        try{
            const accountUsername = req.body.username;
            const accountPassword = req.body.password;
            const targetAccount = await accountDB.findOne({username: accountUsername});

            if (targetAccount == undefined){
                res.status(404).json({
                    message: "Username is undefined or not found."
                });
                return;
            }

            if (bcrypt.compareSync(accountPassword, targetAccount.password) === true)
            {
                res.status(200).json({
                    message: "Success"
                });
            }
            else {
                res.status(403).json({
                    message: "Incorrect username or password"
                });
            }
        }catch(e){
            res.status(404).json({
                message: e.message
            });
        }
    }
}
