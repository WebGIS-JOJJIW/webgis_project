import { Component, input, Input, OnInit } from '@angular/core';
import { SensorInfo } from '../../../../models/sensorInfo.model';
import { SharedService } from '../../../_shared/services/shared.service';

@Component({
  selector: 'app-images-details',
  templateUrl: './images-details.component.html',
  styleUrl: './images-details.component.scss'
})
export class ImagesDetailsComponent  {
  @Input() imgArr = []
  @Input() fisrtUrl =''
  @Input() data! : SensorInfo[];
  selectedImageUrl: string | null = null;  // Holds the clicked image URL
  selectedImages: string[] = [];
  selectedImageIndex: number = 0; // Holds the current index for the slider

  constructor(private _sharedService: SharedService) { }
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
}
