import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';

import { Config, HTTP_CACHE_CONFIG, defaultConfig } from './providers';
import { CacheInterceptor } from './interceptors';
import { CacheService } from './services';

@NgModule({
  providers: [
    CacheService,
    { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true },
    { provide: HTTP_CACHE_CONFIG, useValue: defaultConfig }
  ]
})
export class CacheModule {
  static forRoot(config?: Config): ModuleWithProviders {
    return {
      ngModule: CacheModule,
      providers: [
        { provide: HTTP_CACHE_CONFIG, useValue: config }
      ]
    };
  }
}
