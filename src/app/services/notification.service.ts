import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NotificationModel } from '../models/notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  notification$: BehaviorSubject<NotificationModel> = new BehaviorSubject<NotificationModel>(null);
  
  constructor() { }

  setNotification(notification: NotificationModel) {
    this.notification$.next(notification);
  }

  getNotification() {
    return this.notification$.asObservable();
  }
}
