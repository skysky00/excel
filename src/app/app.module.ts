import { BrowserModule } from '@angular/platform-browser';
import { AgGridModule } from 'ag-grid-angular';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { SafeHtmlPipe } from './SafeHtmlPipe';

@NgModule({
  declarations: [
    AppComponent, SafeHtmlPipe
  ],
  imports: [FormsModule,
    BrowserModule,
    AgGridModule.withComponents([])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
