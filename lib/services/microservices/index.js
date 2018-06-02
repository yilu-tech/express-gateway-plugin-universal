const Microservice = require('./microservice');

const logger = require('express-gateway/lib/logger').plugins;
/**
 * 启动的时候初始化一次 路由
 * 或者
 * 从microservice 注册路由  php artisan gateway:publish
 */
const gatewayConfig = require('express-gateway/lib/config').gatewayConfig;
const serviceEndpointsConfig = gatewayConfig.serviceEndpoints;

class Microservices{

    constructor(){
        this.services = {};
    }

    init(apiManager){
        this.apiManager = apiManager;
        this.create();
        this.getRemoteRoutes();
    }
    create(){
        for(var name in serviceEndpointsConfig){
            var service = serviceEndpointsConfig[name];
            if(service.microservice){
                this.services[name] = new Microservice(this,name,service.url,service.microservice);
            }
        }
    }
    
    
    getRemoteRoutes(){
        for(var name in this.services){
            var microservice = this.services[name];
            if(microservice.options.apisRemoteUrl){
                microservice.getApis();
            }
        }
    }

    getApis(){
        var apis = [];
        for(var i in this.services){
            var service = this.services[i];
            apis = apis.concat(service.apis);
        }
        return apis;
    }
}


module.exports = new Microservices();
