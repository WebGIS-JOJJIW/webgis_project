import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-images-details',
  templateUrl: './images-details.component.html',
  styleUrl: './images-details.component.scss'
})
export class ImagesDetailsComponent  {
  @Input() imgArr = []
  @Input() fisrtUrl =''
  
}
