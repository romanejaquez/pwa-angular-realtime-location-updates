import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'firebase';
import { Observable } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WelcomePageComponent implements OnInit {

  authUser: Observable<any>;
  
  constructor(
    private router: Router,
    private loginService: LoginService) { }

  ngOnInit(): void {
    this.authUser = this.loginService.getLoggedInUser();
  }

  onTrackPackage() {
    this.router.navigate(['/map']);
  }
}
