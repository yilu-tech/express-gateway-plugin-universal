const Microservice = require('./microservice');

const logger = require('express-gateway/lib/logger').plugins;
/**
 * 启动的时候初始化一次 路由
 * 或者
 * 从microservice 注册路由  php artisan gateway:publish
 */
const config = require('express-gateway/lib/config');

const eventBus = require('express-gateway/lib/eventBus');
class Microservices{

    constructor(){
        this.services = {};
        eventBus.on('hot-reload',  ({ type, newConfig })=> {
            for(var name in this.services){
                delete this.services[name];
            }
            this.create();
            this.getRemoteRoutes();
        });
        //定期重新加载失败的服务
        this.reloadFailed();
    }

    init(apiManager){
        this.apiManager = apiManager;
        this.create();
        this.getRemoteRoutes();
    }
    create(){
        for(var name in config.gatewayConfig.serviceEndpoints){
            var service = config.gatewayConfig.serviceEndpoints[name];
            if(service.microservice){
                this.services[name] = new Microservice(this,name,service.url,service.microservice);
            }
        }
    }

    reloadFailed(){

        setInterval(()=>{
            for(var name in this.services){
                var microservice = this.services[name];
                if(microservice.status == false){
                    microservice.getApis();
                }
            }
        },8000)
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
