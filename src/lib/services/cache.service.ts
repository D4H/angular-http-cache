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

  clear(): any {
    Object.keys(this.items).forEach(key => this.remove(key));
    return null;
  }

  get(key: string): any {
    if (this.has(key)) {
      return this.items[key].value;
    } else {
      return null;
    }
  }

  has(key: string): boolean {
    if (!this.items.hasOwnProperty(key)) {
      return false;
    } else if (this.expired(key)) {
      return this.remove(key);
    } else {
      return true;
    }
  }

  remove(key: string): boolean {
    delete this.items[key];
    return this.has(key);
  }

  set(key: string, value: any, ttl?: number): boolean {
    this.items[key] = {
      key,
      ttl: this.expires(ttl),
      value
    };

    return this.has(key);
  }

  private expired(key: string): boolean {
    return this.items[key].ttl && this.items[key].ttl < Date.now();
  }

  private expires(ttl?: number): number {
    if (Number.isInteger(ttl)) {
      return Date.now() + ttl * 1000;
    } else {
      return null;
    }
  }
}
