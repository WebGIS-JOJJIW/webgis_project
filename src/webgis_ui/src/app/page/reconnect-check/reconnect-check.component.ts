import { Component, OnInit } from '@angular/core';
import { SensorDataLiveService } from '../../../services/sensors/sensor-data-live.service';

@Component({
  selector: 'app-reconnect-check',
  templateUrl: './reconnect-check.component.html',
  styleUrl: './reconnect-check.component.scss'
})
export class ReconnectCheckComponent implements OnInit{
  constructor(private sensorDataLiveService:SensorDataLiveService){}
  ngOnInit(): void {
    // console.log('ReconnectCheckComponent');
  }

  testConnectionFail(){
    this.sensorDataLiveService.testConnectionFail('SensorDataChannel');
  }

  testDisconnect(){
    this.sensorDataLiveService.testDisconnect('SensorDataChannel');
  }



}
