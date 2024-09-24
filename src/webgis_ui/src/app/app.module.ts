import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SideBarComponent } from './navigation/side-bar/side-bar.component';
import { TopBarComponent } from './navigation/top-bar/top-bar.component';
import { EditorMapComponent } from './page/editor-map/editor-map.component';
import { LiveMonitorComponent } from './page/live-monitor/live-monitor.component';
import { LayoutComponent } from './layout/layout.component';
import { MapComponent } from './_shared/map/map.component';
import { SharedTableComponent } from './_shared/shared-table/shared-table.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 

@NgModule({
  declarations: [
    AppComponent,
    SideBarComponent,
    TopBarComponent,
    EditorMapComponent,
    LiveMonitorComponent,
    LayoutComponent,
    MapComponent,
    SharedTableComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
