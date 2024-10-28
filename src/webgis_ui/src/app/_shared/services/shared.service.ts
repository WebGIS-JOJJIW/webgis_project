import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  constructor() { }

  //IsSensorDetails for Show panel on Right Details 
  private isSensorDetails = new BehaviorSubject<[string, boolean]>(['', false]);
  currentIsSensorDetails = this.isSensorDetails.asObservable();
  setIsSensorDetails(res:boolean,name:string){
    this.isSensorDetails.next([name, res]);
  }
  resetIsSensorDetails(){
    this.isSensorDetails.next(['', false]);
  }

  //IsLoading for loading page show 
  private isLoading = new BehaviorSubject<boolean>(false);
  currentIsLoading = this.isLoading.asObservable();
  setIsLoading(res:boolean){
    this.isLoading.next(res);
  }
  resetIsLoading(){
    this.isLoading.next(false);
  }

  //IsStyleChange for reload data when changeStyle 
  private isStyleChanged = new BehaviorSubject<boolean>(false);
  currentIsStyleChanged = this.isStyleChanged.asObservable();
  setIsStyleChanged(res:boolean){
    this.isStyleChanged.next(res);
  }
  resetIsStyleChanged(){
    this.isStyleChanged.next(false);
  }


  //IsReconnect for reconnect to the channel
  private isReconnect = new BehaviorSubject<boolean>(false);
  currentIsReconnect = this.isReconnect.asObservable();
  setIsReconnect(res:boolean){
    this.isReconnect.next(res);
  }
  resetIsReconnect(){
    this.isReconnect.next(false);
  }
}
