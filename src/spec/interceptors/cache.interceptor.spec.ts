import faker from 'faker';
import { BAD_REQUEST, getStatusText } from 'http-status-codes';
import { HTTP_INTERCEPTORS, HttpClient, HttpResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import {
  HttpClientTestingModule,
  HttpTestingController,
  TestRequest
} from '@angular/common/http/testing';

import { CacheInterceptor } from '../../lib/interceptors';
import { CacheService } from '../../lib/services';
import { Config, HTTP_CACHE_CONFIG, RequestCache } from '../../lib/providers';

describe('CacheInterceptor', () => {
  let cache;
  let config;
  let http: HttpTestingController;
  let httpClient: HttpClient;
  let req: TestRequest;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        {
          provide: CacheService,
          useValue: jasmine.createSpyObj('cache', ['get', 'set'])
        },
        {
          provide: HTTP_CACHE_CONFIG,
          useValue: jasmine.createSpyObj('config', ['finder'])
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: CacheInterceptor,
          multi: true
        }
      ]
    });

    cache = TestBed.get(CacheService);
    config = TestBed.get(HTTP_CACHE_CONFIG);
    http = TestBed.get(HttpTestingController);
    httpClient = TestBed.get(HttpClient);
  });

  describe('intercept', () => {
    let body: any;
    let key: string;
    let res: HttpResponse<any>;
    let ttl: number;
    let url: string;

    beforeEach(() => {
      body = { [faker.random.uuid()]: faker.random.uuid() };
      key = faker.random.uuid();
      ttl = faker.random.number();
      url = '/foo/bar';
      res = new HttpResponse({ url, body });
    });

    it('should call config.finder', () => {
      config.finder.and.returnValue({ key, ttl });

      httpClient.get(url).subscribe(() => {
        expect(config.finder).toHaveBeenCalled();
      });

      req = http.expectOne({ url });
      req.flush(body);
    });

    it('should not call cache.get when key is not a string', () => {
      config.finder.and.returnValue({ key: null, ttl });

      httpClient.get(url).subscribe(() => {
        expect(cache.get).not.toHaveBeenCalled();
      });

      req = http.expectOne({ url });
      req.flush(body);
    });

    it('should not call cache.get when TTL is not an integer', () => {
      config.finder.and.returnValue({ key: null, ttl });

      httpClient.get(url).subscribe(() => {
        expect(cache.get).not.toHaveBeenCalled();
      });

      req = http.expectOne({ url });
      req.flush(body);
    });

    it('should call cache.get when key is a string and TTL is an integer', () => {
      config.finder.and.returnValue({ key, ttl });

      httpClient.get(url).subscribe(() => {
        expect(cache.get).toHaveBeenCalledWith(key);
      });

      req = http.expectOne({ url });
      req.flush(body);
    });

    it('should write a success response to the cache', () => {
      config.finder.and.returnValue({ key, ttl });

      httpClient.get(url).subscribe(() => {
        expect(cache.set).toHaveBeenCalledWith(key, res, ttl);
      });

      req = http.expectOne({ url });
      req.flush(body);
    });

    it('should not cache an error response', () => {
      config.finder.and.returnValue({ key, ttl });

      httpClient.get(url).subscribe(() => {}, () => {
        expect(cache.set).not.toHaveBeenCalled();
      });

      req = http.expectOne({ url });

      req.flush(body, {
        status: BAD_REQUEST,
        statusText: getStatusText(BAD_REQUEST)
      });
    });

    /**
     * This test:
     *
     * - Saves a hypothetical prior response to the cache.
     * - Asserts no network requests are made.
     * - Assets the response body is equal to that of the cached response.
     */

    it('should return a cached response for subsequent responses', () => {
      config.finder.and.returnValue({ key, ttl });
      cache.get.and.returnValue(res);

      httpClient.get(url).subscribe(response => {
        expect(response).toEqual(body);
      });

      httpClient.get(url).subscribe(response => {
        expect(response).toEqual(body);
      });

      http.expectNone({ url });
    });
  });
});
