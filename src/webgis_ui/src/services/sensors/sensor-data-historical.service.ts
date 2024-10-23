import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.dev';


@Injectable({
    providedIn: 'root'  // This makes the service available globally
})

export class SensorDataHistService{
    constructor(private http: HttpClient){}

    getAllSensorEvents():Observable<any>{
        return this.http.get<any>(`${environment.api}/sensor_data`);
    }
}