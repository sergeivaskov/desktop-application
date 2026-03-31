const Module = require('module');
const originalRequire = Module.prototype.require;
Module.prototype.require = function(path) {
  if (path === 'electron') {
    return { app: { getPath: () => '/tmp', getAppPath: () => '/tmp' }, ipcRenderer: { on: () => {} } };
  }
  return originalRequire.apply(this, arguments);
};

const api = require('./app/src/base/api');
const config = { headers: {} };
const interceptor = api.axios.interceptors.request.handlers[0];
if (interceptor) {
  const result = interceptor.fulfilled(config);
  console.log("Generated Correlation ID:", result.headers['X-Correlation-ID']);
} else {
  console.log("No interceptor found!");
}
