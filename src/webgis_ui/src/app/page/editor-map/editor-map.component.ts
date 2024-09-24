// editor-map.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import * as maplibregl from 'maplibre-gl';

@Component({
  selector: 'app-editor-map',
  templateUrl: './editor-map.component.html',
  styleUrls: ['./editor-map.component.scss']
})
export class EditorMapComponent implements OnInit, OnDestroy {

  ngOnInit(): void {
  }
  ngOnDestroy(): void {
  }
}
