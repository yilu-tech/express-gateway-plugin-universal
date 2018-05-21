const ipFilter = require('ip-filter')
const requestIp = require('request-ip');
module.exports = {
    name: 'api-auth-ip-filter',
    policy: (authTypeHandler,policyConfig) => {
        return async function(req,res,next){
            var ipString = requestIp.getClientIp(req); 
            if(ipString == '::1' || ipString == "::ffff:"){
                var ip = '127.0.0.1';
            }else{
                var ip = ipString.replace(/::ffff:/,'');
            }
            
            
            if(!ipFilter(ip, policyConfig)){
                return res.status(401).send(`GW: Your ip "${ip}"  is not allowd.`);
            }

            return next();
        }
    }
};



