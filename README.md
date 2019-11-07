[![GitHubStatus for D4H/angular-http-cache](https://github.com/d4h/decisions-mobile-apps/workflows/Test%20@d4h/decisions-mobile-apps/badge.svg)](https://www.npmjs.com/package/@d4h/angular-http-cache)
![npm](https://img.shields.io/npm/v/@d4h/angular-http-cache.svg)

# @d4h/angular-http-cache

angular-http-cache offers a pair of tools:

- A network caching [interceptor](https://angular.io/guide/http#http-interceptors) for Angular's [HttpClient](https://angular.io/guide/http). It works by storing request success request responses in an internal cache, and returning this response from the cache so long as the TTL has not expired.
- An [Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) service to test for element visibility.

You really should not ever have need to either of these tools. Conventional [HTTP cache mechanisms](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching) are frankly superior to the interceptor, and [ng-lazyload-image](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) offers more robust lazy loading. You should only have to resort these tools in special circumstances. What these are you will know best yourself.

## Installation

`npm install --save @d4h/angular-http-cache`

## Configuration
**angular-http-cache does not work without further configuration.** It requires a finder function which accepts a [`HttpRequest`](https://angular.io/api/common/http/HttpRequest) and returns an object with two pieces of data:

1. A string `key`, under which to store the request.
2. An integer `ttl` in seconds, how long to store and return a successful response. Error responses are never cached, which permits retry.

Both the key and TTL are entirely up to the implementing developer.

```typescript
export interface HttpRequestCache {
  key: string;
  ttl: number;
}

export interface HttpCacheConfig {
  finder(req: HttpRequest<any>): HttpRequestCache;
}
```

### Configuration Example
In this example, the key is the full request URL, while TTL comes from a regular expression test. Requests to `/foo/bar/:id` will be cached for `300` seconds, and requests to `/fizz/buzz/:id` cached for 10.

```typescript
import { HttpCacheConfig, HttpCacheModule, HttpRequestCache } from '@d4h/angular-http-cache';

export interface CachedRoute {
  regex: RegExp;
  ttl: number;
}

export const cachedRoutes: Array<CachedRoute> = [
  { regex: /\/foo\/bar\/\d+/, ttl: 300 },
  { regex: /\/fizz\/buzz\/\d+/, ttl: 10 }
];

export const config: HttpCacheConfig = {
  finder(req: HttpRequest<any>): HttpRequestCache {
    const route = cachedRoutes.find((r: CachedRoute) => r.regex.test(req.url));

    return {
      key: req.url,
      ttl: route ? route.ttl : null
    };
  }
};

@NgModule({
  imports: [
    HttpCacheModule.forRoot(config)
  ]
})
export class AppInterceptorModule {}
```

## Element Interserction Observer Service
`IntersectionService` is quite straigtfoward: import it and pass in any [`ElementRef`](https://angular.io/api/core/ElementRef). In the below example `GooseComponent` performs `mischief` when it is visible.

```typescript
import { IntersectionService } from '@d4h/angular-http-cache';

export class GooseComponent implements OnInit {
  mischief$: Observable<Mischief>;

  constructor(
    private readonly gooseService: GooseService,
    private readonly host: ElementRef,
    private readonly intersectionService: IntersectionService
  ) {}

  ngOnInit(): void {
    this.mischief$ = this.intersectionService.visible(this.host).pipe(
      filter(Boolean),
      switchMap(() => this.gooseService.mischief(this.goose).pipe(
        startWith({ type: 'honk' })
      )),
    );
  }
}
```

## Support and Feedback
Feel free to email <support@d4h.org>, [open an issue](https://github.com/D4H/angular-http-cache/issues/new) or tweet [@d4h](https://twitter.com/d4h/).

## License
Copyright (C) 2019 [D4H](https://d4htechnologies.com/)

Licensed under the [MIT](LICENSE) license.
