var jwt = require('jsonwebtoken');
var userSrv = require('express-gateway/lib/services/consumers/user.service')
exports.reqDecode = function(req){
    if(req.headers['authorization']){
        var token = req.headers['authorization'];
        token = token.replace(/Bearer /,'');
        return jwt.decode(token);
    }else{
        return null;
    }
}

// exports.isJwt() = function(req){
//     if(req.headers['authorization'].indexOf('Bearer') >=0 ){
//         return true;
//     }else{
//         return false;
//     }
// }

