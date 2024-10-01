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

    InsertLayer(payload: string, workspace: string, db: string): Observable<any> {
        const url = `${this.proxy_geo}/geoserver/rest/workspaces/${workspace}/datastores/${db}/featuretypes/`
        return this.http.post(url, payload, this.httpOptions);
    }

    PutLayer(payload: string, res: any) {
        const url = `${this.proxy_geo}/geoserver/rest/workspaces/${res.workspace}/datastores/${res.dbName}/featuretypes/${res.layerName}`
        return this.http.put(url, payload, this.httpOptions);
    }

    GetLayerLists(): Observable<any> {
        const url = `${this.proxy_geo}/geoserver/rest/layers?Accept=application/json`
        return this.http.get<any>(url, this.httpOptions);
    }

    GetLayerDetail(Url: string): Observable<any> {
        const re = /http.*8080/gi;
        const corrected_url = Url.replace(re, `${this.proxy_geo}`);
        // const corrected_url = url.replace(re, `http://139.59.221.224:8000`);
        return this.http.get<any>(corrected_url, this.httpOptions);
    }

    GetAbstract(LayerName: string): Observable<string> {
        const url = `${this.proxy_geo}/geoserver/rest/workspaces/gis/datastores/gis_db/featuretypes/${LayerName}.json`;
        return this.http.get<any>(url).pipe(
            map((res: any) => res.featureType.abstract)
        );
    }
}