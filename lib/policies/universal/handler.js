var config; //todo::remove
var express = require('express');
var eventBus = require('express-gateway/lib/eventBus');
var jwtService = require('../../services/jwt');

class TypeHandler{
    constructor(name,config){
        this.name = name;
        this.config = config;
        this.policies = [];
        this.router = express.Router();
        this.init();
    }

    init(){
        var self = this;
        for(var policyName in this.config['policies']){
            var policyConfig = this.config['policies'][policyName];
            try{
                var policy = require(`./policies/${policyName}`).policy;
            }catch(e){
                console.error(e);
            }
            this.router.use(policy(this,policyConfig))
        }
    }

    run(req,res,next){
        this.router(req,res,next);
    }
}


class Handler{

    constructor(){
        var self = this;
        this.init();
        eventBus.on('hot-reload', function ({ type, newConfig }) {
            config.realod();
            self.init();
            console.info('--->ApiTypeHandler reload.');
        });
    }
    //初始化所有typeHandler
    init(){
        this.handlers = {};
        var typesConfig = config.get('types');
        for(var name in typesConfig){
            var typeHandler = new TypeHandler(name,typesConfig[name]);
            this.handlers[name] = typeHandler;
        }
    }

    run(api){
        var self = this;
        return function(req,res,next){
            var authType = self.getAuthType(req,res);

            var typeHandler = self.getHandler(api,authType);

            if(typeof typeHandler == 'object'){
                typeHandler.run(req,res,next);
            }else{
                return res.status(401).send(`GW: ${req.path} not allowd AUTH-TYPE is ${typeHandler}.`);
            }
            
        }
    }

    getAuthType(req,res){
        
        
        var jwtPayload = jwtService.reqDecode(req);

        if(jwtPayload && jwtPayload.authType){
            req._jwt = jwtPayload;
            return jwtPayload.authType;
        }

        if(req.headers['auth-type']){
            return req.headers['auth-type'];
        }
    }
    getHandler(api,authType){
        if(authType && api.auth.indexOf(authType) >= 0){  //如果有指定认证类型，且当前api允许次类型
            return this.handlers[authType];
        }
        if(authType && api.auth == '*'){  //如果指定类型，且当前api为公开接口,进入指定类型的handler进行处理
            return this.handlers[authType]
        }
        if(!authType && api.auth == '*'){  //如果没有指定类型，且当前api为公开接口
            return this.handlers['default']
        }
        return authType;  //有指定认证类型，但没有匹配
    }
    
}


module.exports = new Handler();



