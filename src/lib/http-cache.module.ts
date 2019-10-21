import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';

import { CacheInterceptor } from './interceptors';
import { CacheService } from './services';
import { Config, HTTP_CACHE_CONFIG, defaultConfig } from './providers';

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
