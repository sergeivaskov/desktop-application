const assert = require('node:assert/strict');
const { describe, it } = require('node:test');

describe('axios correlation ID interceptor', () => {
  it('axios.create should be a function', () => {
    const axios = require('axios');
    assert.equal(typeof axios.create, 'function');
  });

  it('should add interceptor to axios instance', () => {
    const { v4: uuidv4 } = require('uuid');
    const axios = require('axios');
    
    const instance = axios.create();
    instance.interceptors.request.use(config => {
      if (!config.headers['X-Correlation-ID']) {
        config.headers['X-Correlation-ID'] = uuidv4();
      }
      return config;
    });

    assert.ok(instance.interceptors.request.handlers.length > 0);
  });

  it('interceptor should inject UUID', () => {
    const { v4: uuidv4 } = require('uuid');
    const axios = require('axios');
    
    const instance = axios.create();
    instance.interceptors.request.use(config => {
      if (!config.headers['X-Correlation-ID']) {
        config.headers['X-Correlation-ID'] = uuidv4();
      }
      return config;
    });

    const config = {
      url: 'http://example.com',
      method: 'get',
      headers: {},
    };

    const handler = instance.interceptors.request.handlers[0];
    const modified = handler.fulfilled(config);

    assert.ok(modified.headers['X-Correlation-ID']);
    assert.match(
      modified.headers['X-Correlation-ID'],
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
    );
  });

  it('should preserve existing correlation ID', () => {
    const { v4: uuidv4 } = require('uuid');
    const axios = require('axios');
    
    const existingId = 'existing-uuid-123';
    const instance = axios.create();
    instance.interceptors.request.use(config => {
      if (!config.headers['X-Correlation-ID']) {
        config.headers['X-Correlation-ID'] = uuidv4();
      }
      return config;
    });

    const config = {
      url: 'http://example.com',
      method: 'get',
      headers: {
        'X-Correlation-ID': existingId,
      },
    };

    const handler = instance.interceptors.request.handlers[0];
    const modified = handler.fulfilled(config);

    assert.equal(modified.headers['X-Correlation-ID'], existingId);
  });
});
