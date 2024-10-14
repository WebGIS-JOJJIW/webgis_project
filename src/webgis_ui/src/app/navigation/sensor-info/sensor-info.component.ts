import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { SharedService } from '../../_shared/services/shared.service';
import { SensorInfo } from '../../../models/sensorInfo.model';

@Component({
  selector: 'app-sensor-info',
  templateUrl: './sensor-info.component.html',
  styleUrl: './sensor-info.component.scss'
})
export class SensorInfoComponent implements OnInit, OnChanges {
  @Input() data!: SensorInfo[];
  @Input() dataAll!: SensorInfo[];

  isSensorDetails: boolean = false;
  sensorName: string = '';
  lastestSensor!: SensorInfo;
  sensorFilterName!: SensorInfo[];
  mergedImages: any;

  selectedImages: string[] = [];
  selectedImageIndex: number = 0; // Holds the current index for the slider

  constructor(private _sharedService: SharedService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dataAll'] || changes['data']) {
      this.initialSubscribe();
    }
  }

  ngOnInit(): void {
    this.initialSubscribe();
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  initialSubscribe(): void {
    this._sharedService.currentIsSensorDetails.subscribe(res => {
      this.isSensorDetails = res[1];
      if (this.isSensorDetails) {
        this.sensorName = res[0];
        this.lastestSensor = this.data
          .filter((x: any) => x.name.toUpperCase() === this.sensorName.toUpperCase())[0] || [];

        const imgArray = this.data
          .filter(x =>
            x.name.toUpperCase() === this.sensorName.toUpperCase() && 
            x.img && x.img.length > 0)
          .map((x: any) => x.img);

        this.mergedImages = (imgArray.flat()).slice(0, 4);
        this.sensorFilterName = this.dataAll.filter((x: any) => x.name.toUpperCase() === this.sensorName.toUpperCase());
      } else {
        this.sensorName = '';
      }
    });
  }

  onClick(name: string) {
    this._sharedService.setIsLoading(true);
    this._sharedService.setIsSensorDetails(true, name);
    setTimeout(() => {
      this._sharedService.setIsLoading(false);
    }, 200);
  }

  onClose() {
    this._sharedService.resetIsSensorDetails();
  }

  // Open image modal with a slider starting at the clicked image index
  openImageModal(index: number, images: string[]) {
    this.selectedImages = images;
    this.selectedImageIndex = index;
  }

  closeImageModal() {
    this.selectedImages = []; // Clear the images when the modal is closed
  }

  // Navigate to the previous image
  prevImage() {
    this.selectedImageIndex = (this.selectedImageIndex > 0) ? this.selectedImageIndex - 1 : this.selectedImages.length - 1;
  }

  // Navigate to the next image
  nextImage() {
    this.selectedImageIndex = (this.selectedImageIndex < this.selectedImages.length - 1) ? this.selectedImageIndex + 1 : 0;
  }
  
  selectImage(index: number) {
    this.selectedImageIndex = index;
  }
  // Handle keydown events
  handleKeyDown(event: KeyboardEvent) {
    // console.log(event);
    
    if (this.selectedImages.length === 0) return;  // Only handle if modal is open

    switch (event.key) {
      case 'Escape':  // Close modal on Esc key
        this.closeImageModal();
        break;
      case 'ArrowLeft':  // Navigate to the previous image
        this.prevImage();
        break;
      case 'ArrowRight':  // Navigate to the next image
        this.nextImage();
        break;
    }
  }
}
