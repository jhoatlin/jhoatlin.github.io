import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SleeperfixComponent } from './sleeperfix/view/sleeperfix/sleeperfix.component';

@NgModule({
  declarations: [
    AppComponent,
    SleeperfixComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
