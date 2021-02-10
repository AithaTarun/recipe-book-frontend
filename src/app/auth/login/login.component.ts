import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../auth.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component
(
  {
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
  }
)
export class LoginComponent implements OnInit
{
  form : FormGroup;

  public loading = false;

  constructor(public authService:AuthService , public activeModal : NgbActiveModal)
  {

  }

  ngOnInit()
  {
    this.form = new FormGroup
    (
      {
        'email' : new FormControl
        (
          null,
          {
            validators :
              [
                Validators.required,
                Validators.email
              ]
          }
        ),
        'password' : new FormControl
        (
          null,
          {
            validators :
              [
                Validators.required,
                Validators.minLength(6)
              ]
          }
        )
      }
    );

  }

  onLogin()
  {
    if (this.form.invalid)
    {
      return;
    }

    this.loading = true;

    this.authService.login(this.form.value.email,this.form.value.password);

    this.activeModal.close();
  }

}
