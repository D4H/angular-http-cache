import { Injectable } from '@angular/core';

export interface Fragment {
  key: string;
  ttl?: number;
  value: any;
}

export interface Cache {
  [key: string]: Fragment;
}

/**
 * Simple Injectable Cache Provider
 * =============================================================================
 */

@Injectable()
export class CacheService {
  readonly items: Cache = {};

  get(key: string): any {
    const fragment: Fragment = this.items[key];

    if (this.expired(fragment)) {
      this.remove(key);
      return null;
    } else if (fragment) {
      return fragment.value;
    } else {
      return null;
    }
  }

  has(key: string): boolean {
    return this.items.hasOwnProperty(key);
  }

  remove(key: string): boolean {
    return delete this.items[key];
  }

  set(key: string, value: any, ttl?: number): boolean {
    this.items[key] = {
      key,
      ttl: this.expires(ttl),
      value
    };

    return this.has(key);
  }

  private expired(fragment: Fragment): boolean {
    return fragment && fragment.ttl && fragment.ttl < Date.now();
  }

  private expires(ttl?: number): number {
    if (Number.isInteger(ttl)) {
      return Date.now() + ttl * 1000;
    } else {
      return null;
    }
  }
}
