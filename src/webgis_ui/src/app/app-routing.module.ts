import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LiveMonitorComponent } from './page/live-monitor/live-monitor.component';
import { EditorMapComponent } from './page/editor-map/editor-map.component';
import { ReconnectCheckComponent } from './page/reconnect-check/reconnect-check.component';

const routes: Routes = [
  { path: 'live-monitor', component: LiveMonitorComponent },
  { path: 'editor-map', component: EditorMapComponent },
  { path: 'reconnect-check', component: ReconnectCheckComponent },
  { path: '', redirectTo: 'live-monitor', pathMatch: 'full' },
  { path: '**', redirectTo: 'live-monitor', pathMatch: 'full' },  // Fallback route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
