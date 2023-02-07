import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FlashcardComponent } from './components/flashcard/flashcard.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { USE_EMULATOR as USE_DATABASE_EMULATOR } from '@angular/fire/compat/database';


@NgModule({
  declarations: [AppComponent, FlashcardComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideDatabase(() => getDatabase()),
  ],
  providers: [
    {
      provide: USE_DATABASE_EMULATOR,
      useValue: environment.useEmulators ? ['localhost', 9000] : undefined,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
