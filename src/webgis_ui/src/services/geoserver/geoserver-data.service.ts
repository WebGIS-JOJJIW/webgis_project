import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment.dev";
import { map, Observable } from "rxjs";
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'  
})

export class GeoserverDataService {
    private proxy_geo = `http://${window.location.hostname}:8000/`;
    private httpOptions = {}
    constructor(private http: HttpClient) {
        this.proxy_geo = environment.geosever;
        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa('admin:geoserver')
            })
        };
    }

    insertLayer(payload: string, workspace: string, db: string): Observable<any> {
        const url = `${this.proxy_geo}/geoserver/rest/workspaces/${workspace}/datastores/${db}/featuretypes/`
        return this.http.post(url, payload, this.httpOptions);
    }

    putLayer(payload: string, res: any) {
        const url = `${this.proxy_geo}/geoserver/rest/workspaces/${res.workspace}/datastores/${res.dbName}/featuretypes/${res.layerName}`
        return this.http.put(url, payload, this.httpOptions);
    }

    getLayerLists(): Observable<any> {
        const url = `${this.proxy_geo}/geoserver/rest/layers?Accept=application/json`
        return this.http.get<any>(url, this.httpOptions);
    }

    getLayerOptions(Url: string): Observable<any> {
        const re = /http.*8080/gi;
        const corrected_url = Url.replace(re, `${this.proxy_geo}`);
        // const corrected_url = url.replace(re, `http://139.59.221.224:8000`);
        return this.http.get<any>(corrected_url, this.httpOptions);
    }

    getLayerAbstract(LayerName: string): Observable<string> {
        const url = `${this.proxy_geo}/geoserver/rest/workspaces/gis/datastores/gis_db/featuretypes/${LayerName}.json`;
        return this.http.get<any>(url, this.httpOptions).pipe(
            map((res: any) => res.featureType.abstract)
        );
    }

    getFeatures(name: string): Observable<any> {
        const url = `${this.proxy_geo}/geoserver/gis/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=${name}&outputFormat=application/json`
        return this.http.get<any>(url, this.httpOptions);
    }
}
