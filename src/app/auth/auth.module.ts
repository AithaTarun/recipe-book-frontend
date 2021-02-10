import {NgModule} from '@angular/core';
import {LoginComponent} from './login/login.component';
import {SignupComponent} from './signup/signup.component';
import {ActivateAccountComponent} from './activate-account/activate-account.component';
import {ReactiveFormsModule} from '@angular/forms';
import {AuthRoutingModule} from './auth-routing.module';
import {CommonModule} from '@angular/common';


@NgModule(
  (
    {
      declarations :
      [
        LoginComponent,
        SignupComponent,
        ActivateAccountComponent
      ],

      imports :
      [
        CommonModule,
        ReactiveFormsModule,

        AuthRoutingModule
      ],

      entryComponents :
      [
        LoginComponent,
        SignupComponent
      ]
    }
  )
)
export class AuthModule
{

}
