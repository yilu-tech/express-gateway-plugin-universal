var maps = require('./maps');
var handler = require('./handler');

module.exports = {
    name: 'universal',
    schema: {
        $id: 'http://express-gateway.io/schemas/policies/universal-policy.json',
        type: "object",
        properties: {
            oauth2: { '$ref': 'oauth2.json'}
        }
    },
    policy: (actionParams) => {
        return async function(req,res,next){

            
            if(req.method == 'OPTIONS'){
                return next();
            }

            var api = maps.match(req);

            if(!api){
                return res.status(404).send(`GW: This api ${req.method} ${req.path}  does not exist.`);
            }
            
            //进行各项验证
            req._actionParams = actionParams;
            handler.run(api)(req,res,next);
        };
    }
};



