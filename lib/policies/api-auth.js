var oauth2Policy = require('express-gateway/lib/policies/oauth2').policy;
const logger = require('express-gateway/lib/logger').policy;
const jwt = require('jsonwebtoken');
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

            // if(process.env.APP_ENV == 'dev'){
            //     return devHandler(actionParams,req,res,next)
            // }

            return authHandler(actionParams,req,res,next);

        };
    }
};

function decodeJwt(token){
    token = token.replace(/Bearer /,'');
    return jwt.decode(token);
}

function headersHandler(req,res,typePamras){
    for(var name in typePamras.headers){
        if(eval(typePamras.headers[name]) == undefined){
            return res.status(401).send({message:`${typePamras.headers[name]} is undefined.`});
        }

        req.headers[name] = eval(typePamras.headers[name]);
       
    }
}

//作废，暂时不考虑
function devHandler(actionParams,req,res,next){
    // 如果认证类型不存在，作为开放接口处理，不进行token认证。
    if(!req._jwt.iss || req._api.auth == '*'){ 
        return next();
    }
    //oauth2 验证
    return oauth2(actionParams,req,res,next);
}
/**
 * 非开发模式
 */
function authHandler(actionParams,req,res,next){
    // 接口定义不存在 强制结束
    if(!req._api){
        return res.status(404).send({message:`This api not found.`});
    }

    // 如果认证类型不存在但为公开接口，跳过认证
    // if(!req.headers['auth-type'] && req._api.auth == '*'){ 
    if(req._api.auth == '*'){ 
        return next();
    }

     /******正式判断开始******/
    //如果接口权限类型既不是 * ,也不是数组，接口定义错误
    if(req._api.auth != "*" && !Array.isArray(req._api.auth)){
        return res.status(404).send({message:`api-auth: ${req.url} auth type definetion error '${req.headers['auth-type']}'.`});
    }

    if(!req.headers['authorization']){
        return res.status(401).send({message:`Authorization token is required.`});
    }

    
    req._jwt = decodeJwt(req.headers['authorization']);

    if(!req._jwt){
        return res.status(401).send({message:`Invalid Token.`});
    }
    
    if(!req._jwt.iss){
        return res.status(401).send({message:`Jwt iss is required.`});
    }
    //header转发
    headersHandler(req,res,actionParams.types[req._jwt.iss]);
        
    

    //当前请求的类型是否在接口允许的类型中
    if(req._api.auth.indexOf(req._jwt.iss) == -1){
        return res.status(401).send({message:`api-auth: ${req._jwt.iss} Not allowd access this api.`});
    }


    var allowedTypes = Object.keys(actionParams.types);

    //当前请求的类型在pipline的权限判断中是否是许可类型
    if(allowedTypes.indexOf(req._jwt.iss) == -1){
        return res.status(401).send({message:`api-auth: Not allowd access this api.`});
    }

    //oauth2 验证
    return oauth2(actionParams,req,res,next);
}


function oauth2(actionParams,req,res,next){
    var oauth2Config = actionParams.types[req._jwt.iss];
    const params = Object.assign({ getCommonAuthCallback: actionParams.getCommonAuthCallback }, oauth2Config);
    var oauth2PolicyMiddleware = oauth2Policy(params);
    return oauth2PolicyMiddleware(req,res,next);
}


