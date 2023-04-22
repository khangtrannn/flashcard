import { NgModule } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import {
  BrowserModule,
  HAMMER_GESTURE_CONFIG,
  HammerGestureConfig,
  HammerModule,
} from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgSelectModule } from '@ng-select/ng-select';
import * as Hammer from 'hammerjs';

import { HttpClientModule } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CategoryComponent } from './components/dashboard/components/category/category.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FlashcardComponent } from './components/flashcard-collection/components/flashcard/flashcard.component';
import { FlashcardCollectionComponent } from './components/flashcard-collection/flashcard-collection.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { HamburgerIconComponent } from './components/menu/components/hamburger-icon/hamburger-icon.component';
import { MenuComponent } from './components/menu/menu.component';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';

class MyHammerConfig extends HammerGestureConfig {
  override overrides = {
    swipe: {
      direction: Hammer.DIRECTION_HORIZONTAL,
      threshold: 1,
      velocity: 0.1,
    },
    pan: { direction: Hammer.DIRECTION_HORIZONTAL },
  };
}

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    FlashcardComponent,
    DashboardComponent,
    SafeHtmlPipe,
    CategoryComponent,
    FlashcardCollectionComponent,
    HamburgerIconComponent,
    MenuComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgSelectModule,
    AngularEditorModule,
    NgbModule,
    HammerModule,
    MatSidenavModule,
    ToastrModule.forRoot(),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideDatabase(() => getDatabase()),
  ],
  providers: [
    { provide: FIREBASE_OPTIONS, useValue: environment.firebase },
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: MyHammerConfig,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
