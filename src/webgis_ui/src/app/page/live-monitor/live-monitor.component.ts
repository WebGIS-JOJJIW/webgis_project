import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { GeoserverDataService } from '../../../services/geoserver/geoserver-data.service';
import { MapComponent } from '../../_shared/map/map.component';
import { environment } from '../../../environments/environment';
import { GeoJSONSource } from 'maplibre-gl';
import { SharedService } from '../../_shared/services/shared.service';
import { ToastService } from '../../../services/toast/toast.service';
import { SensorDataLiveService } from '../../../services/sensors/sensor-data-live.service';

@Component({
  selector: 'app-live-monitor',
  templateUrl: './live-monitor.component.html',
  styleUrl: './live-monitor.component.scss'
})
export class LiveMonitorComponent implements OnInit, AfterViewInit {
  // isLoading: boolean = true; // Initially set to true to show the loading spinner
  @ViewChild(MapComponent) mapComponent!: MapComponent;

  constructor(private GeoDataService: GeoserverDataService, private _sharedService: SharedService, 
    private toastService: ToastService) { }
  ngOnInit(): void {
    this._sharedService.setIsLoading(true);

    this._sharedService.currentIsStyleChanged.subscribe((styleChanged)=>{
      if(styleChanged){
        this.addPOILayer();
        this.addRasterOnMap();
      }
    })
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
    this.GeoDataService.getFeatures('sensors').subscribe({
      next: (res) => {
      // console.log(res);

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
    },
    error : (err)=>{
        this.toastService.show('Connection geoserver error', { classname: 'bg-danger text-light', delay: 2000 });
      }
    });
    
  }
  //#endregion

  //#region  Raster && Road 
  addRasterOnMap(): void {
    const rasterSourceId = 'my-raster-source';
    const rasterLayerId = 'my-raster-layer';
    const name = '02';
    const rasterUrl = `http://138.197.163.159:8000/geoserver/gis/wms?service=WMS&version=1.1.0&request=GetMap&layers=gis%3A${name}&bbox={bbox-epsg-3857}&width=512&height=512&srs=EPSG%3A3857&styles=&format=image%2Fpng&TRANSPARENT=true`;


    
    this.mapComponent.map.on('styledata', () => {
      if (!this.mapComponent.map.getSource(rasterSourceId)) {
        this.mapComponent.map.addSource(rasterSourceId,{
          type: 'raster',
          tiles: [rasterUrl],
          tileSize: 512
        });
      }
      if (!this.mapComponent.map.getLayer(rasterLayerId)) {
        this.mapComponent.map.addLayer({
          id: rasterLayerId,
          type: 'raster',
          source: rasterSourceId,
          minzoom: 0,
          maxzoom: 22
        });
      }
    });

    setTimeout(() => {
      this.getRasterLayerBbox(name);
      this._sharedService.setIsLoading(false);
    }, 1500);
  }

  getRasterLayerBbox(name: string): void {
    this.GeoDataService.getLayerOptions(`${environment.geosever}/geoserver/rest/workspaces/gis/coveragestores/${name}/coverages/${name}.json`)
      .subscribe({next:(res) => {
        const bbox = [
          res.coverage.nativeBoundingBox.minx,
          res.coverage.nativeBoundingBox.miny,
          res.coverage.nativeBoundingBox.maxx,
          res.coverage.nativeBoundingBox.maxy
        ].join(',');

        // Set the road layer on the map using the BBOX
        this.setRoadOnMap(bbox);
      },
      error:(err)=>{
        this.toastService.show('Connection geoserver error', { classname: 'bg-danger text-light', delay: 2000 });
      }});
  }

  //old code 
  // setRoadOnMap(bbox: string): void {
  //   // console.log('road');

  //   const roadsSourceId = 'thailand-roads';
  //   const roadLayerId = 'roads-layer';
  //   const roadsUrl = `http://138.197.163.159:8080/geoserver/gis/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=gis:thailand_road&BBOX=${bbox}&outputFormat=application/json`;

  //   const roadSource: maplibregl.SourceSpecification = {
  //     type: 'geojson',
  //     data: roadsUrl
  //   };

  //   const roadLayer: maplibregl.LayerSpecification = {
  //     id: roadLayerId,
  //     type: 'line',
  //     source: roadsSourceId,
  //     paint: {
  //       'line-color': 'rgba(255, 255, 255, 0.7)',
  //       'line-width': 2,
  //     }
  //   };
  //   if (this.mapComponent.map.getZoom()) {
  //     if (this.mapComponent.map.getZoom() > 11) {
  //       this.mapComponent.addLayer(roadLayer, roadSource, roadsSourceId);
  //     }
  //   }

  //   this.mapComponent.map.on('zoomend', () => {
  //     // Add road layer to the map
  //     const zoomLevel = this.mapComponent.map.getZoom();
  //     if (zoomLevel > 11) {
  //       // console.log(zoomLevel);
  //       this.mapComponent.addLayer(roadLayer, roadSource, roadsSourceId);
  //     } else {
  //       this.mapComponent.removeLayer(roadLayerId, roadsSourceId);
  //     }
  //   })
  // }

  //set name to roads
  setRoadOnMap(bbox: string): void {
    const roadsSourceId = 'thailand-roads';
    const roadLayerId = 'roads-layer';
    const roadLabelLayerId = 'roads-label-layer';
    const roadsUrl = `http://138.197.163.159:8080/geoserver/gis/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=gis:thailand_road&BBOX=${bbox}&outputFormat=application/json`;

    // Fetch the data and ensure UTF-8 encoding
    fetch(roadsUrl)
        .then(response => response.json())
        .then(data => {
            data.features.forEach((feature: any) => {
                // Decode the 'name' property if needed
                if (feature.properties.name) {
                    feature.properties.name = decodeURIComponent(escape(feature.properties.name));
                }
            });

            // Add source and layers with modified data
            const roadSource: maplibregl.SourceSpecification = {
                type: 'geojson',
                data: data
            };

            const roadLayer: maplibregl.LayerSpecification = {
                id: roadLayerId,
                type: 'line',
                source: roadsSourceId,
                paint: {
                    'line-color': 'rgba(255, 255, 255, 0.7)',
                    'line-width': 2,
                }
            };

            const roadLabelLayer: maplibregl.LayerSpecification = {
                id: roadLabelLayerId,
                type: 'symbol',
                source: roadsSourceId,
                layout: {
                    'text-field': ['get', 'name'],
                    'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'],
                    'text-size': 10,
                    'symbol-placement': 'line'
                },
                paint: {
                    'text-color': 'rgba(255, 255, 255, 0.9)',
                    'text-halo-color': 'rgba(0, 0, 0, 0.7)',
                    'text-halo-width': 1
                }
            };

            if (this.mapComponent.map.getZoom()) {
                if (this.mapComponent.map.getZoom() > 11) {
                    this.mapComponent.addLayer(roadLayer, roadSource, roadsSourceId);
                    this.mapComponent.addLayer(roadLabelLayer, roadSource, roadsSourceId);
                }
            }

            this.mapComponent.map.on('zoomend', () => {
                const zoomLevel = this.mapComponent.map.getZoom();
                if (zoomLevel > 11) {
                    this.mapComponent.addLayer(roadLayer, roadSource, roadsSourceId);
                    this.mapComponent.addLayer(roadLabelLayer, roadSource, roadsSourceId);
                } else {
                    this.mapComponent.removeLayer(roadLayerId, roadsSourceId);
                    this.mapComponent.removeLayer(roadLabelLayerId, roadsSourceId);
                }
            });
        });
}
//#endregion
}
