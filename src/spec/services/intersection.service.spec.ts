import { BrowserTestingModule } from '@angular/platform-browser/testing';
import { DOCUMENT } from '@angular/common';
import { ElementRef } from '@angular/core';
import { Observable, isObservable, of } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { cold, hot } from 'jasmine-marbles';

import { IntersectionService } from '../../lib/services';

describe('IntersectionService', () => {
  let document: Document;
  let element: ElementRef;
  let event: Event;
  let result$: Observable<any>;
  let service: IntersectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserTestingModule
      ],
      providers: [
        IntersectionService
      ]
    });

    document = TestBed.get(DOCUMENT);
    element = { nativeElement: document.body };
    service = TestBed.get(IntersectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('pageVisible$', () => {
    it('should be an observable', () => {
      expect(isObservable(service.pageVisible$)).toBe(true);
    });

    it('should be an observable', () => {
      expect(isObservable(service.pageVisible$)).toBe(true);
    });

    it('should be true when document.hidden === false', () => {
      spyOnProperty(document, 'hidden').and.returnValue(false);
      event = new Event('visibilitychange');
      document.dispatchEvent(event);

      result$ = hot('a', { a: true });
      expect(service.pageVisible$).toBeObservable(result$);
    });

    it('should be false when document.hidden === true', () => {
      spyOnProperty(document, 'hidden').and.returnValue(true);
      event = new Event('visibilitychange');
      document.dispatchEvent(event);

      result$ = hot('a', { a: false });
      expect(service.pageVisible$).toBeObservable(result$);
    });
  });

  describe('visible', () => {
    it('should be a function', () => {
      expect(typeof service.visible).toBe('function');
    });

    it('should return an observable', () => {
      expect(isObservable(service.visible(element))).toBe(true);
    });

    it('should not emit until after visibilitychange event', () => {
      result$ = hot('----', { a: true });

      expect(service.visible(element)).toBeObservable(result$);
    });

    it('should be true when document.hidden === false and isIntersecting === true', () => {
      spyOnProperty(document, 'hidden').and.returnValue(false);
      spyOn<any>(service, 'elementSubscriber').and.returnValue(o => o.next([{ isIntersecting: true }]));

      result$ = hot('a', { a: true });
      expect(service.visible(element)).toBeObservable(result$);
    });

    it('should be false when document.hidden === true and isIntersecting === true', () => {
      spyOnProperty(document, 'hidden').and.returnValue(true);
      spyOn<any>(service, 'elementSubscriber').and.returnValue(o => o.next([{ isIntersecting: true }]));

      result$ = hot('a', { a: false });
      expect(service.visible(element)).toBeObservable(result$);
    });

    it('should be false when document.hidden === false and isIntersecting === false', () => {
      spyOnProperty(document, 'hidden').and.returnValue(false);
      spyOn<any>(service, 'elementSubscriber').and.returnValue(o => o.next([{ isIntersecting: false }]));

      result$ = hot('a', { a: false });
      expect(service.visible(element)).toBeObservable(result$);
    });

    it('should be false when document.hidden === true and isIntersecting === false', () => {
      spyOnProperty(document, 'hidden').and.returnValue(true);
      spyOn<any>(service, 'elementSubscriber').and.returnValue(o => o.next([{ isIntersecting: true }]));

      result$ = hot('a', { a: false });
      expect(service.visible(element)).toBeObservable(result$);
    });
  });
});
