import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {RecipeEditComponent} from "./recipe-edit/recipe-edit.component";
import {RecipeDetailComponent} from "./recipe-detail/recipe-detail.component";
import {RecipeListComponent} from './recipe-list/recipe-list.component';
import {RecipesComponent} from './recipes.component';

const routes : Routes =
  [
    {
      path : '' , component : RecipesComponent ,

      children :
      [
        {
          path : '' , component : RecipeListComponent
        },
      ]
    },
    {
      path : 'new', component: RecipeEditComponent
    },
    {
      path : ':id',component : RecipeDetailComponent
    },
    {
      path : ':id/edit', component: RecipeEditComponent
    }
  ]

@NgModule
(
  {
    imports : [RouterModule.forChild(routes)],
    exports : [RouterModule]
  }
)

export class RecipesRoutingModule
{
  /*
  This module is used to setup the routes related to recipes.
   */
}
