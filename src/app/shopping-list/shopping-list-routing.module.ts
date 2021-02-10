import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ShoppingListComponent} from './shopping-list.component';

const routes : Routes =
  [
    {
      path : '' , component : ShoppingListComponent ,
    }
  ];

@NgModule
(
  {
    imports : [RouterModule.forChild(routes)],
    exports : [RouterModule]
  }
)

export class ShoppingListRoutingModule
{
  /*
  This module is used to setup the routes related to shopping-list.
   */
}
