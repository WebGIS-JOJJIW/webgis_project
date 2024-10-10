import { Component, input, Input, OnInit } from '@angular/core';
import { SensorInfo } from '../../../../models/sensorInfo.model';

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

  openImageModal(imageUrl: string) {
    this.selectedImageUrl = imageUrl;  // Set the clicked image URL
  }

  closeImageModal() {
    this.selectedImageUrl = null;  // Clear the selected image URL to hide the modal
  }
}
