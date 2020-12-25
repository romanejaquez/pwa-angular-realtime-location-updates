import { Component, OnInit } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { NotificationService } from './services/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private afMessaging: AngularFireMessaging,
    private notificationService: NotificationService) { }

  ngOnInit() {
    this.requestPermission();
    this.listen();
  }

  requestPermission() {
    this.afMessaging.requestToken
    .subscribe(
      (token) => { 
        console.log('Permission granted! Save to the server!', token);
        // TODO: send token to server
       },
      (error) => { console.error(error); },  
    );
  }

  listen() {
    this.afMessaging.messages
      .subscribe((message: any) => { 
        console.log(message);
        this.notificationService.setNotification({
          body: message.notification.body,
          title: message.notification.title,
          isVisible: true
        })
      });
  }
}
