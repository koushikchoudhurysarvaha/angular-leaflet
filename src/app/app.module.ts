import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { MapComponent } from './components/map/map.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { FormsModule } from '@angular/forms';
import { LeafletDrawModule } from '@asymmetrik/ngx-leaflet-draw';


@NgModule({
  declarations: [
    AppComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
    LeafletModule,
    FormsModule,
    LeafletDrawModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
