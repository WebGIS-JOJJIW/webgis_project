import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss'
})
export class SideBarComponent {
  PageLive: string = '';
  isActiveListLayer = false;
  activeEventFull = false;
  isActiveLive = false;
  constructor(
    private router : Router
  ) { }
  ngOnInit(): void {
    
  }

  openListLayer() {
    
  }

  pathDirect(){
    
  }

  openLastEvent(){
  
  }

  checkMenuShow(no:number):boolean{
    return true;
  }
}
