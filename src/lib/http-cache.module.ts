import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';

import { CacheInterceptor } from './interceptors/cache.interceptor';
import { CacheService } from './services/cache.service';
import { Config, HTTP_CACHE_CONFIG, defaultConfig } from './providers/interceptor.provider';

@NgModule({
  providers: [
    CacheService,
    { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true },
    { provide: HTTP_CACHE_CONFIG, useValue: defaultConfig }
  ]
})
export class HttpCacheModule {
  static forRoot(config: Config): ModuleWithProviders {
    return {
      ngModule: HttpCacheModule,
      providers: [
        { provide: HTTP_CACHE_CONFIG, useValue: config }
      ]
    };
  }
}
