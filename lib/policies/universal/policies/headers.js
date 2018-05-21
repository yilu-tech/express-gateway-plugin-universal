const ipFilter = require('ip-filter')
const requestIp = require('request-ip');
module.exports = {
    name: 'api-auth-header',
    policy: (authTypeHandler,policyConfig) => {
        return async function(req,res,next){
            for(var name in policyConfig){
                req.headers[name] = eval(policyConfig[name])
            }
            return next();
        }
    }
};



