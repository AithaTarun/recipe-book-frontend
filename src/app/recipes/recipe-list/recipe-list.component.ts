import {Component, OnDestroy, OnInit} from '@angular/core';
import {RecipeModel} from '../recipe.model';
import {Subscription} from 'rxjs';
import {RecipesService} from '../recipes.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit,OnDestroy
{
  recipes : RecipeModel[] = [];
  recipeSubscription : Subscription;

  totalRecipes : number;

  recipesPerPage = 8;
  currentPage = 1;

  loading = true;

  constructor(private recipeService : RecipesService)
  {

  }

  ngOnInit()
  {
    this.recipeService.getRecipes();

    this.recipeSubscription = this.recipeService.filteredRecipesUpdated.subscribe
    (
      ({recipes, recipeCount})=>
      {
        this.recipes = recipes;
        this.totalRecipes = recipeCount;

        this.loading=false;
      }
    );

    this.recipeService.favouriteModeChanged(false);
  }

  ngOnDestroy()
  {
    this.recipeSubscription.unsubscribe();
  }

}
