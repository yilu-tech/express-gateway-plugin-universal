var request = require('request-promise-native');
const logger = require('express-gateway/lib/logger').plugins;
class Microservice{
    
    constructor(manager,name,baseUrl,options){
        this.name = name;
        this.baseUrl = baseUrl;
        this.options = options;//todo:: 验证必要配置文件是否配置
        this.status = false;
        this.apis = [];
        this.manager = manager;
    }
    
    async getApis(){
        if(this.options.apisRemoteUrl.indexOf('http') > -1){
            var url = this.options.apisRemoteUrl;
        }else{
            var url = `${this.baseUrl}${this.options.apisRemoteUrl}`;
        }
        
        try{
            var ret = await request.get({
                url: url,
                headers:{
                    Accept:'application/json'
                }
            });
            this.parseAndSaveApis(ret);
            this.status = true;
        }catch(e){
            logger.error(`microservice: <${this.name} serviceEndpoints> ${e.message}`)
            this.status = false;
        }
    }

    parseAndSaveApis(ret){
        var apis = JSON.parse(ret);
        console.log(apis)
        for(var i in apis){
            var api = apis[i];
            if(!this.checkInModules(api)){
                throw new Error(`can not allowd ${api.path}.`);
            };
            if(!api["name"]){
                throw new Error(`${api.path} name is required.`);
            }
            if(!api["auth"]){
                throw new Error(`${api.path} auth is required.`);
            }
        }
        this.apis = apis;
        logger.info(`microservice: ${this.name} get apis succeed.`);
        this.manager.apiManager.emitChange(this);
    }

    checkInModules(api){
        for(var i in this.options.modules){
            var module = this.options.modules[i];
            if(api.path.indexOf(module) == 0) return true;
            else return false;
        }

    }

}


module.exports = Microservice;