const logger = require('express-gateway/lib/logger').policy;

module.exports = {
    name: 'api-rbac',
    schema: {
        $id: 'http://express-gateway.io/schemas/policies/api-rbac-policy.json',
        type: "object",
        properties: {
        }
    },
    policy: (actionParams) => {
        return async function(req,res,next){
            logger.debug(`api-rbac: ${req.url} Through.`)
            next();
        };
    }
};



