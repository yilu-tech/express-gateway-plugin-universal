const logger = require('express-gateway/lib/logger').policy;
var maps = require('./universal/maps');
module.exports = {
    name: 'api-match',
    schema: {
        $id: 'http://express-gateway.io/schemas/policies/api-match-policy.json',
        type: "object",
        properties: {
        }
    },
    policy: (actionParams) => {
        return async function(req,res,next){
            if(process.env.APP_ENV == 'dev'){
                logger.debug(`api-match: ${req.url} (dev mode forced to pass.)`)
                return  next();     
            }
            var api = maps.match(req);
            if(!api){
                return res.status(404).send({message:`This api not found.`});
            }
            
            req._api = api;
            return next();
        };
    }
};



