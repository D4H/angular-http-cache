import { Config, defaultConfig, HTTP_CACHE_CONFIG } from '../../lib/providers';
import { InjectionToken } from '@angular/core';

describe('Cache Interceptor Providers', () => {
  describe('defaultConfig#finder', () => {
    it('should be a function', () => {
      expect(typeof defaultConfig.finder).toBe('function');
    });

    it('should return a matching object', () => {
      expect(defaultConfig.finder({} as any))
        .toEqual({ key: null, ttl: null });
    });
  });

  describe('HTTP_CACHE_CONFIG', () => {
    it('should equal the comparison injection key', () => {
      expect(HTTP_CACHE_CONFIG)
        .toEqual(new InjectionToken('HTTP_CACHE_INTERCEPTOR_CONFIG'));
    });
  });
});
