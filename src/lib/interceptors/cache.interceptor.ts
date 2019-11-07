import { HttpEvent, HttpResponse } from '@angular/common/http';
import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Inject, Optional } from '@angular/core';
import { Observable, of } from 'rxjs';
import { mergeMap, take, tap } from 'rxjs/operators';

import { CacheService } from '../services/cache.service';
import { Config, HTTP_CACHE_CONFIG } from '../providers/interceptor.provider';

/**
 * Network Cache Interceptor
 * =============================================================================
 * This interceptor will cache the happy-path outcome of any network request,
 * with the request having a TTL set in seconds.
 *
 * The key and TTL finders are both injected through the config; the default
 * returns null values, meaning requests will never cache.
 *
 * The conditional flow:
 *
 *  - If: finder returns a string key and integer TTL.
 *    - Attempt to fetch previous response from cache.
 *    - If cached response found found:
 *      - Return cached response.
 *    - Else: Proceed with request.
 *      - If: Response not error:
 *        - Cache response.
 *      - Else:
 *        - Do not cache response, permitting retry.
 *  - Else: Next handler.
 */

@Injectable()
export class CacheInterceptor implements HttpInterceptor {
  constructor(
    @Inject(HTTP_CACHE_CONFIG) private readonly config: Config,
    private readonly cache: CacheService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const { key, ttl } = this.config.finder(req);

    if (typeof key === 'string' && Number.isInteger(ttl)) {
      return this.cacheRequest(req, next, key, ttl);
    } else {
      return next.handle(req);
    }
  }

  private cacheRequest(
    req: HttpRequest<any>,
    next: HttpHandler,
    key: string,
    ttl: number
  ): Observable<HttpEvent<any>> {
    const cachedResponse: HttpResponse<any> = this.cache.get(key);

    if (cachedResponse) {
      return of(cachedResponse);
    } else {
      return next.handle(req).pipe(
        tap((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            this.cache.set(key, event, ttl);
          }
        })
      );
    }
  }
}
