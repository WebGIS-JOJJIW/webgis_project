import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { GeoserverDataService } from '../../../services/geoserver/geoserver-data.service';
import { MapComponent } from '../../_shared/map/map.component';
import { environment } from '../../../environments/environment.dev';
import { GeoJSONSource } from 'maplibre-gl';
import { SharedService } from '../../_shared/services/shared.service';
import { ActionCableService } from '../../../services/sensors/actioncable.service';

@Component({
  selector: 'app-live-monitor',
  templateUrl: './live-monitor.component.html',
  styleUrl: './live-monitor.component.scss'
})
export class LiveMonitorComponent implements OnInit, AfterViewInit,OnDestroy {
  // isLoading: boolean = true; // Initially set to true to show the loading spinner
  @ViewChild(MapComponent) mapComponent!: MapComponent;

  constructor(private GeoDataService: GeoserverDataService, private _sharedService: SharedService, private actionCableService:ActionCableService) { }
  ngOnInit(): void {
    this._sharedService.setIsLoading(true);
    this.actionCableService.subscribeToChannel('SensorDataChannel', null , (data: any) => {
      // console.log('Received:', data); // Handle incoming real-time data here
    });
  }
  ngAfterViewInit(): void {
    this.mapComponent.addCustomImages();
    this.addRasterOnMap();

    this.mapComponent.map.once('load', () => {
      this.addPOILayer();
    })
  }

  //#region Add POI on Maps 
  addPOILayer(): void {
    const layerId = 'poi_marker'
    this.GeoDataService.getFeatures('sensors').subscribe(res => {
      console.log(res);

      // // Add a new GeoJSON source with clustering enabled
      this.mapComponent.map.addSource(layerId, { 
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: res.features
        },
        cluster: true,               // Enable clustering
        clusterMaxZoom: 14,           // Stop clustering at zoom level 14
        clusterRadius: 50            // Cluster radius in pixels
      });

      // Add clustered points layer
      this.mapComponent.map.addLayer({
        id: `${layerId}-clusters`,
        type: 'circle',
        source: layerId,
        filter: ['has', 'point_count'],  // Only show clusters with this filter
        paint: {
          'circle-color': [
            'step',
            ['get', 'point_count'],
            'red', 100, 'red', 750, 'red'
          ],
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            20, 100, 30, 750, 40
          ]
        }
      });

      // Add unclustered points layer
      this.mapComponent.map.addLayer({
        id: `${layerId}-unclustered`,
        type: 'symbol',
        source: layerId,
        filter: ['!', ['has', 'point_count']], // Filter for unclustered points
        layout: {
          'icon-image': 'custom-marker',
          'icon-size': 1.2,
          'text-field': '{name}',
          'text-offset': [0, 1.15],
          'text-anchor': 'top'
        }
      });

      // Add a layer for the cluster count labels
      this.mapComponent.map.addLayer({
        id: `${layerId}-cluster-count`,
        type: 'symbol',
        source: layerId,
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-size': 16
        }, paint: {
          'text-color': '#ffffff',  // Set the text color to white
        }
      });

      // Click event for clusters to zoom in
      this.mapComponent.map.on('click', `${layerId}-clusters`, (e) => {
        const features = this.mapComponent.map.queryRenderedFeatures(e.point, {
          layers: [`${layerId}-clusters`]
        });

        if (!features.length) return;

        const clusterId = features[0].properties['cluster_id'];

        // Narrowing down the geometry type
        const geometry = features[0].geometry;
        if (geometry.type === 'Point') {
          const coordinates = geometry.coordinates as [number, number]; // Safely cast coordinates
          const source = this.mapComponent.map.getSource(layerId) as GeoJSONSource;
          source.getClusterExpansionZoom(clusterId).then((zoom: number) => {
            this.mapComponent.map.easeTo({
              center: coordinates, // Use the narrowed coordinates
              zoom: zoom
            });
          }).catch((err: any) => {
            console.error('Error getting cluster expansion zoom:', err);
          });
        } else {
          console.error('Expected a Point geometry but got:', geometry.type);
        }
      });

      // Click event for unclustered points
      this.mapComponent.map.on('click', `${layerId}-unclustered`, (e) => {

        const features = this.mapComponent.map.queryRenderedFeatures(e.point, {
          layers: [`${layerId}-unclustered`]
        });
       const name = features[0].properties['name'];

        if (name) {
          // console.log(name);
          this._sharedService.setIsLoading(true);
          this._sharedService.setIsSensorDetails(true,name);
          setTimeout(() => {
            // Code to execute after the delay
            this._sharedService.setIsLoading(false);
          }, 200); 
          
        }

      });
    });
  }
  //#endregion

  //#region  Raster && Road 
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

    this.mapComponent.map.on('load', () => {
      // Add raster layer to the map
      this.mapComponent.addLayer(rasterLayer, rasterSource, rasterSourceId);
    })
    // Retrieve and handle the BBOX for the raster layer

    setTimeout(() => {
      this.getRasterLayerBbox(name);
      this._sharedService.setIsLoading(false);
    }, 1500);
  }

  getRasterLayerBbox(name: string): void {
    this.GeoDataService.getLayerOptions(`${environment.geosever}/geoserver/rest/workspaces/gis/coveragestores/${name}/coverages/${name}.json`)
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
    // console.log('road');

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
      }
    };
    if (this.mapComponent.map.getZoom()) {
      if (this.mapComponent.map.getZoom() > 11) {
        this.mapComponent.addLayer(roadLayer, roadSource, roadsSourceId);
      }
    }

    this.mapComponent.map.on('zoomend', () => {
      // Add road layer to the map
      const zoomLevel = this.mapComponent.map.getZoom();
      if (zoomLevel > 11) {
        // console.log(zoomLevel);
        this.mapComponent.addLayer(roadLayer, roadSource, roadsSourceId);
      } else {
        this.mapComponent.removeLayer(roadLayerId, roadsSourceId);
      }
    })
  }
  //#endregion


  ngOnDestroy(): void {
    this.actionCableService.unsubscribeFromChannel('SensorDataChannel');
  }
}
