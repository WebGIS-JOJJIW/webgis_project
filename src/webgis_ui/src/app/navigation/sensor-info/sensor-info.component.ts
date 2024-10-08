import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { SharedService } from '../../_shared/services/shared.service';

@Component({
  selector: 'app-sensor-info',
  templateUrl: './sensor-info.component.html',
  styleUrl: './sensor-info.component.scss'
})
export class SensorInfoComponent implements OnInit {
  isSensorDetails = false;
  sensorName = ''
  constructor(private _sharedService: SharedService) { }
  ngOnInit(): void {
    this.initialSubscribe();
  }

  initialSubscribe(): void {
    this._sharedService.currentIsSensorDetails.subscribe(res => {
      this.isSensorDetails = res[1];
      if (this.isSensorDetails) {
        this.initialDataSensor();
        this.sensorName = res[0];
        console.log(this.sensorName);
        
      } else {
        this.initialDataSensorAll();
        this.sensorName ='';
      }
    }); //subscibe for real IsSensorDetails
  }

  initialDataSensor() {

  }

  initialDataSensorAll() {

  }

  onClose() {
    this._sharedService.resetIsSensorDetails()
  }
}
