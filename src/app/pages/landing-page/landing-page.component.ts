import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';


@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LandingPageComponent implements OnInit {

  constructor(private router: Router,
    private loginService: LoginService) { }

  ngOnInit(): void {
  }

  login() {
    this.loginService.loginWithGoogle().subscribe(() => {
      this.router.navigate(['/welcome']);
    });
  }
}
