const logger = require('express-gateway/lib/logger').policy;
var maps = require('../services/maps');//todo::根据piplines使用的serverEndpoint取生成map.1. 实现不同pipeline的隔离 2.提高匹配速度
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
            var api = maps.match(req);

            // if(process.env.APP_ENV == 'dev'){
            //     logger.debug(`api-match: ${req.url} (dev mode forced to pass.)`) 
            // }
            // else if(!api){
            //     return res.status(404).send({message:`This api not found.`});
            // }
            if(!api){
                return res.status(404).send({message:`This api not found.`});
            }
            
            req._api = api;
            return next();
        };
    }
};



