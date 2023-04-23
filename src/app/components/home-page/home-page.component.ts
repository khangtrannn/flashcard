import { Component, Inject } from '@angular/core';
import { IS_MOBILE } from 'src/app/constants';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent {
  constructor(@Inject(IS_MOBILE) public isMobile: boolean) {}
}
