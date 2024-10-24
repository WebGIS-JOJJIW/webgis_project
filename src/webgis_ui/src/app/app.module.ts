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
import { SensorInfoComponent } from './navigation/sensor-info/sensor-info.component'; 

// import { BaseChartDirective } from 'ng2-charts';
import { HeaderComponent } from './navigation/sensor-info/header/header.component';
import { FooterComponent } from './navigation/sensor-info/footer/footer.component';
import { ImagesDetailsComponent } from './navigation/sensor-info/images-details/images-details.component';
import { HttpClientModule } from '@angular/common/http';
import { LoadingComponent } from './_shared/loading/loading.component';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    SideBarComponent,
    TopBarComponent,
    EditorMapComponent,
    LiveMonitorComponent,
    LayoutComponent,
    MapComponent,
    SharedTableComponent,
    SensorInfoComponent,
    HeaderComponent,
    FooterComponent,
    ImagesDetailsComponent,
    LoadingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    // BaseChartDirective,
    HttpClientModule,
    NgbToastModule
    
],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
