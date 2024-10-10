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
}
