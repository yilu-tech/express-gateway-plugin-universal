
const express = require('express');
module.exports = {
  version: '1.0.0',
  init: function (pluginContext) {
  

    pluginContext.registerPolicy(require('./lib/policies/universal'));//注册政策
  },
};