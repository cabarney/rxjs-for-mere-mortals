import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { JokesComponent } from './jokes/jokes.component';
import { JokesCompleteComponent } from './jokes-complete/jokes-complete.component';

@NgModule({
  declarations: [AppComponent, JokesComponent, JokesCompleteComponent],
  imports: [BrowserModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
