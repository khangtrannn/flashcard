import { Component, Input } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-hamburger-icon',
  template: `
    <label
      [class.open]="matSidenav.opened"
      class="nav-icon"
      for="nav-toggle"
      (click)="onToggleMenu()"
    >
      <span
        *ngFor="let i of [1, 2, 3]"
        class="nav-icon-bar"
        [style.background-color]="color"
      ></span>
    </label>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 30px;
        height: 30px;
      }

      .nav-icon {
        width: 30px;
        height: 30px;
        padding: 5px;
        position: absolute;
        cursor: pointer;
      }

      .nav-icon-bar {
        display: block;
        width: 20px;
        height: 2px;
        position: absolute;
        transition: all 0.2s ease-out;
      }

      .nav-icon-bar:first-child {
        top: 5px;
      }

      .nav-icon-bar:nth-child(2) {
        top: 50%;
        transform: translateY(-50%);
      }

      .nav-icon-bar:last-child {
        bottom: 5px;
      }

      .nav-icon.open > .nav-icon-bar:first-child {
        transform: rotate(45deg);
        top: 14px;
      }

      .nav-icon.open > .nav-icon-bar:nth-child(2) {
        background-color: transparent !important;
      }

      .nav-icon.open > .nav-icon-bar:last-child {
        transform: rotate(-45deg);
        bottom: 14px;
      }

      .nav-toggle {
        display: none;
      }
    `,
  ],
})
export class HamburgerIconComponent {
  @Input() color: string = 'white';
  @Input() matSidenav!: MatSidenav;

  onToggleMenu(): void {
    if (this.matSidenav.opened) {
      this.matSidenav.close();
    } else {
      this.matSidenav.open();
    }
  }
}
