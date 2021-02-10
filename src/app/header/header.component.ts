import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {Subscription} from 'rxjs';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {LoginComponent} from '../auth/login/login.component';
import {SignupComponent} from '../auth/signup/signup.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy
{
  private authListenerSubscription : Subscription;
  public userIsAuthenticated = false;

  collapsed = true;

  constructor(private authService : AuthService , private modalService : NgbModal)
  {

  }

  ngOnInit()
  {
    this.userIsAuthenticated = this.authService.getIsAuth();

    this.authListenerSubscription = this.authService.getAuthStatusListener()
      .subscribe
      (
        (isAuthenticated)=>
        {
          this.userIsAuthenticated = isAuthenticated;
        }
      );
  }

  onLogin()
  {
    const modalReference = this.modalService.open
    (
      LoginComponent,
      {centered : true}
    );
  }

  onSignup()
  {
    const modalReference = this.modalService.open
    (
      SignupComponent,
      {centered : true}
    );
  }

  onLogout()
  {
    this.authService.logout();
  }

  toggleCollapsed()
  {
    this.collapsed = !this.collapsed;
  }

  ngOnDestroy()
  {
    this.authListenerSubscription.unsubscribe();
  }
}
