[![Codeship Status for D4H/api-angular](https://app.codeship.com/projects/3862bfd0-911f-0137-6172-7e8373628817/status?branch=master)](https://app.codeship.com/projects/356368)
![npm](https://img.shields.io/npm/v/@d4h/angular-http-cache.svg)

# @d4h/angular-http-cache

angular-http-cache is a network caching [interceptor](https://angular.io/guide/http#http-interceptors) for Angular's [HttpClient](https://angular.io/guide/http). It works by storing request success request responses in an internal cache, and returning this response from the cache so long as the TTL has not expired.

You really should not ever have need to use this interceptor. Conventional [HTTP cache mechanisms](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching) are frankly superior, and you should only have to resort to this interceptor in special circumstances. What these are you will know best yourself.

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

## Support and Feedback
Feel free to email <support@d4h.org>, [open an issue](https://github.com/D4H/angular-http-cache/issues/new) or tweet [@d4h](https://twitter.com/d4h/).

## License
Copyright (C) 2019 [D4H](https://d4htechnologies.com/)

Licensed under the [MIT](LICENSE) license.
