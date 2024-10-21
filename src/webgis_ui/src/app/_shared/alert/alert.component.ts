import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent {
  @Input() message: string = '';
  @Input() type: 'success' | 'danger' | 'warning' | 'info' = 'info';
  @Input() dismissible: boolean = true;
  
  isVisible: boolean = true;

  ngOnInit() {
    setTimeout(() => {
      this.closeToast();
    },2500); // Adjust the time (in milliseconds) as needed
  }
  
  closeToast() {
    this.isVisible = false;
  }
}
