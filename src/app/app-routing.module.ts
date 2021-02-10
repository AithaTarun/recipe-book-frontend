import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {InvalidRouteComponent} from './invalid-route/invalid-route.component'

const appRoutes : Routes =
  [
    {
      path : '', redirectTo : '/recipes', pathMatch : 'full'
    },
    {
      path : 'recipes',
      loadChildren : ()=> import('./recipes/recipes.module').then(module=>module.RecipesModule)
    },
    {
      path : 'auth',
      loadChildren : ()=> import('./auth/auth.module').then(module=>module.AuthModule)
    },
    {
      path : 'shopping-list',
      loadChildren : ()=> import('./shopping-list/shopping-list.module').then(module=>module.ShoppingListModule)
    },

    {
      path : '**', component : InvalidRouteComponent
    }
  ];

@NgModule
(
  {
    imports :
    [
      RouterModule.forRoot(appRoutes)
    ],
    exports : [RouterModule]
  }
)
export class AppRoutingModule
{

}
