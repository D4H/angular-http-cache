import { HttpRequest } from '@angular/common/http';
import { InjectionToken } from '@angular/core';

/**
 * Interceptor Configuration
 * =============================================================================
 */

export interface Finder {
  key(req: HttpRequest<any>): string;
  ttl(req: HttpRequest<any>): number;
}

export interface Config {
  finder: Finder;
}

export const defaultConfig: Config = {
  finder: {
    key: (req: HttpRequest<any>) => null,
    ttl: (req: HttpRequest<any>) => null
  }
};

export const HTTP_CACHE_CONFIG = new InjectionToken<Config>(
  'HTTP_CACHE_INTERCEPTOR_CONFIG'
);
