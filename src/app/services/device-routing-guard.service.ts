import { Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Injectable({
  providedIn: 'root',
})
export class DeviceRoutingGuardService {
  constructor(private breakpointObserver: BreakpointObserver) {}

  isMobileDevice(): boolean {
    return this.breakpointObserver.isMatched(Breakpoints.Handset);
  }
}
