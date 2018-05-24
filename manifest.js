
const express = require('express');
module.exports = {
  version: '1.0.0',
  init: function (pluginContext) {
  

    pluginContext.registerPolicy(require('./lib/policies/universal'));//注册政策
    pluginContext.registerPolicy(require('./lib/policies/api-match'));//注册api-match政策
    pluginContext.registerPolicy(require('./lib/policies/api-auth'));//注册api-auth政策
    pluginContext.registerPolicy(require('./lib/policies/api-rbac'));//注册api-rbac政策
  },
};