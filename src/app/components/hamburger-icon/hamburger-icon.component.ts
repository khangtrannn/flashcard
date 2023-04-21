import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-hamburger-icon',
  template: `
    <input type="checkbox" class="nav-toggle" id="nav-toggle" #checkbox />
    <label class="navicon" for="nav-toggle" (click)="this.toggled.emit(checkbox.checked)">
      <span *ngFor="let i of [1, 2, 3]"
        class="navicon-bar" [style.background-color]="color"></span>
    </label>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 30px;
        height: 30px;
      }

      .navicon {
        width: 30px;
        height: 30px;
        padding: 5px;
        position: absolute;
        cursor: pointer;
      }

      .navicon-bar {
        display: block;
        width: 20px;
        height: 2px;
        position: absolute;
        transition: all 0.2s ease-out;
      }

      .navicon-bar:first-child {
        top: 5px;
      }

      .navicon-bar:nth-child(2) {
        top: 50%;
        transform: translateY(-50%);
      }

      .navicon-bar:last-child {
        bottom: 5px;
      }

      .nav-toggle {
        display: none;
      }
    `,
  ],
})
export class HamburgerIconComponent {
  @Input() color: string = 'white';
  @Output() toggled = new EventEmitter<boolean>();
}
