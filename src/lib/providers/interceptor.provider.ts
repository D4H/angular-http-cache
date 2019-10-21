import { HttpRequest } from '@angular/common/http';
import { InjectionToken } from '@angular/core';

/**
 * Interceptor Configuration
 * =============================================================================
 */

export interface RequestCache {
  key: string;
  ttl: number;
}

export interface Config {
  finder(req: HttpRequest<any>): RequestCache;
}

export const defaultConfig: Config = {
  finder(req: HttpRequest<any>): RequestCache {
    return {
      key: null,
      ttl: null
    };
  }
};

export const HTTP_CACHE_CONFIG = new InjectionToken<Config>(
  'HTTP_CACHE_INTERCEPTOR_CONFIG'
);
