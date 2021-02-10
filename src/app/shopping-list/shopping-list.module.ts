import {NgModule} from '@angular/core';
import {ShoppingListComponent} from './shopping-list.component';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';
import {ShoppingListRoutingModule} from './shopping-list-routing.module';
import {NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule
(
  {
    declarations :
    [
      ShoppingListComponent
    ],
    imports:
      [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        ShoppingListRoutingModule,
        NgbTooltipModule
      ],
    providers :
    [

    ]
  }
)
export class ShoppingListModule
{

}
