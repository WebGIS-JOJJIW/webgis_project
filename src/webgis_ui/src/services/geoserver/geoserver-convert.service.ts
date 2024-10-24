import { environment } from "../../environments/environment";
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'  // This makes the service available globally
})

export class GeoserverConvertService {
    private proxy_geo = `http://${window.location.hostname}:8000/`;
    constructor() {
        this.proxy_geo = environment.geosever;

    }

    // ConvertGeoJSONToWFST(features: FeatureCollection<Geometry, GeoJsonProperties>['features'], dict: string[]): string {
    //     let transactionXml = `
    //        <wfs:Transaction service="WFS" version="1.1.0"
    //        xmlns:wfs="http://www.opengis.net/wfs"
    //        xmlns:ogc="http://www.opengis.net/ogc"
    //        xmlns:gml="http://www.opengis.net/gml"
    //        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    //        xsi:schemaLocation="http://www.opengis.net/wfs
    //                            http://schemas.opengis.net/wfs/1.1.0/wfs.xsd">

    //           <wfs:Insert>

    //       `;

    //     features.forEach((feature) => {
    //       transactionXml += `<${dict[0] + ':' + dict[1]} xmlns:${dict[0]}="${dict[0]}">` //open tag one element 
    //       if (feature.geometry.type === 'Polygon') {
    //         transactionXml += `
    //           <${dict[0] + ':' + dict[2]}>
    //                   ${this.geometryToGml(feature.geometry, dict[3])}
    //           </${dict[0] + ':' + dict[2]}>
    //         `;
    //       } else {
    //         transactionXml += `<${dict[0] + ':' + dict[2]}>
    //           ${this.geometryToGml(feature.geometry, dict[3])}
    //           </${dict[0] + ':' + dict[2]}>`;
    //       }
    //       transactionXml += `</${dict[0] + ':' + dict[1]}>` // end tag element 
    //     });
    //     // <gis:name>Sensor002</gis:name>
    //     // <gis:vector_type>STANDARD_POI</gis:vector_type>
    //     transactionXml += `
    //           </wfs:Insert>
    //         </wfs:Transaction>
    //       `;

    //     return transactionXml;
    //   }

    //   GenerateWFSUpdatePayload(features: FeatureCollection<any, any>['features'], dict: string[]): string {
    //     const [workspace, layerName, geomField, srsName] = dict;

    //     if (!workspace || !layerName || !geomField || !srsName) {
    //       throw new Error('Dictionary array does not have the required values.');
    //     }
    //     let mode = ''
    //     const featureUpdates = features.map(feature => {
    //       let geometryXML: string;
    //       if (feature.geometry.type === 'Polygon') {
    //         let coordinates = feature.geometry.coordinates[0].map((coord: any[]) => coord.reverse().join(',')).join(' ');
    //         geometryXML = `
    //             <wfs:Update typeName="${workspace}:${layerName}">
    //             <wfs:Property>
    //              <wfs:Name>the_geom</wfs:Name>
    //               <wfs:Value>
    //                 <gml:Polygon srsName="${srsName}">
    //                     <gml:exterior>
    //                         <gml:LinearRing>
    //                             <gml:coordinates>${coordinates}</gml:coordinates>
    //                         </gml:LinearRing>
    //                     </gml:exterior>
    //                 </gml:Polygon>
    //               </wfs:Value>
    //             </wfs:Property> 
    //             <ogc:Filter>
    //                 ${`<ogc:FeatureId fid="${feature.id}"/>`}
    //             </ogc:Filter>
    //             </wfs:Update>`;
    //       } else if (feature.geometry.type === 'LineString') {
    //         let coordinates = feature.geometry.coordinates.map((coord: any[]) => coord.reverse().join(',')).join(' ');
    //         geometryXML = `
    //             <wfs:Update typeName="${workspace}:${layerName}">
    //             <wfs:Property>
    //              <wfs:Name>the_geom</wfs:Name>
    //               <wfs:Value>
    //                 <gml:LineString srsName="${srsName}">
    //                     <gml:exterior>
    //                         <gml:LinearRing>
    //                             <gml:coordinates>${coordinates}</gml:coordinates>
    //                         </gml:LinearRing>
    //                     </gml:exterior>
    //                 </gml:LineString>
    //               </wfs:Value>
    //             </wfs:Property> 
    //             <ogc:Filter>
    //                 ${`<ogc:FeatureId fid="${feature.id}"/>`}
    //             </ogc:Filter>
    //             </wfs:Update>`;
    //       } else {
    //         // Handle other geometry types if needed
    //         throw new Error(`Geometry type ${feature.geometry.type} not supported.`);
    //       }

    //       return `${geometryXML}`;
    //     }).join('');

    //     return `<wfs:Transaction service="WFS" version="1.1.0"
    //         xmlns:wfs="http://www.opengis.net/wfs"
    //         xmlns:ogc="http://www.opengis.net/ogc"
    //         xmlns:gml="http://www.opengis.net/gml"
    //         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    //         xsi:schemaLocation="http://www.opengis.net/wfs
    //                             http://schemas.opengis.net/wfs/1.1.0/wfs.xsd">
    //             ${featureUpdates}
    //     </wfs:Transaction>`;
    //   }

    //   GenerateWFSDeletePayload(features: FeatureCollection<any, any>['features'], dict: string[]): string {
    //     const [workspace, layerName, geomField, srsName] = dict;

    //     if (!workspace || !layerName || !geomField || !srsName) {
    //       throw new Error('Dictionary array does not have the required values.');
    //     }
    //     let mode = ''
    //     const featureUpdates = features.map(feature => {
    //       let geometryXML: string;
    //       if (feature.geometry.type === 'Polygon') {
    //         geometryXML = `
    //             <wfs:Update typeName="${workspace}:${layerName}">
    //             <ogc:Filter>
    //                 ${`<ogc:FeatureId fid="${feature.id}"/>`}
    //             </ogc:Filter>
    //             </wfs:Update>`;
    //       } else if (feature.geometry.type === 'LineString') {
    //         geometryXML = `
    //             <wfs:Update typeName="${workspace}:${layerName}">
    //             <ogc:Filter>
    //                 ${`<ogc:FeatureId fid="${feature.id}"/>`}
    //             </ogc:Filter>
    //             </wfs:Update>`;
    //       } else {
    //         // Handle other geometry types if needed
    //         throw new Error(`Geometry type ${feature.geometry.type} not supported.`);
    //       }

    //       return `${geometryXML}`;
    //     }).join('');

    //     return `<wfs:Transaction service="WFS" version="1.1.0"
    //         xmlns:wfs="http://www.opengis.net/wfs"
    //         xmlns:ogc="http://www.opengis.net/ogc"
    //         xmlns:gml="http://www.opengis.net/gml"
    //         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    //         xsi:schemaLocation="http://www.opengis.net/wfs
    //                             http://schemas.opengis.net/wfs/1.1.0/wfs.xsd">
    //             ${featureUpdates}
    //     </wfs:Transaction>`;
    //   }

    //   GeometryToGml(geometry: Geometry, srsName: string): string {
    //     if (geometry.type === 'Point') {
    //       const [x, y] = geometry.coordinates;
    //       return `<gml:Point srsName="${srsName}">
    //         <gml:coordinates>${y},${x}</gml:coordinates>
    //         </gml:Point>`;
    //     } else if (geometry.type === 'LineString') {
    //       const coordinates = geometry.coordinates.map(coord => coord.reverse().join(',')).join(' ');
    //       return `<gml:LineString srsName="${srsName}">
    //           <gml:coordinates>${coordinates}
    //           </gml:coordinates>
    //         </gml:LineString>`;
    //     } else if (geometry.type === 'Polygon') {
    //       const coordinates = geometry.coordinates[0].map(coord => coord.reverse().join(',')).join(' ');
    //       return `<gml:Polygon srsName="${srsName}">
    //              <gml:exterior>
    //               <gml:LinearRing>
    //                 <gml:coordinates>${coordinates}
    //                 </gml:coordinates>
    //               </gml:LinearRing>
    //              </gml:exterior>
    //           </gml:Polygon>`;
    //     }
    //     return '';
    //   }

    //   XmlInsertLayerToPayload(response: InsertLayer): string {
    //     // console.log(response);

    //     var res = `{
    //       "featureType": {
    //         "name": "${response.layerName}",
    //         "nativeName": "${response.layerName}",
    //         "namespace": {
    //           "name": "${response.workspace}",
    //           "href": "${this.proxy}/rest/namespaces/${response.workspace}.json"
    //         },
    //         "title": "${response.layerName}",
    //         "abstract": "${response.description}",
    //         "keywords": {
    //           "string": [
    //             "features",
    //             "${response.layerName}"
    //           ]
    //         },
    //         "nativeCRS": "GEOGCS[\\"WGS 84\\", \\n  DATUM[\\"World Geodetic System 1984\\", \\n    SPHEROID[\\"WGS 84\\", 6378137.0, 298.257223563, AUTHORITY[\\"EPSG\\",\\"7030\\"]], \\n    AUTHORITY[\\"EPSG\\",\\"6326\\"]], \\n  PRIMEM[\\"Greenwich\\", 0.0, AUTHORITY[\\"EPSG\\",\\"8901\\"]], \\n  UNIT[\\"degree\\", 0.017453292519943295], \\n  AXIS[\\"Geodetic longitude\\", EAST], \\n  AXIS[\\"Geodetic latitude\\", NORTH], \\n  AUTHORITY[\\"EPSG\\",\\"4326\\"]]",
    //         "srs": "EPSG:4326",
    //         "nativeBoundingBox": {
    //           "minx": -180,
    //           "maxx": 180,
    //           "miny": -90,
    //           "maxy": 90,
    //           "crs": "EPSG:4326"
    //         },
    //         "latLonBoundingBox": {
    //           "minx": -180,
    //           "maxx": 180,
    //           "miny": -90,
    //           "maxy": 90,
    //           "crs": "EPSG:4326"
    //         },
    //         "projectionPolicy": "FORCE_DECLARED",
    //         "enabled": true,
    //         "store": {
    //           "@class": "dataStore",
    //           "name": "${response.workspace}:${response.dbName}",
    //           "href": "${this.proxy}/rest/workspaces/${response.workspace}/datastores/${response.dbName}.json"
    //         },
    //         "serviceConfiguration": false,
    //         "simpleConversionEnabled": false,
    //         "internationalTitle": "",
    //         "internationalAbstract": "",
    //         "maxFeatures": 0,
    //         "numDecimals": 0,
    //         "padWithZeros": false,
    //         "forcedDecimal": false,
    //         "overridingServiceSRS": false,
    //         "skipNumberMatched": false,
    //         "circularArcPresent": false,`

    //     res += this.addAttr(response.attr);
    //     res += ` ]
    //                 }
    //               }
    //             }`

    //     return res;
    //   }

    //   AddAttr(attr: attr[]): string {
    //     var text = `"attributes": {
    //           "attribute": [`
    //     var vector_text = ''
    //     attr.forEach(res => {
    //       var type = '"binding": "java.lang.String"'

    //       if (res.type?.toLowerCase() == 'polygon') {
    //         type = `"binding": "org.locationtech.jts.geom.Polygon"`
    //         vector_text = 'polygon'
    //       } else if (res.type?.toLowerCase() == 'point') {
    //         type = `"binding": "org.locationtech.jts.geom.Point"`
    //         vector_text = 'standard_poi'
    //       } else if (res.type?.toLowerCase() == 'polyline') {
    //         type = `"binding": "org.locationtech.jts.geom.LineString"`
    //         vector_text = 'polyline'
    //       }
    //       text += `
    //       {
    //         "name": "${res.name}",
    //         "minOccurs": 0,
    //         "maxOccurs": 1,
    //         "nillable": true,
    //         ${type} , 
    //         "description": {
    //             "en-US": "${res.name === 'vector_type' ? vector_text : ''}"
    //           }
    //       } `

    //       if (!(attr[attr.length - 1].name == res.name)) {
    //         text += `,`
    //       }
    //     });
    //     return text;
    //   }

}