import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { GeoserverDataService } from '../../../services/geoserver/geoserver-data.service';
import { MapComponent } from '../../_shared/map/map.component';
import { environment } from '../../../environments/environment.dev';

@Component({
  selector: 'app-live-monitor',
  templateUrl: './live-monitor.component.html',
  styleUrl: './live-monitor.component.scss'
})
export class LiveMonitorComponent implements AfterViewInit{
  @ViewChild(MapComponent) mapComponent!: MapComponent;
  constructor(private GeoDataService: GeoserverDataService){}
  ngAfterViewInit(): void {
    this.addRasterOnMap();
    // Option 1: Try setting a short timeout to ensure the map has fully initialized
    // setTimeout(() => {
    //   if (this.mapComponent) {
    //     // this.addCustomLayer();
        
    //   } else {
    //     console.error('MapComponent is still not initialized.');
    //   }
    // }, 500); // Adjust the delay if needed
  }
  addCustomLayer(): void {
    const source: maplibregl.SourceSpecification = {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [100.5018, 13.7563],
            },
            properties: {}
          }
        ]
      }
    };

    const layer: maplibregl.LayerSpecification = {
      id: 'custom-layer',
      type: 'circle',
      source: 'custom-source',  // The id for the source
      paint: {
        'circle-radius': 6,
        'circle-color': '#B42222'
      }
    };

    // Call the addLayer function in MapComponent
    if (this.mapComponent) {
      this.mapComponent.addLayer(layer, source, 'custom-source');
    } else {
      console.error('MapComponent is not initialized.');
    }
  }

  eventsData = [
    { date: '2024-06-01 10:14:59', type: 'Alarm', system: 'SENSOR', details: 'Sensor 002 Alarm - Human Detection' },
    { date: '2024-06-01 08:02:40', type: 'Info', system: 'SENSOR', details: 'Sensor Health Check - On' },
    { date: '2024-06-01 07:10:00', type: 'Alarm', system: 'SENSOR', details: 'Sensor 001 Alarm - Vehicle Detection' },
    { date: '2024-06-01 07:04:20', type: 'Alarm', system: 'SENSOR', details: 'Sensor 004 Alarm - Vehicle Detection' },
    { date: '2024-06-01 06:43:41', type: 'Info', system: 'SERVER', details: 'Storage Update' },
    { date: '2024-06-01 06:16:00', type: 'Info', system: 'SENSOR', details: 'Sensor 003 Alarm - Human Detection' }
  ];

  columnsConfig = [
    { header: 'วันที่', field: 'date' },
    { header: 'ประเภท', field: 'type' },
    { header: 'ระบบ', field: 'system' },
    { header: 'รายละเอียด', field: 'details' }
  ];

  onSearch(term: string) {
    console.log('Searching for:', term);
  }

  addRasterOnMap(): void {
    const rasterSourceId = 'my-raster-source';
    const rasterLayerId = 'my-raster-layer';
    const name = '02';
    const rasterUrl = `http://138.197.163.159:8000/geoserver/gis/wms?service=WMS&version=1.1.0&request=GetMap&layers=gis%3A${name}&bbox={bbox-epsg-3857}&width=512&height=512&srs=EPSG%3A3857&styles=&format=image%2Fpng&TRANSPARENT=true`;

    const rasterSource: maplibregl.SourceSpecification = {
      type: 'raster',
      tiles: [rasterUrl],
      tileSize: 512
    };

    const rasterLayer: maplibregl.LayerSpecification = {
      id: rasterLayerId,
      type: 'raster',
      source: rasterSourceId,
      minzoom: 0,
      maxzoom: 22
    };

    // Add raster layer to the map
    this.mapComponent.addLayer(rasterLayer, rasterSource, rasterSourceId);

    // Retrieve and handle the BBOX for the raster layer
    this.getRasterLayerBbox(name);
  }

  getRasterLayerBbox(name: string): void {
    this.GeoDataService.GetLayerDetail(`${environment.geosever}/geoserver/rest/workspaces/gis/coveragestores/${name}/coverages/${name}.json`)
      .subscribe(res => {
        const bbox = [
          res.coverage.nativeBoundingBox.minx,
          res.coverage.nativeBoundingBox.miny,
          res.coverage.nativeBoundingBox.maxx,
          res.coverage.nativeBoundingBox.maxy
        ].join(',');

        // Set the road layer on the map using the BBOX
        this.setRoadOnMap(bbox);
      });
  }

  setRoadOnMap(bbox: string): void {
    console.log('road');
    
    const roadsSourceId = 'thailand-roads';
    const roadLayerId = 'roads-layer';
    const roadsUrl = `http://138.197.163.159:8080/geoserver/gis/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=gis:thailand_road&BBOX=${bbox}&outputFormat=application/json`;

    const roadSource: maplibregl.SourceSpecification = {
      type: 'geojson',
      data: roadsUrl
    };

    const roadLayer: maplibregl.LayerSpecification = {
      id: roadLayerId,
      type: 'line',
      source: roadsSourceId,
      paint: {
        'line-color': 'rgba(255, 255, 255, 0.7)',
        'line-width': 2
      },
      minzoom : 14
    };

    // Add road layer to the map
    this.mapComponent.addLayer(roadLayer, roadSource, roadsSourceId);
  }
  
}
