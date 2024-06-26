import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styles: ``
})
export class LoginPageComponent {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  public onLogin(): void {

    this.authService.login('jorge@live.com', '123456')
      .subscribe( user => {

        this.router.navigate(['/']);

      });
  }

}
