import { Injectable, EventEmitter } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {

  changeData : EventEmitter<any>;



constructor() {
  this.changeData = new EventEmitter<any>();
}


}
