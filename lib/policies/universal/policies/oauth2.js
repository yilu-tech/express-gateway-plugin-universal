var oauth2Policy = require('express-gateway/lib/policies/oauth2').policy;
var jwtService = require('../../../services/jwt');

module.exports = {
    name: 'api-auth-oauth2',
    policy: (authTypeHandler,policyConfig) => {
        return async function(req,res,next){
            //当前消费者类型拥在此api的授权范围,进入oauth2有效性验证
            var oauth2Config = policyConfig;
            const params = Object.assign({ getCommonAuthCallback: req._actionParams.getCommonAuthCallback }, oauth2Config.action);
            var oauth2PolicyMiddleware = oauth2Policy(params);
            oauth2PolicyMiddleware(req,res,next);
        }
    }
};



