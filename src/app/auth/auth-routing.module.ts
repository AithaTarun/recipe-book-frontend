import {RouterModule, Routes} from '@angular/router';
import {ActivateAccountComponent} from './activate-account/activate-account.component';
import {NgModule} from '@angular/core';


const routes : Routes =
  [
    {
      path : 'activateAccount/:id',
      component : ActivateAccountComponent
    }
  ];

@NgModule
(
  {
    imports :
    [
      RouterModule.forChild(routes)
    ],
    exports :
    [
      RouterModule
    ]
  }
)
export class AuthRoutingModule
{

}
