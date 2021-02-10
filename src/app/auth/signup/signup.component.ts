import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../auth.service';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component
(
  {
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
  }
)
export class SignupComponent implements OnInit
{
  form : FormGroup;

  loading = false;

  constructor(private auhService:AuthService , public activeModal : NgbActiveModal)
  {

  }

  ngOnInit()
  {
    this.form = new FormGroup
    (
      {
        'username' : new FormControl
        (
          null,
          {
            validators :
            [
              Validators.required,
              Validators.minLength(5),
            ]
          }
        ),
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

  onSignup()
  {
    this.loading = true;

    if (this.form.invalid)
    {
      return;
    }

    this.auhService.createUser(this.form.value.username,this.form.value.email,this.form.value.password);

    this.form.reset();

    this.activeModal.close();
  }

}
