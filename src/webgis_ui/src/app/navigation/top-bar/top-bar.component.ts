import { Component } from '@angular/core';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss'
})
export class TopBarComponent {
  isDropdownOpen = false;
  toggleDropdown() {
    // this.isDropdownOpen = !this.isDropdownOpen;
  }

  setCloseAll(str: string) {
    // this.sharedService.setCloseAll();
    
    // this.sharedService.changePage(str);
    
  }
}
