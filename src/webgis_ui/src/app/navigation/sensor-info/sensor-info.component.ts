import { Component, Input, OnInit } from '@angular/core';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { SharedService } from '../../_shared/services/shared.service';

@Component({
  selector: 'app-sensor-info',
  templateUrl: './sensor-info.component.html',
  styleUrl: './sensor-info.component.scss'
})
export class SensorInfoComponent implements OnInit {
  @Input() data: any;

  isSensorDetails: boolean = false;
  sensorName: string = ''
  lastestSensor: any;

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

        this.lastestSensor = this.data
          .filter((x: any) => x.name.toUpperCase() === this.sensorName.toUpperCase())  // Ensure the item has a date
          .reduce((latest: any, current: any) => {
            return new Date(current.date) > new Date(latest.date) ? current : latest;
          });
          

      } else {
        this.initialDataSensorAll();
        this.sensorName = '';
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

  selectedImageUrl: string | null = null;  // Holds the clicked image URL

  openImageModal(imageUrl: string) {
    this.selectedImageUrl = imageUrl;  // Set the clicked image URL
  }

  closeImageModal() {
    this.selectedImageUrl = null;  // Clear the selected image URL to hide the modal
  }
}
