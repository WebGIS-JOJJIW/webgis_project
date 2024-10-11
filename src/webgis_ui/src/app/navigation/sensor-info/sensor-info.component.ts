import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { SharedService } from '../../_shared/services/shared.service';
import { SensorInfo } from '../../../models/sensorInfo.model';

@Component({
  selector: 'app-sensor-info',
  templateUrl: './sensor-info.component.html',
  styleUrl: './sensor-info.component.scss'
})
export class SensorInfoComponent implements OnInit ,OnChanges{
  @Input() data!: SensorInfo[]; // unique sensor name 
  @Input() dataAll! : SensorInfo[];// all sensor event  
  isSensorDetails: boolean = false;
  sensorName: string = ''
  lastestSensor!: SensorInfo;
  sensorFilterName ! : SensorInfo[];
  mergedImages: any;

  constructor(private _sharedService: SharedService) { }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes['data']);
    
  }
  ngOnInit(): void {
    // console.log(this.lastestSensor);
    this.initialSubscribe();
  }

  initialSubscribe(): void {
    this._sharedService.currentIsSensorDetails.subscribe(res => {
      this.isSensorDetails = res[1];
      if (this.isSensorDetails) {
        this.sensorName = res[0];
        this.lastestSensor = this.data
          .filter((x: any) => x.name.toUpperCase() === this.sensorName.toUpperCase())[0] || [];  // Handle no match

        const imgArray = this.data
          .filter(x =>
            x.name.toUpperCase() === this.sensorName.toUpperCase() &&  // Filter by sensor name
            x.img && x.img.length > 0)  // Check if img exists and is not empty
          .map((x: any) => x.img);  // Extract the image field

        this.mergedImages = (imgArray.flat()).slice(0, 4);
        this.sensorFilterName = this.dataAll.filter((x: any) => x.name.toUpperCase() === this.sensorName.toUpperCase())
      } else {
        this.sensorName = '';
      }
    }); //subscibe for real IsSensorDetails
  }

  onClick(name : string){
    this._sharedService.setIsLoading(true);
    this._sharedService.setIsSensorDetails(true,name);
    setTimeout(() => {
      // Code to execute after the delay
      this._sharedService.setIsLoading(false);
    }, 200); 
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
