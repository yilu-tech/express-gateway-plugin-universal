var oauth2Policy = require('express-gateway/lib/policies/oauth2').policy;
const logger = require('express-gateway/lib/logger').policy;

module.exports = {
    name: 'api-auth',
    schema: {
        $id: 'http://express-gateway.io/schemas/policies/api-auth-policy.json',
        type: "object",
        properties: {
        }
    },
    policy: (actionParams) => {
        return async function(req,res,next){
            logger.debug(`api-auth: ${req.url} Through.`)
            
            //非开发模式 且 接口定义不存在 强制结束
            if(process.env.APP_ENV != 'dev' && !req._api){
                return res.status(404).send({message:`This api not found.`});
            }
            // 如果认证类型不存在 且为  开发模式或者公开接口
            if(!req.headers['auth-type'] && (process.env.APP_ENV == 'dev' || req._api.auth == '*')){ 
                return next();
            }

            /******正式判断开始******/
            //如果接口权限类型既不是 * ,也不是数组，接口定义错误
            if(req._api.auth != "*" && !Array.isArray(req._api.auth)){
                return res.status(404).send({message:`api-auth: ${req.url} auth type definetion error '${req.headers['auth-type']}'.`});
            }
            
            //当前请求的类型是否在接口允许的类型中
            if(req._api.auth.indexOf(req.headers['auth-type']) == -1){
                return res.status(404).send({message:`api-auth: ${req.headers['auth-type']} Not allowd access this api.`});
            }


            var allowedTypes = Object.keys(actionParams.types);

            //当前请求的类型在pipline的权限判断中是否是许可类型
            if(allowedTypes.indexOf(req.headers['auth-type']) == -1){
                return res.status(404).send({message:`api-auth: Not allowd access this api.`});
            }

            //oauth2 验证
            var oauth2Config = actionParams.types[req.headers['auth-type']];
            const params = Object.assign({ getCommonAuthCallback: actionParams.getCommonAuthCallback }, oauth2Config);
            var oauth2PolicyMiddleware = oauth2Policy(params);
            oauth2PolicyMiddleware(req,res,next);
        };
    }
};



