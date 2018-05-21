var path = require('path');
var yaml = require('js-yaml');
var fs = require('fs-extra');

var eventBus = require('express-gateway/lib/eventBus');
var egConfig = require('express-gateway/lib/config');
const schemas = require('express-gateway/lib/schemas');

egConfig.configTypes['universal'] = { 
    baseFilename: 'universal.config',
    validator: schemas.register('config', 'universal.config', require('./schemas/universal.config.json')),
    pathProperty: 'universalConfigPath',
    configProperty: 'universalConfig'
}

egConfig.loadConfig('universal');

exports.get = function(key){
    return egConfig['universalConfig'][key];
}

exports.realod = function(){
    egConfig.loadConfig('universal');
}

exports.watch = function(){
    egConfig.watcher.add(egConfig.apiAuthConfigPath);
}
eventBus.on('admin-ready', function ({ adminServer }) {
    require('./config').watch();
  });


