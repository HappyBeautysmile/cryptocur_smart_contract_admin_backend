const {User,usersessionmodel} = require("../../models/Users");
const BASECONTROL = require("../../controller/indexcontroller");
const Config = require("../index")
const expires = Config.expiretime;

const auth = {
    
    // checks if the user is logged in, if not, redirect to the 
    // unauthorized route
    isLoggedIn: async (req, res, next)=> {

        var hash = decodeURIComponent(req.headers.authorization);
        var decod = BASECONTROL.decrypt(hash);

        // console.log("here is there?");
        if(decod){
            decod = JSON.parse(decod);
            let user = await BASECONTROL.BfindOne(User,{_id : decod._id});
            if(user){
                req.user = user;
                // console.log(user.email)
                let last = await BASECONTROL.BfindOne(usersessionmodel,{hash:hash});
                if(last){
                    let passtime = (new Date().valueOf() - parseInt(last.inittime))/1000;
                    console.log("---- passtime -----",passtime)
                    if(passtime > expires){
                        await BASECONTROL.BfindOneAndDelete(usersessionmodel,{hash:hash});
                        return res.json({session : true});
                    }else{
                        let up =  await BASECONTROL.BfindOneAndUpdate(usersessionmodel,{hash:hash},{inittime:new Date().valueOf()});
                    }
                }else{
                    let row = {
                        hash:hash,
                        inittime:new Date().valueOf(),
                        email :user.email,
                    }
                    await BASECONTROL.data_save(row,usersessionmodel);
                }
                next();
            }else{
                return res.json({session : true});
            }
        }else{
            return res.json({session : true});
        }
    },

    // middleware function to log out the user
    logoutUser: async (req, res, next)=> {
        var hash = decodeURIComponent(req.headers.authorization);
        await BASECONTROL.BfindOneAndDelete(usersessionmodel,{hash:hash});
        res.send({status : true});
        return next();
    },

}

module.exports = auth;
