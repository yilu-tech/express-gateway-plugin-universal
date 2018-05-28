var fs = require('fs-extra');
var path = require('path');
var yaml = require('js-yaml');
var watch = require('watch');
var walkSync = require('walk-sync');
const logger = require('express-gateway/lib/logger').config;

var configPath = path.join(process.cwd(),'config/apis');
var EventEmitter = require('events').EventEmitter; 


exports.event =  _event = new EventEmitter(); 
var _apis =  [];

loadFiles();
watch.watchTree(configPath,watchChange);

var first = true;
function watchChange(f, curr, prev){
    if(first){
        console.info('Api watch start');
        first = false;
        return;
    }
    loadFiles();
    _event.emit('reload'); 
    console.info('Apis config reload.')
}





function loadFiles(){
    console.info('----->load apis start.')
    _apis =  []
    var files = walkSync(configPath, { globs: ['**/*.yml'] });

    for(var i in files){
        var file = path.join(configPath,files[i]);
        // console.log(file);
        var doc =  loadFile(file);
        if(!doc.apis){
            logger.error('\n\nyilu-api: ',`${file} not define apis property.\n\n`);
        }


        var apis = doc.apis;
        parseFileApis(apis);
    }
    console.info('----->load apis end.',`A total of ${_apis.length} api.`);

    
}


function parseFileApis(apis){
    for(var i in apis){
        _apis.push(apis[i]);
    }
}


function loadFile(file){
    var fileContent = fs.readFileSync(file,'utf8');
    var doc = yaml.safeLoad(fileContent);
    return doc;
}



exports.all = function(){
    return _apis;
}

exports.onReload = function(){

}

// exports.edit = function(api){
//     var splitPath = api.path.split('/');
//     var serviceName = splitPath[1];
//     var moduleName = splitPath[2];
//     var filePath = path.join(configPath,serviceName,`${moduleName}.yml`);
//     if(fs.existsSync(filePath)){
//         var doc =  loadFile(filePath);
//     }else{
//         return console.error(`${filePath} not exist.`)
//     }

//     doc.apis.forEach(function(item){
//         if(item.path == api.path){
//             Object.assign(item,api);
//         }
//     })
//     var newDoc = yaml.safeDump(doc);
//     console.info('添加新的接口',newDoc);
//     fs.outputFileSync(filePath,newDoc);
// }