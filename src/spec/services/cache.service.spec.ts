import faker from 'faker';
import { TestBed } from '@angular/core/testing';

import { Cache, CacheService, Fragment } from '../../lib/services';

describe('CacheService', () => {
  let cache: CacheService;
  let key: string;
  let ttl: number;
  let value: string;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CacheService
      ]
    });

    cache = TestBed.get(CacheService);
    key = faker.random.uuid();
    ttl = faker.random.number();
    value = faker.random.uuid();
  });

  it('should be created', () => {
    expect(cache).toBeTruthy();
  });

  describe('items', () => {
    it('should be an empty object', () => {
      expect(cache.items).toEqual({});
    });
  });

  describe('clear', () => {
    it('should be a function', () => {
      expect(typeof cache.clear).toBe('function');
    });

    it('should remove all cache items', () => {
      cache.set(key, value);
      expect(cache.has(key)).toBe(true);
      expect(cache.get(key)).toBe(value);
      cache.clear();
      expect(cache.has(key)).toBe(false);
      expect(cache.get(key)).toBe(null);
    });
  });

  describe('get', () => {
    it('should be a function', () => {
      expect(typeof cache.get).toBe('function');
    });

    it('should return null if item is not in cache.items', () => {
      expect(cache.items[key]).toBe(undefined);
      expect(cache.get(key)).toBe(null);
    });

    it('should return the item if it is in cache.items', () => {
      cache.set(key, value);
      expect(cache.items[key]).toBeTruthy();
      expect(cache.get(key)).toBe(value);
    });

    it('should remove the item from the cache if it has expired', () => {
      ttl = -10000000;
      cache.set(key, value, ttl);
      expect(cache.get(key)).toBe(null);
    });
  });

  describe('has', () => {
    it('should be a function', () => {
      expect(typeof cache.has).toBe('function');
    });

    it('should return true if key is in cache.items', () => {
      cache.set(key, value);
      expect(cache.items[key]).toBeTruthy();
      expect(cache.has(key)).toBe(true);
    });

    it('should return false if key is not in cache.items', () => {
      expect(cache.items[key]).toBe(undefined);
      expect(cache.has(key)).toBe(false);
    });

    it('should remove the item from the cache if it has expired', () => {
      ttl = -10000000;
      cache.set(key, value, ttl);
      expect(cache.has(key)).toBe(false);
      expect(cache.items[key]).toBe(undefined);
    });
  });

  describe('remove', () => {
    it('should be a function', () => {
      expect(typeof cache.remove).toBe('function');
    });

    it('should remove the key from the cache', () => {
      cache.set(key, value);
      expect(cache.has(key)).toBe(true);
      cache.remove(key);
      expect(cache.has(key)).toBe(false);
    });
  });

  describe('set', () => {
    it('should be a function', () => {
      expect(typeof cache.set).toBe('function');
    });

    it('should add an item to the cache', () => {
      expect(cache.has(key)).toBe(false);
      cache.set(key, value);
      expect(cache.has(key)).toBe(true);
      expect(cache.get(key)).toBe(value);
    });

    it('should set null TTL when none given', () => {
      cache.set(key, value);
      expect(cache.items[key].ttl).toBe(null);
    });

    it('should set numeric TTL for a past date', () => {
      cache.set(key, value, ttl);
      expect(cache.items[key].ttl).toBeLessThanOrEqual(Date.now() + ttl * 1000);
    });
  });
});
