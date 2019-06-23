import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { OperatorFunction } from 'rxjs';

export type NgScrollbarReachedPoint = 'left' | 'top' | 'bottom' | 'right';

@Injectable({
  providedIn: 'root'
})
export class NgScrollbarReachedChecker {

  private checker = new Map();

  constructor() {
    this.checker.set('top', (offset: number): OperatorFunction<any, any> => {
      return map((e: any) => {
        const position = e.target.scrollTop;
        const target = 0;
        return position <= target + offset;
      });
    });
    this.checker.set('left', (offset: number): OperatorFunction<any, any> => {
      return map((e: any) => {
        const position = e.target.scrollLeft;
        const target = 0;
        return position <= target + offset;
      });
    });
    this.checker.set('bottom', (offset: number): OperatorFunction<any, any> => {
      return map((e: any) => {
        const position = e.target.scrollTop + e.target.clientHeight;
        const target = e.target.scrollHeight;
        return position >= target - offset;
      });
    });
    this.checker.set('right', (offset: number): OperatorFunction<any, any> => {
      return map((e: any) => {
        const position = e.target.scrollLeft + e.target.clientWidth;
        const target = e.target.scrollWidth;
        return position >= target - offset;
      });
    });
  }

  getReachedCheckerFunc(target: string): (offset: number) => OperatorFunction<any, any> {
    return this.checker.get(target);
  }
}
