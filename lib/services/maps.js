var Layer = require('express/lib/router/layer');
var apisService = require('./apis');




class Maps{


    constructor(){
        this.init();
        var self = this;
        apisService.event.on('reload',function(){
            self.reload();
            console.log('yilu-api: ','Reload api maps.');
        })
    }

    init(){
        this.stack = [];
        var apis = apisService.all();

        for(var i in apis){
            var api = apis[i];
            this.route(api);
        }
    }


    route(api) {
        var layer = new Layer(api.path, {
          sensitive: false,
          strict: false,
          end: true
        }, function(){
    
        });
        layer.api = api;
        this.stack.push(layer);
    };

    match(req){
        for(var i in this.stack){
            var layer = this.stack[i];
            if(!this.matchLayer(layer,req.path)){ //如果没有匹配到路径，跳过匹配下一个
                continue;
            }
            
            //匹配到路径
            if(layer.api['method'] == "*" ){ //如果没有定义method或者为*，直接返回接口
                return layer.api;
            }else if(layer.api['method'] == req.method.toUpperCase()){ //如果method和定义的相同，返回接口
                return layer.api;
            }else{  //匹配到路径，但是没有匹配到method的输入到控制台
                console.log(`${req.path} not support ${req.method.toUpperCase()}`)
            }
        }

        return null;
    }
    matchLayer(layer, path){
        try {
            return layer.match(path);
          } catch (err) {
            return err;
          }
    }

    reload(){
        this.init();
    }
}

module.exports = new Maps();

