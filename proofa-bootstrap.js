const { v4: uuidv4 } = require('uuid');
const axios = require('axios');

// Patch axios.create to automatically add the X-Correlation-ID interceptor
// This ensures that any axios instance created (including by @amazingcat/node-cattr)
// will have this interceptor, without needing to modify the core files.
const originalCreate = axios.create;
axios.create = function() {
  const instance = originalCreate.apply(this, arguments);
  instance.interceptors.request.use(config => {
    config.headers['X-Correlation-ID'] = uuidv4();
    return config;
  });
  return instance;
};

// Start the actual application
require('./app/src/app.js');
