import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SideBarComponent } from './menu/side-bar/side-bar.component';
import { TopBarComponent } from './menu/top-bar/top-bar.component';
import { EditorMapComponent } from './page/editor-map/editor-map.component';
import { LiveMonitorComponent } from './page/live-monitor/live-monitor.component';

@NgModule({
  declarations: [
    AppComponent,
    SideBarComponent,
    TopBarComponent,
    EditorMapComponent,
    LiveMonitorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
