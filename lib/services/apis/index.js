var localApisService = require('./localApis');
var microservice = require('../microservices')
var EventEmitter = require('events').EventEmitter; 
const logger = require('express-gateway/lib/logger').plugins;
class Apis{
    constructor(){
        this.event = new EventEmitter(); 

        localApisService.init(this);//本地接口初始化
        microservice.init(this); //微服务接口初始化

        this.mergeItems();//合并接口
        this.onChange(()=>{ //监控接口变化，再次合并
            this.mergeItems();
        })
    }

    all(){
        return this.items;
    }

    mergeItems(){
        this.items = localApisService.all();
        this.items = this.items.concat(microservice.getApis());
    }


    emitChange(service){
        logger.info(`microservice apis manager: <${service.name} serviceEndpoints> is updated.`)
        this.event.emit('changed');
    }
    onChange(fn){
        this.event.on('changed',fn);
    }


}



module.exports = new Apis();