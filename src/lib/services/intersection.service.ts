import { DOCUMENT } from '@angular/common';
import { ElementRef, Inject, Injectable } from '@angular/core';
import { Observable, Observer, combineLatest, concat, defer, fromEvent, of } from 'rxjs';
import { distinctUntilChanged, map, mergeMap, pluck } from 'rxjs/operators';

export interface IntersectionOptions {
  root?: HTMLElement;
  rootMargin?: string;
  threshold?: number;
}

/**
 * Intersection Observer Service
 * =============================================================================
 * Given an ElementRef, return true/false: is it visible in the viewport?
 *
 * As with CacheInterceptor, you really should not ever use this code outside of
 * special circumstances. Existing tools such as ng-lazyload-image do a better
 * job for all common use cases.
 *
 * @example
 *
 *   constructor(
 *     private readonly gooseService: GooseService,
 *     private readonly host: ElementRef,
 *     private readonly intersectionService: IntersectionService
 *   ) {
 *     this.mischief$ = this.intersectionService.visible(this.host).pipe(
 *       filter(Boolean),
 *       switchMap(() => this.gooseService.mischief(this.goose).pipe(
 *         startWith(this.mischief)
 *       )),
 *     );
 *   }
 *
 * @see https://blog.angularindepth.com/9280c149bbc
 * @see https://blog.angularindepth.com/f3c5ff4597d2
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
 * @see https://github.com/tjoskar/ng-lazyload-image
 */

// @dynamic
@Injectable({ providedIn: 'root' })
export class IntersectionService {
  pageVisible$: Observable<boolean>;

  constructor(@Inject(DOCUMENT) private readonly document: Document) {
    this.pageVisible$ = concat(
      defer(() => of(!document.hidden)),
      fromEvent(document, 'visibilitychange').pipe(map((): boolean => !document.hidden))
    );
  }

  visible(element: ElementRef, options?: IntersectionOptions): Observable<boolean> {
    const elementVisible$: Observable<boolean>
      = Observable.create(this.elementSubscriber(element, options)).pipe(
        mergeMap((entries: Array<IntersectionObserverEntry>) => entries),
        pluck('isIntersecting'),
        distinctUntilChanged()
      );

    return combineLatest(
      this.pageVisible$,
      elementVisible$,
      (pageVisible, elementVisible): boolean => Boolean(pageVisible && elementVisible)
    ).pipe(
      distinctUntilChanged()
    );
  }

  private elementSubscriber(element: ElementRef, options?: IntersectionOptions): any {
    return (observer: Observer<any>): () => void => {
      const intersection: IntersectionObserver = new IntersectionObserver(
        (entries: Array<IntersectionObserverEntry>) => observer.next(entries),
        options
      );

      intersection.observe(element.nativeElement);
      return () => intersection.disconnect();
    };
  }
}
